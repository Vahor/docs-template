"use client";

// based on https://mintlify.com/docs/content/components/code

import { CopyToClipboardButton } from "@/components/ui/code/clipboard-button";
import { CodeWrapButton } from "@/components/ui/code/code-wrap-button";
import { getNodeText } from "@/lib/getNodeText";
import { clsx } from "clsx";
import {
	type ComponentPropsWithoutRef,
	type ReactElement,
	useRef,
} from "react";

export interface CodeBlockPropsBase {
	filename?: string;
	children: OneOrMany<ReactElement | null>;
	allowFullScreen?: boolean;
	actions?: boolean;
}

export type CodeBlockProps = CodeBlockPropsBase &
	Omit<ComponentPropsWithoutRef<"div">, keyof CodeBlockPropsBase>;

export const CodeBlock = function CodeBlock({
	filename,
	children,
	className,
	actions = true,
	...props
}: CodeBlockProps) {
	const Button = (
		props: Partial<ComponentPropsWithoutRef<typeof CopyToClipboardButton>>,
	) => <CopyToClipboardButton textToCopy={getNodeText(children)} {...props} />;

	const wrapperRef = useRef<HTMLDivElement>(null);

	// TODO: use captions
	let header: ReactElement | null = null;
	if (Array.isArray(children)) {
		header = Array.isArray(children) ? children[1] : children;
		children = children[0];
	}

	return (
		<div
			className={clsx(
				"not-prose relative my-3 rounded-2xl bg-zinc-900",
				"dark",
				"group/my-0",
				"group",
				className,
			)}
			data-code-block
			ref={wrapperRef}
			{...props}
		>
			{filename && (
				<CodeTabBar filename={filename}>
					{actions ? (
						<>
							<CodeWrapButton wrapperRef={wrapperRef} />
							<Button />
						</>
					) : null}
				</CodeTabBar>
			)}

			{header && <CodeHeader>{header}</CodeHeader>}

			<div
				className="relative h-full mr-2"
				style={{ fontVariantLigatures: "none" }}
			>
				{!filename && actions && (
					<div className="flex items-center gap-2 absolute top-[16px] right-4 z-[1] text-zinc-500">
						<CodeWrapButton wrapperRef={wrapperRef} />
						<Button />
					</div>
				)}

				{children}
			</div>
		</div>
	);
};

function CodeHeader({ children }: { children: ReactElement }) {
	return (
		<div className="flex h-9 items-center gap-2 border-b border-zinc-800 bg-zinc-900 bg-white/2.5 px-4 text-white">
			{children}
		</div>
	);
}

function CodeTabBar({
	filename,
	children,
}: {
	filename: string;
	children?: OneOrMany<ReactElement | null>;
}) {
	return (
		<div className="flex items-center justify-between border-b border-zinc-800 rounded-t-2xl bg-zinc-800 px-3 pr-5 h-11">
			<div className="mr-auto text-xs font-semibold text-white">{filename}</div>
			{children && (
				<div className="text-zinc-500 flex items-center gap-2">{children}</div>
			)}
		</div>
	);
}
