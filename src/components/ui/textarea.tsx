import * as React from "react";

import { cn } from "@/lib/utils";
import TextareaAutosize, {
	type TextareaAutosizeProps,
} from "react-textarea-autosize";

export interface TextareaProps extends TextareaAutosizeProps {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<TextareaAutosize
				className={cn(
					"flex min-h-[60px] w-full rounded-2xl border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Textarea.displayName = "Textarea";

export { Textarea };
