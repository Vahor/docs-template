import "server-only";
import { SimpleMdx } from "@/components/simple-mdx";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { OpenAPIV3 } from "@/lib/openapi";
import { cn } from "@/lib/utils";
import { clsx } from "clsx";

export type PropertyProps = {
	name: string;
	defaultValue?: string;
	hidden?: boolean;
	values?: string[];
	required?: boolean | OpenAPIV3.SchemaObject["required"];

	items?: // items.enums is not in spec but apparently used
		| {
				enum?: string[];
		  }
		| OpenAPIV3.SchemaObject;
} & Omit<OpenAPIV3.SchemaObject, "children" | "required">;

export function Properties({
	children,
	className,
}: { children: React.ReactNode; className?: string }) {
	return (
		<ul className={cn("list-none not-prose space-y-4 my-6", className)}>
			{children}
		</ul>
	);
}

export function Property(props: PropertyProps) {
	const {
		name,
		type,
		defaultValue,
		required = false,
		hidden = false,
		deprecated = false,
		minimum,
		maximum,
		format,
	} = props;

	if (hidden) {
		return null;
	}

	const defaultValueStr = Array.isArray(defaultValue)
		? `[${defaultValue.join(", ")}]`
		: defaultValue;

	return (
		<li className={clsx("pb-3 space-y-2")}>
			<div className="flex font-mono text-sm">
				<div className="py-0.5 flex-1 space-x-2 truncate">
					<code style={{ paddingRight: required ? "1.5ch" : undefined }}>
						{name}
						{required && (
							<span
								className="absolute -top-1 right-1 text-red-500 text-xs select-none"
								title="Required"
							>
								*
							</span>
						)}
					</code>
					{type && (
						<span className="text-slate-600 dark:text-slate-300">
							{format ?? type}
						</span>
					)}
				</div>
				{deprecated && (
					<Badge variant="warning" className="text-xs">
						Deprecated
					</Badge>
				)}
			</div>
			<div className="pl-1">
				<SimpleMdx markdown={props.description} />
				{defaultValueStr != null && (
					<Details>Default: {defaultValueStr}</Details>
				)}

				<PossibleValues {...props} />

				{minimum != null && maximum != null && (
					<Details>
						Range: [{minimum}, {maximum}]
					</Details>
				)}

				<SubProperty {...props} />
				<SubItems {...props} />
			</div>
		</li>
	);
}

const Details = ({ children }: { children: React.ReactNode }) => {
	return (
		<span className="text-slate-500 dark:text-slate-300 block text-xs">
			{children}
		</span>
	);
};

const PossibleValues = (props: Partial<PropertyProps>) => {
	const possibleValues =
		props.values ??
		props.enum ??
		((props.items && "enum" in props.items && props.items.enum) || null);

	if (!possibleValues) return null;

	return <Details>Values: {possibleValues.join(", ")}</Details>;
};

const SubProperty = ({ properties, required }: PropertyProps) => {
	if (!properties) return null;

	return (
		<Accordion type="single" collapsible className="not-prose -ml-1">
			<AccordionItem
				value="sub-property"
				className="pt-1 rounded-md border w-48 data-[state=open]:w-full"
			>
				<AccordionTrigger className="pt-0 pb-1 px-2 border-b border-transparent data-[state=open]:border-border">
					Show sub-properties
				</AccordionTrigger>
				<AccordionContent className="py-0 px-2" asChild>
					<Properties className="my-0 mt-2">
						{Object.entries(properties).map(([key, value]) => {
							const schema = value as OpenAPIV3.SchemaObject;
							const isRequired = Array.isArray(required)
								? required.includes(key)
								: required;
							return (
								// @ts-expect-error we are using a custom type
								<Property
									key={key}
									name={key}
									{...schema}
									required={isRequired}
								/>
							);
						})}
					</Properties>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

const SubItems = ({ items }: PropertyProps) => {
	if (!items) return null;
	if ("enum" in items) return null;
	const value = items as OpenAPIV3.SchemaObject;
	if (value.properties != null) {
		// @ts-expect-error we are using a custom type
		return <SubProperty {...value} />;
	}
	if (value.example != null) {
		return <Details>Example: ["{value.example}"]</Details>;
	}

	return null;
};
