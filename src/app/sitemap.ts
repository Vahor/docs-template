import { BASE_URL } from "@/lib/constants";
import { allPosts, allChangelogs } from "contentlayer/generated";
import type { MetadataRoute } from "next";

export const getPosts = (): MetadataRoute.Sitemap => {
	return allPosts.map((post) => ({
		url: `${BASE_URL}/post/${post.slug}`,
		lastModified: post.dateModified,
		changeFrequency: "monthly",
		priority: 0.6,
	}));
};

export const getChangelogs = (): MetadataRoute.Sitemap => {
	return allChangelogs.map((post) => ({
		url: `${BASE_URL}/changelog/${post.slug}`,
		lastModified: post.dateModified,
		changeFrequency: "monthly",
		priority: 0.6,
	}));
};

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		{
			url: `${BASE_URL}/`,
			lastModified: process.env.BUILD_TIME,
			changeFrequency: "monthly",
			priority: 1,
		},
		...getPosts(),
		...getChangelogs(),
	];
}
