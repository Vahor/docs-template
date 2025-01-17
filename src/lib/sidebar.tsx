import { Tag } from "@/components/ui/tag";
import { allChangelogs, allPosts } from "contentlayer/generated";

export interface SidebarItem {
	title: string;
	url: string;
	badge?: string | React.ReactNode;
	collapsible?: boolean;
	items?: SidebarItem[];
}
export interface SidebarGroup extends SidebarItem {
	items: SidebarItem[];
}

export const sidebar: SidebarGroup[] = [
	{
		title: "Changelog",
		url: "#",
		collapsible: true,
		items: allChangelogs
			.toSorted((a, b) => a.version.localeCompare(b.version))
			.map((changelog) => ({
				title: changelog.title,
				url: `/changelog/${changelog.slug}`,
			})),
	},
	{
		title: "API Reference",
		url: "#",
		badge: "New",
		items: allPosts.map((api) => ({
			title: api.title,
			url: `/post/${api.slug}`,
			badge: <Tag variant="small">GET</Tag>,
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
								url: "#",
							},
							{
								title: "Test active state post",
								badge: "NEW",
								url: `/post/${allPosts[0].slug}`,
							},
							{
								title: "Test active state changelog",
								badge: "NEW",
								url: `/changelog/${allChangelogs[0].slug}`,
							},
						],
					},
				],
			},
		],
	},
];
