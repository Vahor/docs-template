export const Col: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="grid grid-cols-1 gap-4 @lg:gap-8 @xl:grid-cols-2 max-w-full mx-0 relative">
			{children}
		</div>
	);
};
