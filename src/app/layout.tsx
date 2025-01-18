import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/code.css";
import "@/styles/twoslash.css";
import { Providers } from "@/app/providers";
import { AppSidebar } from "@/app/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AlgoliaSearchBox } from "@/components/algolia/search-box";
import { MenuIcon } from "lucide-react";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
			</head>
			<body>
				<Providers>
					<header className="flex h-14 sticky top-0 shrink-0 items-center gap-2 border-b px-4 bg-zinc-50 z-10">
						<div className="flex w-full items-center gap-2">
							<div className="basis-1/4 justify-start">
								<img
									src="https://placehold.co/180x52"
									className="hidden lg:block"
								/>
								<SidebarTrigger className="lg:hidden">
									<MenuIcon />
								</SidebarTrigger>
							</div>
							<AlgoliaSearchBox className="basis-1/2 justify-center" />
							<div className="basis-1/4 justify-end" />
						</div>
					</header>

					<div className="flex">
						<AppSidebar />
						<SidebarInset>{children}</SidebarInset>
					</div>
				</Providers>
			</body>
		</html>
	);
}
