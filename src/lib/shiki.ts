import type { Options } from "rehype-pretty-code";
import { createHighlighter } from "shiki/bundle/web";

export const shikiOptions = {
	theme: "aurora-x",
	keepBackground: false,
	defaultLang: "plaintext",
} satisfies Options;

export const shiki = createHighlighter({
	langs: ["json"],
	themes: [shikiOptions.theme],
});
