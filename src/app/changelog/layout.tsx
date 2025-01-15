export default function ChangelogLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<h1>Changelog</h1>
			{children}
		</div>
	);
}
