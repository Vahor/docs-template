import { JsonLd } from "@/components/jsonld";
import { articlePage } from "@/lib/jsonld";
import { Mdx } from "@/lib/mdx";
import { allChangelogs } from "contentlayer/generated";
import { notFound } from "next/navigation";

interface PagePropsSlug {
	params: Promise<{ slug: string }>;
}

const getPage = (params: Awaited<PagePropsSlug["params"]>) => {
	if (!params.slug) return null;
	return allChangelogs.find((post) => post.slug === params.slug);
};

export function generateStaticParams() {
	const pages = [];

	for (const page of allChangelogs) {
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
			canonical: `/changelog/${page.slug}`,
		},
	};
}

export default async function Page(props: PagePropsSlug) {
	const params = await props.params;
	const page = getPage(params);
	if (!page) notFound(); // should never happen

	return (
		<main
			className="relative mx-auto mt-4 max-w-5xl px-6 md:mt-16"
			id="skip-nav"
		>
			<JsonLd
				jsonLd={articlePage({
					headline: page.title,
					description: page.description,
					datePublished: page.releaseDate,
					dateModified: page.dateModified,
				})}
			/>
			<pre>{JSON.stringify(page.toc, null, 2)}</pre>

			<div className="space-y-4 text-left">
				<h1 className="font-bold text-3xl md:text-5xl">{page.title}</h1>
				<p>{page.version}</p>
				<p>{page.releaseDate}</p>
				<p>{page.dateModified}</p>
				<p>{page.description}</p>
			</div>

			<article className="mt-8 text-pretty">
				<Mdx code={page.body.code} />
			</article>
		</main>
	);
}
