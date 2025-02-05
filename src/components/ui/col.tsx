import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export const Col: React.FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => {
	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-4 @xl:gap-8 @xl:grid-cols-2 max-w-full mx-0 relative",
				className,
			)}
		>
			{children}
		</div>
	);
};
