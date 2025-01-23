import "server-only";
import { SimpleMdx } from "@/components/simple-mdx";
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
		<div className={cn("my-6", className)}>
			<ul className="list-none not-prose">{children}</ul>
		</div>
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
		<li className={clsx("pb-3 mb-4")}>
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
			<div className="mt-2">
				<SimpleMdx markdown={props.description} />
				{defaultValueStr != null && (
					<span className="text-slate-500 dark:text-slate-300 block">
						Default: {defaultValueStr}
					</span>
				)}

				<PossibleValues {...props} />

				{minimum != null && maximum != null && (
					<span className="text-slate-500 dark:text-slate-300 block">
						Range: [{minimum}, {maximum}]
					</span>
				)}

				<SubProperty {...props} />
				<SubItems {...props} />
			</div>
		</li>
	);
}

const PossibleValues = (props: Partial<PropertyProps>) => {
	const possibleValues =
		props.values ??
		props.enum ??
		((props.items && "enum" in props.items && props.items.enum) || null);

	if (!possibleValues) return null;

	return (
		<span className="text-slate-500 dark:text-slate-300 block">
			Values: {possibleValues.join(", ")}
		</span>
	);
};

const SubProperty = ({ properties, required }: PropertyProps) => {
	if (!properties) return null;

	return (
		<Properties className="pt-2 my-0 ml-2 pl-2 border-l">
			{Object.entries(properties).map(([key, value]) => {
				const schema = value as OpenAPIV3.SchemaObject;
				const isRequired = Array.isArray(required)
					? required.includes(key)
					: required;
				return (
					// @ts-expect-error we are using a custom type
					<Property key={key} name={key} {...schema} required={isRequired} />
				);
			})}
		</Properties>
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
		return (
			<span className="text-slate-500 dark:text-slate-300 block">
				Example: ["{value.example}"]
			</span>
		);
	}

	return null;
};
