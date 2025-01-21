"use client";

import { cn } from "@/lib/utils";

export interface NativeSelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function NativeSelect({
	children,
	className,
	...props
}: NativeSelectProps) {
	return (
		<select
			className={cn(
				"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}
