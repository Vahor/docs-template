import { Tag, getTagColor } from "@/components/ui/tag";
import type { OpenAPIV3 } from "@/lib/openapi";
import { cn } from "@/lib/utils";

export const OpenApiBoxedUrl = ({
	method,
	path,
	className,
}: { method: OpenAPIV3.HttpMethods; path: string; className?: string }) => {
	const color = getTagColor(method);
	return (
		<div
			className={cn(
				"border bg-background rounded-md w-auto px-2 inline-flex items-center gap-2 divide-x",
				className,
			)}
		>
			<Tag className="text-xs" color={color}>
				{method.toUpperCase()}
			</Tag>
			<code
				data-language="plaintext"
				className="text-xs text-slate-600 px-px pl-2"
			>
				<PathWithColoredParams path={path} color={color} />
			</code>
		</div>
	);
};

const PathWithColoredParams = ({
	path,
	color,
}: { path: string; color: ReturnType<typeof getTagColor> }) => {
	const params = path.split("/").map((part, index) => {
		const isParam = part[0] === "{" && part[part.length - 1] === "}";
		const key = `${part}-${index}`;
		const isLast = index === path.split("/").length - 1;
		if (isParam) {
			return (
				<span key={key}>
					<Tag
						as="mark"
						variant="medium"
						className="text-xs ring-transparent"
						color={color}
					>
						{part}
					</Tag>
					/
				</span>
			);
		}
		return (
			<span key={key}>
				{part}
				{isLast ? "" : "/"}
			</span>
		);
	});

	return <code data-language="plaintext">{params}</code>;
};
