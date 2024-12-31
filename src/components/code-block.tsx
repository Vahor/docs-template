import { shikiOptions } from "@/lib/shiki";
import { codeToHtml, type BundledLanguage } from "shiki";

interface CodeBlockProps {
	children: string;
	lang: BundledLanguage;
}

export async function CodeBlock(props: CodeBlockProps) {
	const out = await codeToHtml(props.children, {
		lang: props.lang,
		themes: shikiOptions.theme,
	});

	// biome-ignore lint/security/noDangerouslySetInnerHtml: Well, this is a code block
	return <div dangerouslySetInnerHTML={{ __html: out }} />;
}
