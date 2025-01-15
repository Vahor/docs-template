import { CopyToClipboardButton } from "@/components/ui/code/clipboard-button";
import {
	CodeBlock,
	type CodeBlockProps,
} from "@/components/ui/code/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNodeText } from "@/lib/getNodeText";
import { Tab } from "@headlessui/react";
import { clsx } from "clsx";
import {
	Children,
	type ComponentPropsWithoutRef,
	type FormEventHandler,
	type ForwardedRef,
	type ReactElement,
	type ReactNode,
	forwardRef,
} from "react";

export type CodeGroupPropsBase = {
	isSmallText?: boolean;

	children?: ReactElement<CodeBlockProps>[] | ReactElement<CodeBlockProps>;

	onChange?: FormEventHandler<HTMLDivElement> & ((index: number) => void);
};

export type CodeGroupProps = CodeGroupPropsBase &
	Omit<ComponentPropsWithoutRef<"div">, keyof CodeGroupPropsBase>;

/**
 * Group multiple code blocks into a tabbed UI.
 * Uses CodeBlocks as children but does not render them directly. Instead,
 * CodeGroup extracts the props and renders CodeBlock's children.
 *
 * @param {CodeBlock[]} - children
 */
export const CodeGroup = forwardRef(function CodeGroup(
	{ children, isSmallText, className, ...props }: CodeGroupProps,
	ref: ForwardedRef<HTMLDivElement> | undefined,
) {
	if (children == null) {
		return null;
	}
	if (!Array.isArray(children)) {
		// Allow looping over a single child
		children = [children];
	}
	if (children.length === 0) {
		return null;
	}
	const childArr = Children.toArray(children) as Array<
		Exclude<React.ReactElement<CodeBlockProps>, boolean | null | undefined>
	>;
	return (
		<Tabs
			ref={ref}
			className={clsx(
				"not-prose group code-group",
				"border-zinc-800 rounded-xl bg-zinc-900 px-3 pr-5 py-3",
				className,
			)}
			{...props}
		>
			<TabsList className="gap-3 bg-transparent pl-1">
				{childArr.map((child, tabIndex: number) => {
					const children = child?.props?.children as ReactElement[];
					const title =
						children && children.length > 1
							? getNodeText(children[0])
							: "Missing title";
					return (
						<TabsTrigger key={title} value={String(tabIndex)}>
							{title}
						</TabsTrigger>
					);
				})}
			</TabsList>
			{childArr.map((child, tabIndex: number) => {
				const children = child?.props?.children as ReactElement[];
				const title =
					children && children.length > 1
						? getNodeText(children[0])
						: "Missing title";

				const renderChildren = children.length > 1 ? children[1] : children;
				return (
					<TabsContent key={title} value={String(tabIndex)} className="mt-0">
						<CodeBlock>{renderChildren}</CodeBlock>
					</TabsContent>
				);
			})}
		</Tabs>
	);
});
