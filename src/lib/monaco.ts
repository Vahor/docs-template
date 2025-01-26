import type { EditorProps } from "@monaco-editor/react";

export const editorOptions: EditorProps["options"] = {
	fontSize: 14,
	padding: {
		top: 8,
		bottom: 8,
	},
	fontWeight: "normal",
	wordWrap: "on",
	lineNumbers: "off",
	lineNumbersMinChars: 0,
	overviewRulerLanes: 0,
	overviewRulerBorder: false,
	hideCursorInOverviewRuler: true,
	lineDecorationsWidth: 0,
	glyphMargin: false,
	folding: false,
	fontFamily: "var(--font-mono)",
	renderControlCharacters: true,
	codeLens: false,
	tabCompletion: "on",
	selectionHighlight: false,
	scrollbar: {
		horizontal: "hidden",
		vertical: "hidden",
		// avoid can not scroll page when hover monaco
		alwaysConsumeMouseWheel: false,
	},
	// disable 'guides'
	guides: {
		indentation: false,
		bracketPairsHorizontal: false,
		highlightActiveIndentation: false,
	},
	// disable `Find`
	find: {
		addExtraSpaceOnTop: false,
		autoFindInSelection: "never",
		seedSearchStringFromSelection: "never",
	},
	minimap: { enabled: false },
	wordBasedSuggestions: "off",
	links: false,
	cursorStyle: "line-thin",
	contextmenu: false,
	roundedSelection: true,
	hover: {
		enabled: true,
		delay: 100,
	},
	acceptSuggestionOnEnter: "on",
	automaticLayout: true,
	scrollBeyondLastLine: false,
};
