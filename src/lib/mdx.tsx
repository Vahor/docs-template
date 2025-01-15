import { CopyButton } from "@/components/copy-button";
import { OpenapiQuery } from "@/components/openapi/openapi-query";
import { OpenapiSchema } from "@/components/openapi/openapi-schema";
import { cn } from "@/lib/utils";
import type { MDXComponents } from "mdx/types";
import { useMDXComponent } from "next-contentlayer2/hooks";

const mdxComponents: MDXComponents = {
	code: ({ className, ...props }) => (
		<code
			className={cn(
				"relative whitespace-nowrap rounded py-[0.2rem] font-mono text-sm",
				className,
			)}
			{...props}
		/>
	),
	pre: ({ className, ...props }) => {
		// @ts-ignore
		const { __raw_source, children, ...rest } = props;
		// @ts-ignore
		const language = rest["data-language"];
		return (
			<pre
				className={cn("group relative mb-4 rounded-lg border py-4", className)}
				{...rest}
			>
				{children}
				<span className="absolute top-0 right-0 p-1 text-muted-foreground text-xs">
					{language}
				</span>
				<CopyButton
					value={__raw_source}
					className="absolute top-4 right-10 opacity-0 group-hover:opacity-100"
				/>
			</pre>
		);
	},
	ul: ({ className, ...props }) => (
		<ul className={cn("mt-4 list-disc pl-4 md:pl-8", className)} {...props} />
	),
	ol: ({ className, ...props }) => (
		<ol
			className={cn(
				"mt-4 list-decimal pl-4 md:pl-8 [&>ol]:mt-1 [&>ol]:list-lower-alpha [&>ul]:mt-1",
				className,
			)}
			{...props}
		/>
	),
	li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<li
			className={cn(
				"mt-2 pl-1 md:pl-2 [&>ol]:mt-1 [&>ol]:list-lower-alpha [&>ul]:mt-1",
				className,
			)}
			{...props}
		/>
	),
	hr: ({ className, ...props }) => (
		<hr className={cn("my-4 md:my-8", className)} {...props} />
	),
	callout: ({ className, type, ...props }) => {
		return (
			<div className={cn("my-4 md:my-8", className)} {...props}>
				Custom callout of type {type}
				{props.children}
			</div>
		);
	},

	OpenapiQuery: OpenapiQuery,
	OpenapiSchema: OpenapiSchema,
};

interface MdxProps {
	code: string;
}

export const Mdx = ({ code }: MdxProps) => {
	const MDXContent = useMDXComponent(code);
	return <MDXContent components={mdxComponents} />;
};
