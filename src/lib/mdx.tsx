import { OpenapiQuery } from "@/components/openapi/openapi-query";
import { OpenapiSchema } from "@/components/openapi/openapi-schema";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Info, Note, Tip, Warning } from "@/components/ui/callout";
import { CodeBlock } from "@/components/ui/code/code-block";
import { CodeGroup } from "@/components/ui/code/code-group";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNodeText } from "@/lib/getNodeText";
import type { MDXComponents } from "mdx/types";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";
import { useId } from "react";

const MarkColor: React.FC<{ children: string; color: string }> = ({
	children,
	color,
}) => {
	return (
		<code className="rounded-lg p-1.5 bg-zinc-950 dark:bg-zinc-900 not-prose relative text-xs">
			<mark data-highlighted-chars="" data-chars-id={color}>
				{children}
			</mark>
		</code>
	);
};

const Col: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-full mx-0">
			{children}
		</div>
	);
};

const mdxComponents: MDXComponents = {
	table: Table,
	thead: TableHeader,
	th: TableHead,
	td: TableCell,
	tr: TableRow,
	tbody: TableBody,
	a: ({ children, href, ...props }) => {
		const isHash = href?.startsWith("#");
		const isExternal = href?.startsWith("http");
		return (
			<Link
				href={href}
				target={!isHash && isExternal ? "_blank" : undefined}
				{...props}
			>
				{children}
			</Link>
		);
	},

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

	Col,

	OpenapiQuery: OpenapiQuery,
	OpenapiSchema: OpenapiSchema,
	CodeGroup: CodeGroup,

	Accordion: ({ children, multiple, props }) => (
		<Accordion
			type={multiple ? "multiple" : "single"}
			collapsible={multiple ? undefined : true}
			className="not-prose"
			{...props}
		>
			{children}
		</Accordion>
	),
	AccordionItem: ({ children, title, props }) => {
		const id = useId();
		return (
			<AccordionItem value={id} {...props}>
				<AccordionTrigger>{title}</AccordionTrigger>
				<AccordionContent>{children}</AccordionContent>
			</AccordionItem>
		);
	},
	Tabs: ({ children, defaultValue, props }) => {
		const childrenArray = Array.isArray(children) ? children : [children];
		const _defaultValue = defaultValue || childrenArray[0]?.props?.title;
		return (
			<Tabs defaultValue={_defaultValue} {...props}>
				<TabsList>
					{childrenArray.map((child) => {
						const title = child?.props?.title;
						return (
							<TabsTrigger key={title} value={title}>
								{title}
							</TabsTrigger>
						);
					})}
				</TabsList>
				{children}
			</Tabs>
		);
	},
	TabsItem: ({ children, title, props }) => {
		return (
			<TabsContent value={title} {...props}>
				{children}
			</TabsContent>
		);
	},
	AccordionTrigger,
	AccordionContent,
};

interface MdxProps {
	code: string;
}

export const Mdx = ({ code }: MdxProps) => {
	const MDXContent = useMDXComponent(code);
	return <MDXContent components={mdxComponents} />;
};
