"use client";

import type { Examples } from "@/components/openapi/example";
import { CodeBlock } from "@/components/ui/code/code-block";
import { NativeSelect } from "@/components/ui/native-select";
import { shiki, shikiOptions } from "@/lib/shiki";
import { Suspense, use, useState } from "react";

export function SchemaViewer({
	examples,
	title,
}: { examples: Examples | null; title: string }) {
	if (examples == null || Object.keys(examples).length === 0) return null;
	return (
		<Suspense>
			<Viewer examples={examples} title={title} />
		</Suspense>
	);
}

function Viewer({ examples, title }: { examples: Examples; title: string }) {
	const [value, setValue] = useState<string>(() =>
		JSON.stringify(Object.values(examples)[0], null, 2),
	);
	const highlighter = use(shiki);

	return (
		<CodeBlock filename={title}>
			<div
				className="[&_code]:max-h-[500px]"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: json
				dangerouslySetInnerHTML={{
					__html: highlighter.codeToHtml(value, {
						theme: shikiOptions.theme.dark,
						lang: "json",
					}),
				}}
			/>

			{Object.keys(examples).length === 1 ? null : (
				<div className="flex items-center justify-between gap-4 w-full">
					<span className="basis-1/3 text-xs">Select schema</span>
					<NativeSelect
						className="border-zinc-600 basis-2/3 py-1 text-sm overflow-hidden truncate px-1.5"
						onChange={(e) => {
							const example = examples[e.target.value];
							setValue(JSON.stringify(example, null, 2));
						}}
					>
						{Object.keys(examples).map((key) => (
							<option key={key} value={key}>
								{key === "schema" ? "Schema" : key}
							</option>
						))}
					</NativeSelect>
				</div>
			)}
		</CodeBlock>
	);
}
