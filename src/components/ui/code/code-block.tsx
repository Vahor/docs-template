// based on https://mintlify.com/docs/content/components/code

import { CopyToClipboardButton } from "@/components/ui/code/clipboard-button";
import { Tag } from "@/components/ui/tag";
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
	children: ReactElement | ReactElement[];
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

	let header: ReactElement | undefined = undefined;
	if (Array.isArray(children)) {
		header = Array.isArray(children) ? children[1] : children;
		children = children[0];
		console.log(header);
	}

	return (
		<div
			className={clsx(
				"not-prose relative my-3 max-h-[650px] overfow-x-auto rounded-2xl bg-zinc-900",
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
				<Button className="absolute top-[18px] right-5 z-[1] text-zinc-500 hover:text-zinc-400" />
			)}
			{header && <CodePanelHeader header={header} />}

			<div
				className="block overlow-auto relative [&_code]:py-4 [&_code>span]:px-4"
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
		<div className="flex items-center justify-between border-b border-zinc-800 rounded-t-2xl bg-zinc-800 px-3 pr-5 py-3">
			<div className="mr-auto text-xs font-semibold text-white">{filename}</div>
			{children && (
				<div className="text-zinc-500 hover:text-zinc-400 size-5">
					{children}
				</div>
			)}
		</div>
	);
}

function CodePanelHeader({
	header,
}: {
	header: ReactElement;
}) {
	const text = getNodeText(header);
	const [tag, ...urls] = text.split(" ");
	const url = urls.join(" ");
	if (!url && !tag) {
		return null;
	}

	return (
		<div className="flex h-9 items-center gap-2 border-b border-zinc-800 px-4">
			{tag && (
				<div className="dark flex">
					<Tag variant="small">{tag}</Tag>
				</div>
			)}
			{tag && url && <span className="h-0.5 w-0.5 rounded-full bg-zinc-500" />}
			{url && <span className="font-mono text-xs text-zinc-400">{url}</span>}
		</div>
	);
}
