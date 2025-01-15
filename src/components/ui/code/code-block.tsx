import { CopyToClipboardButton } from "@/components/ui/code/clipboard-button";
import { getNodeText } from "@/lib/getNodeText";
import { clsx } from "clsx";
import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	type ReactElement,
} from "react";

export interface CodeBlockPropsBase {
	filename?: string;
}

export type CodeBlockProps = CodeBlockPropsBase &
	Omit<ComponentPropsWithoutRef<"div">, keyof CodeBlockPropsBase>;

export const CodeBlock = forwardRef(function CodeBlock(
	{ filename, children, className, ...props }: CodeBlockProps,
	ref: ForwardedRef<HTMLDivElement>,
) {
	const Button = (
		props: Partial<ComponentPropsWithoutRef<typeof CopyToClipboardButton>>,
	) => <CopyToClipboardButton textToCopy={getNodeText(children)} {...props} />;

	return (
		<div
			className={clsx(
				"not-prose relative my-3 max-h-[650px] overfow-x-auto rounded-xl bg-zinc-950 dark:bg-zinc-900",
				"group-[.code-group]:my-0",
				className,
			)}
			ref={ref}
			{...props}
		>
			{filename ? (
				<CodeTabBar filename={filename}>
					<Button className={"relative"} />
				</CodeTabBar>
			) : (
				<Button className="absolute top-5 right-5 z-[1] text-zinc-500 hover:text-zinc-400" />
			)}
			<div
				className="block overlow-auto px-4 py-5 relative"
				style={{ fontVariantLigatures: "none" }}
			>
				{children}
			</div>
		</div>
	);
});

function CodeTabBar({
	filename,
	children,
}: {
	filename: string;
	children?: ReactElement;
}) {
	return (
		<div className="flex items-center justify-between border-b border-zinc-800 rounded-t-xl bg-zinc-900 px-3 pr-5 py-3">
			<div className="mr-auto text-xs font-semibold text-white">{filename}</div>
			{children && (
				<div className="text-zinc-500 hover:text-zinc-400 size-5">
					{children}
				</div>
			)}
		</div>
	);
}
