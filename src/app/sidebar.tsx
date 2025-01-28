"use client";

import { AccordionContent } from "@/components/ui/accordion";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	type SidebarGroup as TSidebarGroup,
	type SidebarItem as TSidebarItem,
	secondarySidebar,
	sidebar,
} from "@/lib/sidebar";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cache } from "react";
import { Root as AsChild } from "@radix-ui/react-slot";

const BorderIndicator = ({
	level,
	children,
}: { level: number; children: React.ReactNode }) => {
	return (
		<ul
			style={{
				paddingLeft: level * 8,
			}}
			className="border-l hover:border-zinc-400 peer-data-[state=open]:border-zinc-400 border-indicator py-0.5 group-data-[collapsible=icon]:hidden"
		>
			{children}
		</ul>
	);
};

const SidebarGroupComponent = ({
	group,
	level,
}: { group: TSidebarGroup; level: number }) => {
	const pathname = usePathname();
	const active = isActive(group, pathname);

	return (
		<li>
			<Accordion
				key={group.title}
				type="single"
				collapsible
				asChild
				className="[&[data-state=open]>li>div>button>svg]:rotate-90"
				defaultValue={active ? "item" : undefined}
			>
				<AccordionItem value="item">
					<SidebarMenuItem>
						<BorderIndicator level={level}>
							<AccordionTrigger asChild>
								<SidebarMenuButton isActive={active}>
									<span>{group.title}</span>
									<SidebarMenuBadge>{group.badge}</SidebarMenuBadge>
									<ChevronRight className="ml-auto transition-transform duration-200" />
								</SidebarMenuButton>
							</AccordionTrigger>
						</BorderIndicator>
						<AccordionContent>
							<SidebarMenuSub>
								{group.items.map((item) => (
									<SidebarComponent
										item={item}
										key={item.title}
										level={level}
									/>
								))}
							</SidebarMenuSub>
						</AccordionContent>
					</SidebarMenuItem>
				</AccordionItem>
			</Accordion>
		</li>
	);
};

const SidebarItemComponent = ({
	item,
	level,
}: { item: TSidebarItem; level: number }) => {
	const pathname = usePathname();
	const active = isActive(item, pathname);
	const { setOpenMobile } = useSidebar();

	return (
		<Accordion type="single" value={active ? "item" : undefined} asChild>
			<AccordionItem value="item" data-accordion-item="item">
				<BorderIndicator level={level + 1}>
					<AccordionTrigger asChild data-accordion-item="trigger">
						<SidebarMenuSubItem key={item.title}>
							<SidebarMenuSubButton
								asChild
								isActive={active}
								className="flex items-center justify-between gap-1"
							>
								<Link href={item.url} onClick={() => setOpenMobile(false)}>
									<span>{item.title}</span>
									{item.badge && (
										<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
									)}
								</Link>
							</SidebarMenuSubButton>
						</SidebarMenuSubItem>
					</AccordionTrigger>
				</BorderIndicator>
				{item.toc && (
					<AccordionContent className="pb-0">
						{item.toc.map((tocItem) => (
							<SidebarComponent
								item={tocItem}
								key={tocItem.title}
								level={level + 1}
							/>
						))}
					</AccordionContent>
				)}
			</AccordionItem>
		</Accordion>
	);
};

const isActive = cache((item: TSidebarItem, pathname: string): boolean => {
	const isCurrentActive = item.url === pathname;
	if (isCurrentActive) return true;
	if (item.items) {
		return item.items.some((i) => isActive(i, pathname));
	}
	return false;
});

const SidebarComponent = ({
	item,
	level = 0,
}: { item: TSidebarItem; level?: number }) => {
	if (item.items && item.items.length > 0) {
		return (
			<SidebarGroupComponent group={item as TSidebarGroup} level={level + 1} />
		);
	}
	return <SidebarItemComponent item={item as TSidebarItem} level={level} />;
};

export function AppSidebar() {
	const { setOpenMobile } = useSidebar();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="group-data-[collapsible=icon]:relative absolute group-data-[collapsible=icon]:right-0 right-2 z-10 hidden lg:block">
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				{sidebar.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent className={item.className}>
							<SidebarMenu>
								{item.items.map((item) => (
									<SidebarComponent item={item} key={item.title} />
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup className="mt-auto">
					<SidebarGroupContent>
						<SidebarMenu>
							{secondarySidebar.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild size="sm">
										<Link href={item.url} onClick={() => setOpenMobile(false)}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
