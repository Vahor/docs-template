import { cn } from "@/lib/utils";
import type * as LabelPrimitive from "@radix-ui/react-label";
import type { FieldMeta } from "@tanstack/react-form";
import { Label } from "./label";

const Form = ({
	children,
	onSubmit,
	...props
}: React.HTMLAttributes<HTMLFormElement>) => {
	return (
		<form
			{...props}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onSubmit?.(e);
			}}
		>
			{children}
		</form>
	);
};

const FormLabel = ({
	className,
	required,
	children,
	htmlFor: formItemId,
	...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
	required?: boolean;
}) => {
	return (
		<Label className={className} htmlFor={formItemId} {...props}>
			{children}
			{required && (
				<span
					aria-hidden="true"
					className="ml-1 text-destructive"
					title="Required"
				>
					*
				</span>
			)}
		</Label>
	);
};
FormLabel.displayName = "FormLabel";

const FormDescription = ({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
	return (
		<p
			className={cn("mt-1 text-[0.8rem] text-muted-foreground", className)}
			{...props}
		/>
	);
};
FormDescription.displayName = "FormDescription";

const FormError = ({
	className,
	meta,
	...props
}: Omit<React.HTMLAttributes<HTMLParagraphElement>, "children"> & {
	meta: FieldMeta;
}) => {
	const { isTouched, errors } = meta;
	if (!isTouched || !errors.length) {
		return null;
	}

	return (
		<p
			className={cn("font-medium text-[0.8rem] text-destructive", className)}
			{...props}
		>
			{errors.join(", ")}
		</p>
	);
};
FormError.displayName = "FormError";

export { Form, FormLabel, FormDescription, FormError };
