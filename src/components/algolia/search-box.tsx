"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { breadcrumbsToString } from "@/lib/breadcrumbs";
import { getPageBreadcrumbs } from "@/lib/sidebar";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";
import { create } from "zustand";
import {
	type AutocompleteCollection,
	type Entry,
	useAutocomplete,
} from "./useAlgoliaSearch";

const dialogStore = create<{ open: boolean; setOpen: (open: boolean) => void }>(
	(set) => ({
		open: false,
		setOpen: (open) => set({ open }),
	}),
);

const SearchResult = ({
	result,
}: {
	result: Entry;
}) => {
	const id = useId();
	const { setOpen } = dialogStore((state) => state);
	const router = useRouter();

	const title = result._highlightResult.title?.value;
	const description = result._highlightResult.description?.value;

	const breadcrumbs = getPageBreadcrumbs(result.url).slice(0, -1);

	return (
		<CommandItem
			value={result.objectID}
			aria-labelledby={`${id}-title`}
			className="block"
			onSelect={() => {
				router.push(result.url);
				setOpen(false);
			}}
		>
			{title && (
				<div
					id={`${id}-title`}
					className="font-medium text-sm block overflow-ellipsis whitespace-nowrap"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: should be safe
					dangerouslySetInnerHTML={{ __html: title }}
				/>
			)}
			{description && (
				<div
					id={`${id}-description`}
					className="overflow-ellipsis whitespace-nowrap text-xs overflow-hidden text-muted-foreground"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: should be safe
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			)}
			<div className="text-2xs text-muted-foreground">
				{breadcrumbsToString(breadcrumbs)}
			</div>
		</CommandItem>
	);
};

const SearchResults = ({
	query,
	collection,
}: {
	query: string;
	collection: AutocompleteCollection<Entry>;
}) => {
	if (!collection || collection.items.length === 0) {
		return (
			<CommandEmpty>
				Nothing found for{" "}
				<strong className="break-words font-semibold">
					&lsquo;{query}&rsquo;
				</strong>
			</CommandEmpty>
		);
	}

	return (
		<CommandGroup heading="Results">
			{collection.items.map((result) => (
				<SearchResult key={result.objectID} result={result} />
			))}
		</CommandGroup>
	);
};

export const AlgoliaSearchBox = ({ className }: { className?: string }) => {
	const { autocomplete, autocompleteState } = useAutocomplete();
	const { open, setOpen } = dialogStore((state) => state);
	// @ts-expect-error event type is wrong
	const inputProps = autocomplete.getInputProps({});

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "/" && !open) {
				e.preventDefault();
				setOpen(true);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, setOpen]);

	return (
		<div className={className}>
			<label className="relative items-center hidden lg:flex border p-2 bg-background rounded-md w-[400px] mx-auto">
				<SearchIcon className="absolute left-2 size-4 opacity-50 pointer-events-none" />
				<input
					type="text"
					className="flex rounded-md text-sm outline-none pl-6 w-full"
					name="search"
					placeholder={inputProps.placeholder}
					onFocus={() => setOpen(true)}
				/>
				<kbd className="pointer-events-none absolute right-2 h-5 select-none flex items-center rounded-md border px-1.5 text-muted-foreground text-xs bg-zinc-50">
					<span>/</span>
				</kbd>
			</label>

			<button
				type="button"
				className="flex lg:hidden"
				onClick={() => setOpen(true)}
			>
				<SearchIcon
					className="h-4 w-4 shrink-0 opacity-50"
					aria-label="Search"
				/>
			</button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="top-4 translate-y-0 max-w-full sm:max-w-screen-sm overflow-hidden p-0 shadow-lg gap-2">
					<DialogTitle className="sr-only">Search</DialogTitle>
					<DialogDescription className="sr-only">
						Search the docs
					</DialogDescription>

					<Command shouldFilter={false} disablePointerSelection>
						<CommandInput
							value={autocompleteState?.query}
							onValueChange={(value) => {
								autocomplete.setQuery(value);
								autocomplete.refresh();
							}}
						/>
						<CommandList>
							{autocompleteState && autocompleteState.query !== "" && (
								<SearchResults
									query={autocompleteState?.query}
									collection={autocompleteState?.collections[0]}
								/>
							)}
						</CommandList>
					</Command>
				</DialogContent>
			</Dialog>
		</div>
	);
};
