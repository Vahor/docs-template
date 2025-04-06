import { Entry } from "@/app/(main)/components/algolia/useAlgoliaSearch";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface SearchStore {
	open: boolean;
	setOpen: (open: boolean) => void;
	searchCategories: Record<string, boolean>;
	getSearchCategories: () => Record<string, boolean>;
	setEnabledCategory: (category: string, enabled: boolean) => void;
	history: Entry[];
	clearHistory: () => void;
	appendHistory: (entry: Entry) => void;
}

export const searchStore = create<SearchStore>()(persist(
	(set, get) => ({
		open: false,
		setOpen: (open) => set({ open }),
		searchCategories: {
			guides: true,
			api: true,
			changelog: true,
		},
		setEnabledCategory: (category: string, enabled: boolean) => {
			set({
				searchCategories: {
					...get().searchCategories,
					[category]: enabled,
				},
			});
		},
		getSearchCategories: () => get().searchCategories,
		history: [],
		clearHistory: () => set({ history: [] }),
		appendHistory: (entry) => {
			const history = get().history;
			if (history.some((item) => item.objectID === entry.objectID)) {
				return;
			}
			const cleanEntry: Entry = {
				...entry,
				_highlightResult: {
					headline: { value: entry.headline ?? entry._highlightResult.headline?.value ?? '', matchedWords: [] },
					description: { value: entry.description ?? entry._highlightResult.description?.value ?? '', matchedWords: [] },
				},
			};

			const newHistory = [cleanEntry, ...history];
			if (newHistory.length > 5) {
				newHistory.pop();
			}
			// remove highlights
			set({ history: newHistory });
		},
	}),
	{
		name: 'search-store',
		partialize: (state) => ({ searchCategories: state.searchCategories, history: state.history }),
		storage: createJSONStorage(() => localStorage),
	},
));
