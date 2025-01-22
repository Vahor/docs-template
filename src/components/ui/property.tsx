import { Badge } from "@/components/ui/badge";
import { clsx } from "clsx";

export type PropertyProps = {
	name: string;
	type?: string;
	defaultValue?: string;
	required?: boolean;
	hidden?: boolean;
	values?: string[];
	deprecated?: boolean;

	children: React.ReactNode;
};

export function Properties({ children }: { children: React.ReactNode }) {
	return (
		<div className="my-6">
			<ul className="list-none not-prose">{children}</ul>
		</div>
	);
}

export function Property({
	name,
	type,
	defaultValue,
	required = false,
	hidden = false,
	deprecated = false,
	values,
	children,
}: PropertyProps) {
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
					<code data-variant="light">{name}</code>
					{type && (
						<span className="text-slate-600 dark:text-slate-300">{type}</span>
					)}
				</div>
				{required && (
					<Badge variant="primary" className="text-xs">
						Required
					</Badge>
				)}
				{deprecated && (
					<Badge variant="destructive" className="text-xs">
						Deprecated
					</Badge>
				)}
			</div>
			<div className="mt-2">
				{children}
				{defaultValueStr != null && (
					<span className="text-slate-500 dark:text-slate-300 block">
						Default: {defaultValueStr}
					</span>
				)}

				{values != null && (
					<span className="text-slate-500 dark:text-slate-300 block">
						Values: {values.join(", ")}
					</span>
				)}
			</div>
		</li>
	);
}
