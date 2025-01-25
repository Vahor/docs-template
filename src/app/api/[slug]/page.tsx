import { JsonLd } from "@/components/jsonld";
import { BreadcrumbResponsive } from "@/components/ui/breakcrumbs-responsive";
import { articlePage } from "@/lib/jsonld";
import { Mdx } from "@/lib/mdx";
import { getPageBreadcrumbs } from "@/lib/sidebar";
import { allApis } from "contentlayer/generated";
import { notFound } from "next/navigation";

interface PagePropsSlug {
	params: Promise<{ slug: string }>;
}

const getPage = (params: Awaited<PagePropsSlug["params"]>) => {
	if (!params.slug) return null;
	return allApis.find((post) => post.slug === params.slug);
};

export function generateStaticParams() {
	const pages = [];

	for (const page of allApis) {
		pages.push({
			slug: page.slug,
		});
	}

	return pages;
}

export async function generateMetadata(props: PagePropsSlug) {
	const page = getPage(await props.params);
	if (!page) notFound(); // should never happen
	return {
		title: page.title,
		description: page.description,
		alternates: {
			canonical: `/post/${page.slug}`,
		},
	};
}

export default async function Page(props: PagePropsSlug) {
	const params = await props.params;
	const page = getPage(params);
	if (!page) notFound(); // should never happen

	const breadcrumbs = getPageBreadcrumbs(`/api/${page.slug}`).slice(0, -1);

	return (
		<main className="main-content">
			<JsonLd
				jsonLd={articlePage({
					headline: page.title,
					description: page.description,
					dateModified: page.dateModified,
				})}
			/>
			<BreadcrumbResponsive items={breadcrumbs} />

			<article>
				<h1 className="font-bold text-3xl md:text-5xl">{page.title}</h1>

				<Mdx code={page.body.code} />
			</article>
		</main>
	);
}
