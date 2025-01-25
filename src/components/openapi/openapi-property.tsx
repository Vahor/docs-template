import "server-only";
import { SimpleMdx } from "@/components/simple-mdx";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { OpenAPIV3 } from "@/lib/openapi";
import { cn } from "@/lib/utils";
import { clsx } from "clsx";

export type PropertyProps = {
	name: string | null;
	defaultValue?: string;
	hidden?: boolean;
	values?: string[];
	required?: boolean | OpenAPIV3.SchemaObject["required"];

	id?: string;

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
		<ul className={cn("list-none not-prose space-y-6", className)}>
			{children}
		</ul>
	);
}

export function Property(props: PropertyProps) {
	const {
		name,
		defaultValue,
		required = false,
		hidden = false,
		deprecated = false,
		minimum,
		maximum,
	} = props;

	if (name == null && props.type === "object") {
		return (
			<>
				{Object.entries(props.properties ?? {}).map(([key, value]) => {
					const schema = value as OpenAPIV3.SchemaObject;
					const isRequired = Array.isArray(props.required)
						? props.required.includes(key)
						: props.required;
					return (
						// @ts-expect-error we are using a custom type
						<Property
							key={key}
							name={key}
							{...schema}
							required={isRequired}
							id={`${props.id}-${key}`}
						/>
					);
				})}
			</>
		);
	}
	if (name == null && props.type === "array") {
		if (!props.items) return null;
		return (
			// @ts-expect-error we are using a custom type
			<Property
				name="[]"
				{...(props.items as OpenAPIV3.SchemaObject)}
				type="array"
				required={false}
				id={`${props.id}-${name ?? "[]"}`}
			/>
		);
	}

	if (hidden) {
		return null;
	}

	const defaultValueStr = Array.isArray(defaultValue)
		? `[${defaultValue.join(", ")}]`
		: defaultValue;

	const hasRange = maximum != null && minimum != null;

	const possibleValues =
		props.values ??
		props.enum ??
		((props.items && "enum" in props.items && props.items.enum) || null);

	const cleanType = (() => {
		if (props.type === "array") {
			if (props.items === undefined) return "array";
			const isEnum = props.items.enum != null;
			// @ts-expect-error we are using a custom type
			const result = `${props.items.format ?? props.items.type}[]`;
			return isEnum ? `${result} (enum)` : result;
		}
		return props.format ?? props.type;
	})();

	return (
		<li className={clsx("space-y-2")} id={props.id}>
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
					{props.type && (
						<span className="text-slate-600 dark:text-slate-300">
							{cleanType}
						</span>
					)}
				</div>
				{deprecated && <Details>(deprecated)</Details>}
			</div>
			<div className="pl-1">
				<SimpleMdx markdown={props.description} />
				{defaultValueStr != null && (
					<Details>Default: {defaultValueStr}</Details>
				)}

				{possibleValues && (
					<Details>
						Values: {possibleValues.map((v) => JSON.stringify(v)).join(", ")}
					</Details>
				)}

				{hasRange && (
					<Details>
						Range: [{minimum}, {maximum}]
					</Details>
				)}

				{!possibleValues &&
					!hasRange &&
					props.example &&
					typeof props.example !== "object" && (
						<Details>Example: {JSON.stringify(props.example)}</Details>
					)}

				<SubItems {...props} />
				<SubProperty {...props} />
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

const SubProperty = ({ properties, required }: PropertyProps) => {
	if (!properties) return null;

	return (
		<Accordion type="single" collapsible className="not-prose -ml-1 mt-2">
			<AccordionItem
				value="sub-property"
				className="pt-1 rounded-md border w-48 data-[state=open]:w-full"
			>
				<AccordionTrigger className="pt-0 pb-1 px-2 border-b border-transparent data-[state=open]:border-border">
					Show sub-properties
				</AccordionTrigger>
				<AccordionContent className="py-0 pb-1 px-2" asChild>
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
		return <Details>Example: {JSON.stringify(value.example)}</Details>;
	}

	return null;
};
