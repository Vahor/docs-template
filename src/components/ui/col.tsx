import { cn } from "@/lib/utils";

export const Col: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({ children, className }) => {
	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-4 @lg:gap-8 @xl:grid-cols-2 max-w-full mx-0 relative",
				className,
			)}
		>
			{children}
		</div>
	);
};
