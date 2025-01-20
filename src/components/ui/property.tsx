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
			<ul className="list-none">{children}</ul>
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

	return (
		<li className={clsx("pb-3 mb-4")}>
			<div className="flex font-mono text-sm">
				{name && (
					<div className="py-0.5 flex-1 space-x-2 truncate">
						<code>{name}</code>
						{required && (
							<span className="text-slate-500 dark:text-slate-300">
								Required
							</span>
						)}
					</div>
				)}
				{type && (
					<div className="text-slate-600 dark:text-slate-300">{type}</div>
				)}
			</div>
			<p className="mt-2">
				{children}
				{defaultValue && (
					<span className="text-slate-500 dark:text-slate-300 block">
						Default: {defaultValue}
					</span>
				)}

				{values && (
					<span className="text-slate-500 dark:text-slate-300 block">
						Values: {values.join(", ")}
					</span>
				)}
			</p>
		</li>
	);
}
