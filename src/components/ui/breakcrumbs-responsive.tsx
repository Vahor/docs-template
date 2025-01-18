"use client";

import Link from "next/link";
import * as React from "react";

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SidebarItem } from "@/lib/sidebar";

const ITEMS_TO_DISPLAY = 3;

export const BreadcrumbResponsive = ({
	items,
}: {
	items: {
		title: SidebarItem["title"];
		url?: SidebarItem["url"];
	}[];
}) => {
	if (items.length === 0) return null;
	const [open, setOpen] = React.useState(false);
	const elipsisItems = items.slice(1, -ITEMS_TO_DISPLAY + 1);
	const restItems = items.slice(1 + elipsisItems.length);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href={items[0].url}>{items[0].title}</BreadcrumbLink>
				</BreadcrumbItem>
				{items.length === 1 ? null : <BreadcrumbSeparator />}
				{elipsisItems.length > 0 ? (
					<>
						<BreadcrumbItem>
							<DropdownMenu open={open} onOpenChange={setOpen}>
								<DropdownMenuTrigger
									className="flex items-center gap-1"
									aria-label="Toggle menu"
								>
									<BreadcrumbEllipsis className="h-4 w-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{elipsisItems.map((item) => (
										<DropdownMenuItem key={item.title}>
											<Link href={item.url ?? "#"}>{item.title}</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				) : null}
				{restItems.map((item, index) => {
					const isLastItem = index === restItems.length - 1;
					const className = !isLastItem
						? "max-w-20 truncate md:max-w-none"
						: "";
					return (
						<BreadcrumbItem key={item.title}>
							{item.url ? (
								<>
									<BreadcrumbLink asChild className={className}>
										<Link href={item.url}>{item.title}</Link>
									</BreadcrumbLink>
									{isLastItem ? null : <BreadcrumbSeparator as="span" />}
								</>
							) : (
								<BreadcrumbPage className={className}>
									{item.title}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
