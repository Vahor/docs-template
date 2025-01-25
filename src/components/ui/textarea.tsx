import * as React from "react";

import { cn } from "@/lib/utils";
import ReactTextareaAutosize, {
	type TextareaAutosizeProps,
} from "react-textarea-autosize";

export interface TextareaProps extends TextareaAutosizeProps {}

const textAreaClassName =
	"flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const TextareaAutosize = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<ReactTextareaAutosize
				className={cn(textAreaClassName, className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
TextareaAutosize.displayName = "Textarea";

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(textAreaClassName, className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Textarea.displayName = "Textarea";

export { TextareaAutosize, Textarea };
