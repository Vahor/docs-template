import type { SidebarItem } from "@/lib/sidebar";

export const breadcrumbsToString = (
	items: {
		title: SidebarItem["title"];
		url?: SidebarItem["url"];
	}[],
	separator = " > ",
) => {
	return items.map((item) => item.title).join(separator);
};
