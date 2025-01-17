"use client";

import { useId, useState } from "react";
import {
	type AutocompleteState,
	type AutocompleteCollection,
	createAutocomplete,
} from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";

import { liteClient as algoliasearch } from "algoliasearch/lite";
import { useRouter } from "next/navigation";

const appId = "Q0OYUSVGI1";
const apiKey = "3aff17a7cbdc78a5e00020231d08b636";
const searchClient = algoliasearch(appId, apiKey);

const indexName = "helosion_articles";

// TODO: update depending on the index
export type Entry = {
	objectID: string;

	title: string;
	headers: string[];
	url: string;
	content: string;

	_highlightResult?: {
		[key: string]: {
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

	const [autocomplete] = useState(() =>
		createAutocomplete<Entry>({
			id,
			placeholder: "Search the docs",
			defaultActiveItemId: 0,
			onStateChange({ state }) {
				setAutocompleteState(state);
			},
			shouldPanelOpen({ state }) {
				return state.query !== "";
			},
			navigator: {
				navigate({ itemUrl }) {
					autocomplete.setIsOpen(true);
					router.push(itemUrl);
				},
			},
			getSources() {
				return [
					{
						sourceId: "documentation",
						getItemUrl({ item }) {
							if (typeof item.url === "string") {
								const url = new URL(item.url);
								return `${url.pathname}${url.hash}`;
							}
							return undefined;
						},
						onSelect({ itemUrl }) {
							if (itemUrl) {
								router.push(itemUrl);
							}
						},
						getItems({ query }) {
							return getAlgoliaResults({
								searchClient,
								queries: [
									{
										indexName,
										params: {
											query,
											hitsPerPage: 8,
											highlightPreTag:
												'<mark class="underline bg-transparent text-primary">',
											highlightPostTag: "</mark>",
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

type HookType = ReturnType<typeof useAutocomplete>;
type HookAutocomplete = HookType["autocomplete"];
type HookAutocompleteState = HookType["autocompleteState"];

export type { HookAutocomplete, HookAutocompleteState, AutocompleteCollection };
