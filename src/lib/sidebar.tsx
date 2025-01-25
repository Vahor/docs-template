import { Tag } from "@/components/ui/tag";
import { allApis, allChangelogs, allGuides } from "contentlayer/generated";
import { PhoneIcon } from "lucide-react";

export interface SidebarItem {
	title: string;
	url: string;
	badge?: string | React.ReactNode;
	className?: string;
	items?: SidebarItem[];
	toc?: {
		title: string;
		url: string;
	}[];
}
export interface SidebarGroup extends SidebarItem {
	items: SidebarItem[];
}

export const sidebar: SidebarGroup[] = [
	{
		title: "Guides",
		url: "#",
		items: allGuides
			.toSorted((a, b) => {
				const aOrder = a.sidebar?.order ?? Number.MAX_SAFE_INTEGER;
				const bOrder = b.sidebar?.order ?? Number.MAX_SAFE_INTEGER;
				return aOrder - bOrder;
			})
			.map((guide) => ({
				title: guide.sidebar?.title ?? guide.title,
				url: `/guide/${guide.slug}`,
				toc: guide.toc,
			})),
	},
	{
		title: "API Reference",
		url: "#",
		badge: "New",
		items: allApis
			.toSorted((a, b) => {
				const aOrder = a.sidebar?.order ?? Number.MAX_SAFE_INTEGER;
				const bOrder = b.sidebar?.order ?? Number.MAX_SAFE_INTEGER;
				return aOrder - bOrder;
			})
			.map((api) => ({
				title: api.sidebar?.title ?? api.title,
				url: `/api/${api.slug}`,
				badge: <Tag variant="small">{api.method.toUpperCase()}</Tag>,
				toc: api.toc,
			})),
	},
	{
		title: "Changelog",
		url: "#",
		className: "max-h-[250px] overflow-y-auto",
		items: allChangelogs
			.toSorted((a, b) => b.version.localeCompare(a.version))
			.map((changelog) => ({
				title: changelog.sidebar?.title ?? changelog.title,
				url: `/changelog/${changelog.slug}`,
				toc: changelog.toc,
			})),
	},
];

export const secondarySidebar = [
	{
		title: "Contact",
		url: "/contact",
		icon: PhoneIcon,
	},
];

const breadcrumbsCache = new Map<string, SidebarItem[]>();
export const getPageBreadcrumbs = (
	path: string,
): Pick<SidebarItem, "title" | "url">[] => {
	const withoutDomain = path
		.replace(/^https?:\/\/[^\/]+/, "")
		// TODO: remove this
		.replace(process.env.NEXT_PUBLIC_BASE_PATH, "");

	const cached = breadcrumbsCache.get(withoutDomain);
	if (cached) {
		return cached;
	}

	const breadcrumbs = findBreadcrumbs(withoutDomain, sidebar);
	if (!breadcrumbs) {
		return [];
	}
	const result = breadcrumbs.map((item) => ({
		title: item.title,
		url: item.url,
	}));
	breadcrumbsCache.set(withoutDomain, result);
	return result;
};

const findBreadcrumbs = (
	targetPath: string,
	items: SidebarItem[],
	breadcrumbs: SidebarItem[] = [],
): SidebarItem[] | null => {
	// PERF: not the best way but as it's pre-build on the server, it's fine

	for (const item of items) {
		const currentPath = [...breadcrumbs, item];
		if (item.url === targetPath) {
			return currentPath;
		}

		if (item.items?.length) {
			const result = findBreadcrumbs(targetPath, item.items, currentPath);
			if (result) {
				return result;
			}
		}
	}

	return null;
};
