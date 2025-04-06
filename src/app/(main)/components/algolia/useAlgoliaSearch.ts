"use client";

import {
	type AutocompleteCollection,
	type AutocompleteState,
	createAutocomplete,
} from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";
import { useId, useState } from "react";

import { liteClient as algoliasearch } from "algoliasearch/lite";
import { useRouter } from "next/navigation";
import { searchStore } from "./search.store";

const appId = "Q0OYUSVGI1";
const apiKey = "3aff17a7cbdc78a5e00020231d08b636";
const searchClient = algoliasearch(appId, apiKey);

const indexName = "docs_template_pages";

// TODO: update depending on the index
export type Entry = {
	objectID: string;

	url: string;
	headline?: string;
	description?: string;
	category: "guide" | "api" | "changelog";

	_highlightResult: {
		headline?: {
			value: string;
			matchedWords: string[];
		};
		description?: {
			value: string;
			matchedWords: string[];
		};
	};
};

export function useAutocomplete() {
	const id = useId();
	const router = useRouter();
	const [autocompleteState, setAutocompleteState] =
		useState<AutocompleteState<Entry>>();
	const getSearchCategories = searchStore((state) => state.getSearchCategories);

	const [autocomplete] = useState(() =>
		createAutocomplete<Entry>({
			id,
			placeholder: "Search the docs...",
			autoFocus: false,
			defaultActiveItemId: 0,
			onStateChange({ state }) {
				setAutocompleteState(state);
			},
			getSources() {
				return [
					{
						sourceId: "documentation",
						getItemUrl({ item }) {
							return item.url;
							if (typeof item.url === "string") {
								// TODO: add full url in jsonld
								const url = new URL("http://localhost", item.url);
								return `${url.pathname}${url.hash}`;
							}
							return undefined;
						},
						onSelect({ item, itemUrl }) {
							if (itemUrl) {
								router.push(itemUrl);
							}
						},
						getItems({ query }) {
							const enabledCategories = getSearchCategories();
							const filters = Object.entries(enabledCategories).filter(([_, enabled]) => !enabled).map(([category]) => `category:-${category}`);
							return getAlgoliaResults({
								searchClient,
								queries: [
									{
										indexName,
										params: {
											query,
											hitsPerPage: 8,
											highlightPreTag:
												'<mark class="bg-transparent text-primary-base">',
											highlightPostTag: "</mark>",
											facetFilters: filters,
											responseFields: ["hits"],
											attributesToHighlight: [
												"headline",
												"description",
											],
											attributesToRetrieve: [
												"objectID",
												"url",
												"headline",
												"description",
												"category",
											],
										},
									},
								],
							});
						},
					},
				];
			},
		}),
	);

	return { autocomplete: autocomplete ?? {}, autocompleteState };
}

export type { AutocompleteCollection };
