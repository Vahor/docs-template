import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/code.css";
import { Providers } from "@/app/providers";
import { AppSidebar } from "@/app/sidebar";
import { AlgoliaSearchBox } from "@/components/algolia/search-box";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { MenuIcon } from "lucide-react";
import { Geist_Mono } from "next/font/google";
import { BASE_URL } from "@/lib/constants";

const mono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: BASE_URL,
	},
	verification: {
		other: {
			"algolia-site-verification": "B011E83821BA687B",
		},
	},
};

export const viewport = {
	colorScheme: "light",
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={`${mono.variable}`}>
			<head>
				<script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
				<link rel="sitemap" href="/sitemap.xml" />
				{/* TOOD: update this, and move id to a constant.ts file */}
				<link rel="preconnect" href={"https://Q0OYUSVGI1-dsn.algolia.net"} />
			</head>
			<body>
				<Providers>
					<header className="flex h-14 sticky top-0 shrink-0 items-center gap-2 border-b border-border/30 px-4 bg-background z-20">
						<div className="flex w-full items-center gap-2">
							<div className="basis-1/4 justify-start">
								<img
									alt="logo"
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

					<div className="lg:flex">
						<AppSidebar />
						<SidebarInset className="md:pb-16">{children}</SidebarInset>
					</div>
				</Providers>
			</body>
		</html>
	);
}
