import { OpenapiQuery } from "@/components/openapi/openapi-query";
import { OpenapiSchema } from "@/components/openapi/openapi-schema";
import { Check, Info, Note, Tip, Warning } from "@/components/ui/callout";
import { CodeBlock } from "@/components/ui/code/code-block";
import { CodeGroup } from "@/components/ui/code/code-group";
import { getNodeText } from "@/lib/getNodeText";
import { cn } from "@/lib/utils";
import type { MDXComponents } from "mdx/types";
import { useMDXComponent } from "next-contentlayer2/hooks";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const MarkColor: React.FC<{ children: string; color: string }> = ({
	children,
	color,
}) => {
	return (
		<code className="rounded-lg p-1.5 bg-zinc-950 dark:bg-zinc-900 not-prose relative">
			<mark data-highlighted-chars="" data-chars-id={color}>
				{children}
			</mark>
		</code>
	);
};

const mdxComponents: MDXComponents = {
	table: Table,
	thead: TableHeader,
	th: TableHead,
	td: TableCell,
	tr: TableRow,
	tbody: TableBody,

	code: ({ className, ...props }) => (
		<code
			className={cn(
				"relative whitespace-nowrap bg-zinc-950 dark:bg-zinc-900 p-1.5 rounded-lg not-prose leading-8 text-white",
				className,
			)}
			{...props}
		/>
	),
	figure: ({ children, ...props }) => {
		const isCode = props["data-rehype-pretty-code-figure"] !== undefined;
		if (isCode) {
			const title = children.length > 1 ? getNodeText(children[0]) : "";
			const childrenToRender =
				children.length > 1 ? children.slice(1) : children;
			return (
				<CodeBlock {...props} filename={title}>
					{childrenToRender}
				</CodeBlock>
			);
		}
		return <figure {...props} />;
	},
	callout: ({ type, ...props }) => {
		switch (type) {
			case "info":
				return <Info {...props} />;
			case "warning":
				return <Warning {...props} />;
			case "note":
				return <Note {...props} />;
			case "tip":
				return <Tip {...props} />;
			case "check":
				return <Check {...props} />;
			default:
				throw new Error(`Unknown callout type: ${type}`);
		}
	},

	// Higlight colors (same as in code.css)
	R: ({ children }) => <MarkColor color="r">{children}</MarkColor>,
	G: ({ children }) => <MarkColor color="g">{children}</MarkColor>,
	B: ({ children }) => <MarkColor color="b">{children}</MarkColor>,
	Y: ({ children }) => <MarkColor color="y">{children}</MarkColor>,

	OpenapiQuery: OpenapiQuery,
	OpenapiSchema: OpenapiSchema,
	CodeGroup: CodeGroup,
};

interface MdxProps {
	code: string;
}

export const Mdx = ({ code }: MdxProps) => {
	const MDXContent = useMDXComponent(code);
	return <MDXContent components={mdxComponents} />;
};
