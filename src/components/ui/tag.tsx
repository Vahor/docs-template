// based on https://protocol.tailwindui.com/contacts#retrieve-a-contact

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const valueColorMap = {
	get: "emerald",
	post: "sky",
	patch: "amber",
	put: "amber",
	delete: "rose",
} as const;

const variants = cva("font-mono text-[0.625rem] font-semibold leading-6", {
	variants: {
		color: {
			emerald: "text-emerald-500 dark:text-emerald-400",
			sky: "text-sky-500",
			amber: "text-amber-500",
			rose: "text-red-500 dark:text-rose-500",
			zinc: "text-zinc-400 dark:text-zinc-500",
		},
		variant: {
			small: "",
			medium: "rounded-lg px-1.5 ring-1",
		},
	},
	compoundVariants: [
		{
			color: "emerald",
			variant: "medium",
			class: "ring-emerald-300 dark:ring-emerald-400/30 bg-emerald-400/10",
		},
		{
			color: "sky",
			variant: "medium",
			class:
				"ring-sky-300 bg-sky-400/10 dark:ring-sky-400/30 dark:bg-sky-400/10",
		},
		{
			color: "amber",
			variant: "medium",
			class:
				"ring-amber-300 bg-amber-400/10 dark:ring-amber-400/30 dark:bg-amber-400/10",
		},
		{
			color: "rose",
			variant: "medium",
			class:
				"ring-rose-200 bg-rose-50 dark:ring-rose-500/20 dark:bg-rose-400/10",
		},
		{
			color: "zinc",
			variant: "medium",
			class:
				"ring-zinc-200 bg-zinc-50 dark:ring-zinc-500/20 dark:bg-zinc-400/10",
		},
	],
	defaultVariants: {
		color: "emerald",
		variant: "medium",
	},
});

export interface TagProps extends VariantProps<typeof variants> {
	children: string;
}

export function Tag({ children, color, variant }: TagProps) {
	if (!color && typeof children === "string") {
		color = valueColorMap[children.toLowerCase() as keyof typeof valueColorMap];
	}
	return <span className={cn(variants({ color, variant }))}>{children}</span>;
}
