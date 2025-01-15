export default function PostLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<h1>Post</h1>
			{children}
		</div>
	);
}
