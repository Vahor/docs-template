import {
	CodeBlock,
	type CodeBlockProps,
} from "@/components/ui/code/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNodeText } from "@/lib/getNodeText";
import { cn } from "@/lib/utils";
import { clsx } from "clsx";
import {
	Children,
	type ComponentPropsWithoutRef,
	type FormEventHandler,
	type ForwardedRef,
	type ReactElement,
	forwardRef,
} from "react";

export type CodeGroupPropsBase = {
	title?: string;

	children?: ReactElement<CodeBlockProps>[] | ReactElement<CodeBlockProps>;

	onChange?: FormEventHandler<HTMLDivElement> & ((index: number) => void);
};

export type CodeGroupProps = CodeGroupPropsBase &
	Omit<ComponentPropsWithoutRef<"div">, keyof CodeGroupPropsBase>;

export const CodeGroup = forwardRef(function CodeGroup(
	{ children, className, title, ...props }: CodeGroupProps,
	ref: ForwardedRef<HTMLDivElement> | undefined,
) {
	if (children == null) {
		return null;
	}
	if (!Array.isArray(children)) {
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
			// @ts-expect-error ts is wrong
			defaultValue="0"
			ref={ref}
			className={clsx(
				"not-prose group/code-group",
				"rounded-2xl bg-zinc-800",
				className,
			)}
			data-fullscreen
			{...props}
		>
			<div className="flex items-center justify-between border-b border-zinc-800 rounded-t-2xl px-3 gap-6 h-11">
				{title && (
					<div className="mr-auto text-xs font-semibold text-white shrink-0">
						{title}
					</div>
				)}
				<TabsList
					className={cn(
						"pl-1 p-0 relative overflow-x-auto overflow-y-visible h-full",
						!title && "justify-start",
					)}
				>
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
			</div>
			{childArr.map((child, tabIndex: number) => {
				const children = child?.props?.children as ReactElement[];
				const title =
					children && children.length > 1
						? getNodeText(children[0])
						: "Missing title";

				const renderChildren =
					children.length === 0
						? children
						: Array.isArray(children)
							? children.slice(1)
							: children;
				return (
					<TabsContent
						key={title}
						value={String(tabIndex)}
						className="mt-0 [&>*]:rounded-t-none [&>*]:mt-0"
					>
						<CodeBlock>{renderChildren}</CodeBlock>
					</TabsContent>
				);
			})}
		</Tabs>
	);
});
