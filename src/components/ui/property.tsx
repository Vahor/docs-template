import { clsx } from "clsx";

// required and optional should be merged into a single prop that allows arbitrary text
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
			<ul className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5">
				{children}
			</ul>
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
	children,
}: PropertyProps) {
	if (hidden) {
		return null;
	}

	return (
		<li
			className={clsx(
				"pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800",
			)}
		>
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
				{defaultValue && (
					<span className="text-slate-500 dark:text-slate-300">
						Default: {defaultValue}
					</span>
				)}

				{children}
			</p>
		</li>
	);
}
