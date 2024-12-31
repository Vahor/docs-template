"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import { Button, type ButtonProps } from "./ui/button";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends ButtonProps {
	value: string;
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
	const { hasCopied, handleClick } = useClipboard(value);

	return (
		<Button
			onClick={handleClick}
			size="icon"
			variant="ghost"
			className={cn(
				"relative size-7 hover:bg-accent [&_svg]:size-4",
				className,
			)}
			{...props}
		>
			<span className="sr-only">Copy</span>
			{hasCopied ? <CheckIcon /> : <ClipboardIcon />}
		</Button>
	);
}
