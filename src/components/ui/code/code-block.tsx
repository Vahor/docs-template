"use client";

// based on https://mintlify.com/docs/content/components/code

import { CopyToClipboardButton } from "@/components/ui/code/clipboard-button";
import { FullScreenButton } from "@/components/ui/code/fullscreen-button";
import { getNodeText } from "@/lib/getNodeText";
import { clsx } from "clsx";
import {
	type ComponentPropsWithoutRef,
	type ReactElement,
	useRef,
} from "react";

export interface CodeBlockPropsBase {
	filename?: string;
	children: ReactElement | ReactElement[];
	allowFullScreen?: boolean;
}

export type CodeBlockProps = CodeBlockPropsBase &
	Omit<ComponentPropsWithoutRef<"div">, keyof CodeBlockPropsBase>;

export const CodeBlock = function CodeBlock({
	filename,
	children,
	className,
	...props
}: CodeBlockProps) {
	const Button = (
		props: Partial<ComponentPropsWithoutRef<typeof CopyToClipboardButton>>,
	) => <CopyToClipboardButton textToCopy={getNodeText(children)} {...props} />;

	const wrapperRef = useRef<HTMLDivElement>(null);

	// TODO: use captions
	let header: ReactElement | undefined = undefined;
	if (Array.isArray(children)) {
		header = Array.isArray(children) ? children[1] : children;
		children = children[0];
	}

	return (
		<div
			className={clsx(
				"not-prose relative my-3 rounded-2xl bg-zinc-900",
				"group/my-0",
				"group",
				"data-[fullscreen=true]:fixed data-[fullscreen=true]:inset-0 data-[fullscreen=true]:z-50 data-[fullscreen=true]:max-h-svh data-[fullscreen=true]:!my-0 data-[fullscreen=true]:rounded-none",
				className,
			)}
			ref={wrapperRef}
			{...props}
		>
			{filename && (
				<CodeTabBar filename={filename}>
					<Button className="hover:text-zinc-400" />
					<FullScreenButton
						className="hover:text-zinc-400"
						wrapperRef={wrapperRef}
					/>
				</CodeTabBar>
			)}

			{header && <CodeHeader>{header}</CodeHeader>}

			<div
				className="relative [&_code]:max-h-[500px] [&_code]:overflow-auto [&_code]:py-4 [&_code>span]:px-4 [&_code]:rounded-2xl group-data-[fullscreen=true]:[&_code]:max-h-[calc(100svh-theme(spacing.12))]"
				style={{ fontVariantLigatures: "none" }}
			>
				{!filename && (
					<div className="flex items-center gap-2 absolute top-[18px] right-5 z-[1] text-zinc-500">
						<Button className="hover:text-zinc-400" />
						<FullScreenButton
							className="hover:text-zinc-400"
							wrapperRef={wrapperRef}
						/>
					</div>
				)}

				{children}
			</div>
		</div>
	);
};

function CodeHeader({ children }: { children: ReactElement }) {
	return (
		<div className="flex h-9 items-center gap-2 border-b border-zinc-800 bg-zinc-900 bg-white/2.5 px-4">
			{children}
		</div>
	);
}

function CodeTabBar({
	filename,
	children,
}: {
	filename: string;
	children?: ReactElement[];
}) {
	return (
		<div className="flex items-center justify-between border-b border-zinc-800 rounded-t-2xl bg-zinc-800 px-3 pr-5 h-12">
			<div className="mr-auto text-xs font-semibold text-white">{filename}</div>
			{children && (
				<div className="text-zinc-500 flex items-center gap-2">{children}</div>
			)}
		</div>
	);
}
