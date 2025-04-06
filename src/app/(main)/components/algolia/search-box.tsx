"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCodeSSlashLine,
  RiBookLine,
  RiCloseLine,
  RiCornerDownLeftLine,
  RiHistoryLine,
  RiSearch2Line,
} from '@remixicon/react';

import * as CommandMenu from '@/components/ui/command-menu';
import * as CompactButton from '@/components/ui/compact-button';
import * as Kbd from '@/components/ui/kbd';
import * as LinkButton from '@/components/ui/link-button';
import * as Tag from '@/components/ui/tag';
import { AutocompleteCollection, Entry, useAutocomplete } from "@/app/(main)/components/algolia/useAlgoliaSearch";
import { cn } from "@/lib/utils";
import { searchStore } from "./search.store";


const SearchResultIcon = {
  guide: RiBookLine,
  api: RiCodeSSlashLine,
  changelog: RiHistoryLine,
}

const suggested: Entry[] = [{
  objectID: '1',
  url: '/changelog/xyz',
  category: 'changelog',
  _highlightResult: {
    headline: {
      value: 'Latest Changes',
      matchedWords: [],
    },
  }
},
];

const SearchResult = ({
  result,
  append = true
}: {
  result: Entry;
  append?: boolean;
}) => {
  const id = useId();
  const setOpen = searchStore((state) => state.setOpen);
  const appendHistory = searchStore((state) => state.appendHistory);
  const router = useRouter();

  const title = result._highlightResult.headline?.value;
  const description = result._highlightResult.description?.value;

  // const breadcrumbs = getPageBreadcrumbs(result.url).slice(0, -1);
  const breadcrumbs = [];

  const icon = SearchResultIcon[result.category];

  return (
    <CommandMenu.Item
      value={result.objectID}
      aria-labelledby={`${id}-title`}
      title={result.url}
      onSelect={() => {
        router.push(result.url);
        setOpen(false);
        if (append) {
          appendHistory(result);
        }
      }}
    >
      <CommandMenu.ItemIcon as={icon} />
      <div>
        {title && (
          <div
            id={`${id}-title`}
            className="overflow-ellipsis whitespace-nowrap"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: should be safe
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {description && (
          <div
            id={`${id}-description`}
            className="overflow-ellipsis whitespace-nowrap text-paragraph-xs overflow-hidden text-text-base"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: should be safe
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <div className="text-2xs text-muted-foreground">
          {/* {breadcrumbsToString(breadcrumbs)} */}
        </div>
      </div>
    </CommandMenu.Item>
  );
};

const SuggestedResults = () => {
  const history = searchStore((state) => state.history);
  const clearHistory = searchStore((state) => state.clearHistory);
  return (
    <>
      <CommandMenu.Group heading='Suggested Results'>
        {suggested.map((result) => (
          <SearchResult key={result.objectID} result={result} append={false} />
        ))}
      </CommandMenu.Group>
      {history.length > 0 && (
        <CommandMenu.Group heading='Recent Results'>
          <LinkButton.Root
            size='small'
            variant='gray'
            className='absolute right-4 top-5'
            onClick={clearHistory}
          >
            Clear Recent
          </LinkButton.Root>
          {history.map((result) => (
            <SearchResult key={result.objectID} result={result} append={false} />
          ))}
        </CommandMenu.Group>
      )}
    </>
  )
}

const SearchResults = ({
  query,
  collection,
}: {
  query: string;
  collection: AutocompleteCollection<Entry>;
}) => {
  if (!collection || collection.items.length === 0) {
    return (
      <CommandMenu.Empty>
        Nothing found for{" "}
        <strong className="break-words font-semibold">
          &lsquo;{query}&rsquo;
        </strong>
      </CommandMenu.Empty>
    );
  }

  return (
    <CommandMenu.Group heading={`Results (${collection.items.length})`}>
      {collection.items.map((result) => (
        <SearchResult key={result.objectID} result={result} />
      ))}
    </CommandMenu.Group>
  );
};

const DismissibleCategory = ({ category, label, onChange }: { category: string, label: string, onChange: () => void }) => {
  const searchCategories = searchStore((state) => state.searchCategories);
  const setEnabledCategory = searchStore((state) => state.setEnabledCategory);

  const enabled = searchCategories[category];

  const setEnabled = (enabled: boolean) => {
    setEnabledCategory(category, enabled);
    onChange();
  }

  return (
    <Tag.Root variant='gray' disabled={!enabled} className="pointer-events-auto cursor-pointer" onClick={() => setEnabled(!enabled)}>
      {label}
      <Tag.DismissButton type='button' />
    </Tag.Root>
  )

}

export const AlgoliaSearchBox = ({ className }: { className?: string }) => {
  const { autocomplete, autocompleteState } = useAutocomplete();
  const open = searchStore((state) => state.open);
  const setOpen = searchStore((state) => state.setOpen);

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

  const onDismissTag = () => {
    autocomplete.refresh();
  }

  return (
    <div className={className}>

      <label className="relative items-center flex border p-2 rounded-10 w-full max-w-[400px]">
        <RiSearch2Line
          className={cn(
            'absolute left-2 pointer-events-none',
            'text-text-lighter size-5 shrink-0',
            'transition duration-200 ease-out',
            // focus within
            'group-focus-within/cmd-input:text-primary-base',
          )}
        />

        <input
          type="text"
          className="flex rounded-md text-sm outline-none pl-6 w-full"
          name="search"
          placeholder={inputProps.placeholder}
          onFocus={() => setOpen(true)}
        />
        <Kbd.Root className="bg-navbar">
          /
        </Kbd.Root>
      </label>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} commandProps={{
        shouldFilter: false,
      }}>
        {/* Input wrapper */}
        <div className='group/cmd-input bg-bg-white flex h-12 w-full items-center gap-2 px-5'>
          <RiSearch2Line
            className={cn(
              'text-text-lighter size-5 shrink-0',
              'transition duration-200 ease-out',
              // focus within
              'group-focus-within/cmd-input:text-primary-base',
            )}
          />
          <CommandMenu.Input placeholder='Search or jump to'
            value={autocompleteState?.query}
            onValueChange={(value) => {
              autocomplete.setQuery(value);
              autocomplete.refresh();
            }} />
          <CompactButton.Root
            size='medium'
            variant='ghost'
            onClick={() => setOpen(false)}
          >
            <CompactButton.Icon as={RiCloseLine} />
          </CompactButton.Root>
        </div>

        {/* Searching for */}
        <div className='px-5 py-4'>
          <div className='text-label-xs text-text-sub-600 mb-3'>
            Searching for
          </div>
          <div className='flex flex-wrap gap-2'>
            <DismissibleCategory category='guide' label='Guides' onChange={onDismissTag} />
            <DismissibleCategory category='api' label='API' onChange={onDismissTag} />
            <DismissibleCategory category='changelog' label='Changelog' onChange={onDismissTag} />
          </div>
        </div>

        {/* Smart Prompt Examples */}
        <CommandMenu.List>
          {autocompleteState && autocompleteState.query !== "" ? (
            <SearchResults
              query={autocompleteState?.query}
              collection={autocompleteState?.collections[0]}
            />
          ) : <SuggestedResults />}
        </CommandMenu.List>

        {/* Footer */}
        <CommandMenu.Footer>
          <div className='flex gap-3'>
            <div className='flex items-center gap-2'>
              <CommandMenu.FooterKeyBox>
                <RiArrowUpLine className='size-4' />
              </CommandMenu.FooterKeyBox>
              <CommandMenu.FooterKeyBox>
                <RiArrowDownLine className='size-4' />
              </CommandMenu.FooterKeyBox>
              <span className='text-paragraph-xs text-text-base'>
                Navigate
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <CommandMenu.FooterKeyBox>
                <RiCornerDownLeftLine className='size-4' />
              </CommandMenu.FooterKeyBox>
              <span className='text-paragraph-xs text-text-base'>
                Select
              </span>
            </div>
          </div>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </div>
  );
};
