import { Tag } from "@/components/ui/tag";
import { allApis, allChangelogs, allGuides } from "contentlayer/generated";

export interface SidebarItem {
	title: string;
	url: string;
	badge?: string | React.ReactNode;
	collapsible?: boolean;
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
			.toSorted((a, b) =>
				a.sidebar?.order && b.sidebar?.order
					? a.sidebar.order - b.sidebar.order
					: 0,
			)
			.map((guide) => ({
				title: guide.sidebar?.title ?? guide.title,
				url: `/guide/${guide.slug}`,
				toc: guide.toc,
			})),
	},
	{
		title: "Changelog",
		url: "#",
		collapsible: true,
		items: allChangelogs
			.toSorted((a, b) => b.version.localeCompare(a.version))
			.slice(1) // TODO: remove this
			.map((changelog) => ({
				title: changelog.sidebar?.title ?? changelog.title,
				url: `/changelog/${changelog.slug}`,
				toc: changelog.toc,
			})),
	},
	{
		title: "API Reference",
		url: "#",
		badge: "New",
		items: allApis
			.toSorted((a, b) =>
				a.sidebar?.order && b.sidebar?.order
					? a.sidebar.order - b.sidebar.order
					: 0,
			)
			.map((api) => ({
				title: api.sidebar?.title ?? api.title,
				url: `/api/${api.slug}`,
				badge: <Tag variant="small">{api.method.toUpperCase()}</Tag>,
				toc: api.toc,
			})),
	},
	{
		title: "Examples",
		url: "#",
		items: [
			{
				title: "Something",
				url: "#",
				items: [
					{
						title: "Using abc",
						url: "#",
					},
					{
						title: "Using xyz",
						url: "#",
						items: [
							{
								title: "Another level",
								url: "/a/random/path",
							},
							{
								title: "Test active state post",
								badge: "NEW",
								url: `/api/${allApis[0].slug}`,
							},
							{
								title: "Test active state changelog",
								badge: "NEW",
								url: `/changelog/${allChangelogs[1].slug}`,
							},
						],
					},
				],
			},
		],
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
