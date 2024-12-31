import * as fs from "node:fs";
import {
	transformerNotationDiff,
	transformerRenderWhitespace,
} from "@shikijs/transformers";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypeSlug from "rehype-slug";
import codeImport from "remark-code-import";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

import type { ShikiTransformer } from "shiki";

const slug = (path: string) => {
	const withoutPrefix = path.split("/").splice(-1)[0];
	return withoutPrefix;
};

const lastModified = (path: string) => {
	const stats = fs.statSync(`${contentFolder}/${path}`);
	const date = stats.mtime;
	return date;
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
	},
}));

function shikiCustom(): ShikiTransformer {
	return {
		name: "@vahor/skiki",
		pre(node) {
			node.properties.__raw_source = this.source;
		},
	};
}

const highlightPlugin = () => {
	return rehypePrettyCode({
		theme: {
			dark: "catppuccin-mocha",
			light: "catppuccin-latte",
		},
		keepBackground: false,
		defaultLang: "plaintext",
		transformers: [
			transformerRenderWhitespace(),
			transformerNotationDiff(),
			transformerTwoslash({
				explicitTrigger: true,
				renderer: rendererRich(),
			}),
			shikiCustom(),
		],
	});
};

export default makeSource({
	contentDirPath: contentFolder,
	documentTypes: [Post, Changelog],
	mdx: {
		rehypePlugins: [highlightPlugin, rehypeSlug, codeImport],
		remarkPlugins: [remarkGfm],
	},
});
