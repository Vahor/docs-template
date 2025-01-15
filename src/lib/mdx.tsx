import { CopyButton } from "@/components/copy-button";
import { OpenapiQuery } from "@/components/openapi/openapi-query";
import { OpenapiSchema } from "@/components/openapi/openapi-schema";
import { Check, Info, Note, Tip, Warning } from "@/components/ui/callout";
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
