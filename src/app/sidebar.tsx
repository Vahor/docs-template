"use client";

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
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	sidebar,
	type SidebarGroup as TSidebarGroup,
	type SidebarItem as TSidebarItem,
} from "@/lib/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cache } from "react";

const SidebarGroupComponent = ({ group }: { group: TSidebarGroup }) => {
	const pathname = usePathname();
	const active = isActive(group, pathname);

	return (
		<Collapsible
			key={group.title}
			asChild
			className="data-[state=open]:[&>span>svg]:rotate-90 group/collapsible [&[data-state=open]>button>svg]:rotate-90"
			defaultOpen={active}
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton tooltip={group.title} isActive={active}>
						<span>{group.title}</span>
						<SidebarMenuBadge>{group.badge}</SidebarMenuBadge>
						<ChevronRight className="ml-auto transition-transform duration-200" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{group.items.map((item) => (
							<SidebarComponent item={item} key={item.title} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
};

const SidebarItemComponent = ({ item }: { item: TSidebarItem }) => {
	const pathname = usePathname();
	const active = isActive(item, pathname);

	return (
		<SidebarMenuSubItem key={item.title}>
			<SidebarMenuSubButton asChild isActive={active}>
				<Link href={item.url}>
					<span>{item.title}</span>
					<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
				</Link>
			</SidebarMenuSubButton>
		</SidebarMenuSubItem>
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

const SidebarComponent = ({ item }: { item: TSidebarItem }) => {
	if (item.items && item.items.length > 0) {
		return <SidebarGroupComponent group={item as TSidebarGroup} />;
	}
	return <SidebarItemComponent item={item as TSidebarItem} />;
};

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader />
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
		</Sidebar>
	);
}
