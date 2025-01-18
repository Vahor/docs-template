import type { Options } from "rehype-pretty-code";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export const shikiOptions = {
	theme: "aurora-x",
	keepBackground: false,
	defaultLang: "plaintext",
} satisfies Options;

export const shiki = createHighlighterCore({
	langs: [import("@shikijs/langs/json")],
	themes: [import("@shikijs/themes/aurora-x")],
	engine: createJavaScriptRegexEngine(),
});
