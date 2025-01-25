import { BASE_URL } from "@/lib/constants";
import { allApis, allChangelogs, allGuides } from "contentlayer/generated";
import type { MetadataRoute } from "next";

export const getApis = (): MetadataRoute.Sitemap => {
	return allApis.map((post) => ({
		url: `${BASE_URL}/api/${post.slug}`,
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

export const getGuides = (): MetadataRoute.Sitemap => {
	return allGuides.map((post) => ({
		url: `${BASE_URL}/guide/${post.slug}`,
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
		{
			url: `${BASE_URL}/contact`,
			lastModified: process.env.BUILD_TIME,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		...getApis(),
		...getChangelogs(),
		...getGuides(),
	];
}
