"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";
import {
	useAutocomplete,
	type AutocompleteCollection,
	type Entry,
	type HookAutocomplete,
	type HookAutocompleteState,
} from "./useAlgoliaSearch";
import { LoaderCircleIcon, Search, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";

const SearchResult = ({
	result,
	resultIndex,
	autocomplete,
	collection,
}: {
	result: Entry;
	resultIndex: number;
	autocomplete: HookAutocomplete;
	collection: AutocompleteCollection<Entry>;
}) => {
	const id = useId();

	const title = result._highlightResult?.title?.value ?? result.title;
	const content = result._highlightResult?.content?.value ?? result.content;

	return (
		/* @ts-expect-error event type is wrong */
		<li
			className={cn(
				resultIndex > 0 && "border-t border-zinc-100 dark:border-zinc-800",
			)}
			aria-labelledby={`${id}-title`}
			{...autocomplete.getItemProps({
				item: result,
				source: collection.source,
			})}
		>
			<div
				id={`${id}-title`}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: should be safe
				dangerouslySetInnerHTML={{ __html: title }}
			/>
		</li>
	);
};

const SearchResults = ({
	autocomplete,
	query,
	collection,
}: {
	autocomplete: HookAutocomplete;
	query: string;
	collection: AutocompleteCollection<Entry>;
}) => {
	if (collection.items.length === 0) {
		return (
			<div className="p-6 text-center">
				Nothing found for{" "}
				<strong className="break-words font-semibold text-zinc-900">
					&lsquo;{query}&rsquo;
				</strong>
			</div>
		);
	}

	return (
		<ul {...autocomplete.getListProps()}>
			{collection.items.map((result, resultIndex) => (
				<SearchResult
					key={result.objectID}
					result={result}
					resultIndex={resultIndex}
					autocomplete={autocomplete}
					collection={collection}
				/>
			))}
		</ul>
	);
};

export const AlgoliaSearchBox = () => {
	const { autocomplete, autocompleteState } = useAutocomplete();
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	// @ts-expect-error event type is wrong
	const inputProps = autocomplete.getInputProps({});

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "/") {
				e.preventDefault();
				setOpen(true);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<div>
			<label className="relative flex items-center">
				<SearchIcon className="absolute left-0 size-4 opacity-50 pointer-events-none" />
				<input
					type="text"
					className="flex w-48 rounded-md text-sm outline-none sm:w-96 pl-6"
					name="search"
					placeholder={inputProps.placeholder}
					onFocus={() => setOpen(true)}
				/>
				<kbd className="pointer-events-none absolute inset-y-0 right-0 h-5 select-none flex items-center rounded-md border px-1.5 text-muted-foreground text-xs">
					<span>/</span>
				</kbd>
			</label>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="top-4 translate-y-0 max-w-screen-sm overflow-hidden p-0 shadow-lg gap-2">
					<DialogTitle className="sr-only">Search</DialogTitle>
					<div className="flex items-center border-b px-3">
						<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						{/* @ts-expect-error event type is wrong */}
						<input
							className={cn(
								"flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
							)}
							suppressHydrationWarning
							ref={inputRef}
							{...inputProps}
						/>
						<DialogClose />
					</div>

					{autocompleteState?.isOpen && (
						<SearchResults
							autocomplete={autocomplete}
							query={autocompleteState?.query}
							collection={autocompleteState?.collections[0]}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};
