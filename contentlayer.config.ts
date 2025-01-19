import * as fs from "node:fs";
import path from "node:path";
import { shikiOptions } from "@/lib/shiki";
import {
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationFocus,
	transformerRenderWhitespace,
} from "@shikijs/transformers";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import GithubSlugger from "github-slugger";
import { h } from "hastscript";
import { toString as toStringMdx } from "mdast-util-to-string";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { remark } from "remark";
import remarkDirective from "remark-directive";
import emoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

const slug = (path: string) => {
	const withoutPrefix = path.split("/").splice(-1)[0];
	return withoutPrefix;
};

const lastModified = (path: string) => {
	const stats = fs.statSync(`${contentFolder}/${path}`);
	const date = stats.mtime;
	return date;
};

const extractToc = async (raw: string) => {
	const headings: { depth: number; value: string; slug: string }[] = [];
	const slugger = new GithubSlugger();

	await remark()
		.use(remarkParse)
		.use(() => (tree) => {
			visit(tree, "heading", (node) => {
				const text = toStringMdx(node);
				headings.push({
					// @ts-ignore
					depth: node.depth,
					value: text,
					slug: slugger.slug(text),
				});
			});
		})
		.process(raw);

	return headings;
};

const contentFolder = "content";

export const Api = defineDocumentType(() => ({
	name: "Api",
	filePathPattern: "api/**/*.mdx",
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		description: { type: "string", required: true },
		method: { type: "string", required: true },
	},
	computedFields: {
		slug: {
			type: "string",
			resolve: (post) => slug(post._raw.flattenedPath),
		},
		dateModified: {
			type: "date",
			resolve: (post) => {
				const sourceFilePath = post._raw.sourceFilePath;
				return lastModified(sourceFilePath);
			},
		},
		toc: {
			type: "json",
			resolve: async (post) => {
				return extractToc(post.body.raw);
			},
		},
	},
}));

export const Changelog = defineDocumentType(() => ({
	name: "Changelog",
	filePathPattern: "changelog/**/*.mdx",
	contentType: "mdx",
	fields: {
		version: { type: "string", required: true },
		releaseDate: { type: "date", required: true },
	},
	computedFields: {
		slug: {
			type: "string",
			resolve: (post) => slug(post._raw.flattenedPath),
		},
		title: {
			type: "string",
			resolve: (post) => `Changelog - ${post.version}`,
		},
		description: {
			type: "string",
			resolve: (post) => `Changelog - ${post.version}`,
		},
		dateModified: {
			type: "date",
			resolve: (post) => {
				const sourceFilePath = post._raw.sourceFilePath;
				return lastModified(sourceFilePath);
			},
		},
		toc: {
			type: "json",
			resolve: async (post) => {
				return extractToc(post.body.raw);
			},
		},
	},
}));

const highlightPlugin = () => {
	return rehypePrettyCode({
		...shikiOptions,
		transformers: [
			transformerRenderWhitespace(),
			transformerNotationDiff(),
			transformerNotationErrorLevel(),
			transformerNotationFocus(),
		],
	});
};

function addCalloutComponent() {
	return (tree: Node) => {
		visit(tree, (node) => {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				const data = node.data || {};
				const tagName = "callout";

				node.attributes = node.attributes || {};
				node.attributes.type = node.attributes.type || node.name || "note";
				data.hName = tagName;
				data.hProperties = h(tagName, node.attributes || {}).properties;
				node.data = data;
			}
		});
	};
}

function includeMarkdown() {
	// Adapted from https://github.com/hashicorp/remark-plugins/blob/main/plugins/include-markdown/index.js
	return (tree: Node, file: any) => {
		visit(tree, "paragraph", (node) => {
			const includeMatch = node.children[0].value?.match(
				/^@include\s['"](.*)['"]$/,
			);
			if (!includeMatch) return;
			try {
				const includePath = path.join(file.dirname, includeMatch[1]);
				const contents = fs.readFileSync(includePath, "utf8");

				const extension = includePath.match(/\.(\w+)$/)[1];
				const isMdx = extension === "mdx";
				if (isMdx) {
					const processor = remark();
					for (const plugin of mdxOptions.remarkPlugins) {
						processor.use(plugin);
					}
					const ast = processor.parse(contents);
					const result = processor.runSync(ast, contents);
					node.type = "root";
					node.children = result.children;
					node.position = result.position;
					return;
				}

				node.type = "code";
				node.lang = extension;
				node.value = contents.replace(/\n$/, "");
			} catch (err) {
				console.error(err);
			}
		});
	};
}

function headingOffset() {
	return (tree: Node) => {
		visit(tree, "heading", (node) => {
			// Offset headings by one level (to keep the title as h1)
			const depth = node.depth;
			node.depth = depth + 1;
		});
	};
}

export const mdxOptions = {
	rehypePlugins: [highlightPlugin, rehypeSlug],
	remarkPlugins: [
		remarkGfm,
		remarkDirective,
		addCalloutComponent,
		headingOffset,
		includeMarkdown,
		emoji,
	],
};

export default makeSource({
	contentDirPath: contentFolder,
	documentTypes: [Api, Changelog],
	mdx: mdxOptions,
});
