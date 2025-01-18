"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
} from "@/components/ui/sidebar";
import {
	type SidebarGroup as TSidebarGroup,
	type SidebarItem as TSidebarItem,
	sidebar,
} from "@/lib/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cache } from "react";

const BorderIndicator = ({
	level,
	children,
}: { level: number; children: React.ReactNode }) => {
	return (
		<div
			style={{
				paddingLeft: level * 8,
			}}
			className="border-l hover:border-zinc-400 peer-data-[state=open]:border-zinc-400 border-indicator py-0.5 group-data-[collapsible=icon]:hidden"
		>
			{children}
		</div>
	);
};

const SidebarGroupComponent = ({
	group,
	level,
}: { group: TSidebarGroup; level: number }) => {
	const pathname = usePathname();
	const active = isActive(group, pathname);

	return (
		<Collapsible
			key={group.title}
			asChild
			className="data-[state=open]:[&>span>svg]:rotate-90 group/collapsible [&[data-state=open]>div>button>svg]:rotate-90"
			defaultOpen={active}
		>
			<SidebarMenuItem>
				<BorderIndicator level={level}>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton isActive={active}>
							<span>{group.title}</span>
							<SidebarMenuBadge>{group.badge}</SidebarMenuBadge>
							<ChevronRight className="ml-auto transition-transform duration-200" />
						</SidebarMenuButton>
					</CollapsibleTrigger>
				</BorderIndicator>
				<CollapsibleContent>
					<SidebarMenuSub>
						{group.items.map((item) => (
							<SidebarComponent item={item} key={item.title} level={level} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
};

const SidebarItemComponent = ({
	item,
	level,
}: { item: TSidebarItem; level: number }) => {
	const pathname = usePathname();
	const active = isActive(item, pathname);

	return (
		<BorderIndicator level={level + 1}>
			<SidebarMenuSubItem key={item.title}>
				<SidebarMenuSubButton asChild isActive={active}>
					<Link href={item.url}>
						<span>{item.title}</span>
						<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
					</Link>
				</SidebarMenuSubButton>
			</SidebarMenuSubItem>
		</BorderIndicator>
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
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="group-data-[collapsible=icon]:relative absolute right-0 z-10 hidden lg:block">
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				{sidebar.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((item) => (
									<SidebarComponent item={item} key={item.title} />
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter />
			<SidebarRail />
		</Sidebar>
	);
}
