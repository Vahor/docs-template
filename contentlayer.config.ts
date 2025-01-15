import * as fs from "node:fs";
import { shikiOptions } from "@/lib/shiki";
import {
	transformerNotationDiff,
	transformerRenderWhitespace,
} from "@shikijs/transformers";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import GithubSlugger from "github-slugger";
import { h } from "hastscript";
import { toString as toStringMdx } from "mdast-util-to-string";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { remark } from "remark";
import codeImport from "remark-code-import";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import type { ShikiTransformer } from "shiki";
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

export const Post = defineDocumentType(() => ({
	name: "Post",
	filePathPattern: "post/**/*.mdx",
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		description: { type: "string", required: true },
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
			transformerTwoslash({
				explicitTrigger: true,
				renderer: rendererRich(),
			}),
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
	rehypePlugins: [highlightPlugin, rehypeSlug, codeImport],
	remarkPlugins: [
		remarkGfm,
		remarkDirective,
		addCalloutComponent,
		headingOffset,
	],
};

export default makeSource({
	contentDirPath: contentFolder,
	documentTypes: [Post, Changelog],
	mdx: mdxOptions,
});
