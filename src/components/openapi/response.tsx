"use client";

import { shiki, shikiOptions } from "@/lib/shiki";
import { Suspense, use } from "react";

interface ResponseProps {
	response: ArrayBuffer | Error | null;
	headers: Headers | undefined;
}

export function PlaygroundResponse({ response, headers }: ResponseProps) {
	if (!response) return null;

	return (
		<div>
			<Suspense fallback={<p>Loading...</p>}>
				<ServerResponse response={response} headers={headers} />
			</Suspense>
			<Headers headers={headers} />
		</div>
	);
}

const ServerResponse = ({ response, headers }: ResponseProps) => {
	if (!response) return null;
	if (response instanceof Error) return <p>Error: {response.message}</p>;

	const contentType = headers?.get("content-type");
	switch (contentType) {
		case "application/json":
			return <JSONResponse response={response} />;
		default:
			return <TextResponse response={response} />;
	}
};

const textDecoder = new TextDecoder();

const JSONResponse = ({ response }: { response: ArrayBuffer }) => {
	const jsonStr = textDecoder.decode(response);
	const json = JSON.parse(jsonStr);
	const highlighter = use(shiki);

	return (
		<div>
			<p>JSON</p>
			<div
				className="overflow-y-auto max-h-[400px] border"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: json
				dangerouslySetInnerHTML={{
					__html: highlighter.codeToHtml(JSON.stringify(json, null, 2), {
						themes: shikiOptions.theme,
						lang: "json",
					}),
				}}
			/>
		</div>
	);
};

const TextResponse = ({ response }: { response: ArrayBuffer }) => {
	return (
		<div>
			<p>Text</p>
			<pre>{String(response)}</pre>
		</div>
	);
};

const Headers = ({ headers }: Pick<ResponseProps, "headers">) => {
	if (!headers) return null;

	return (
		<div>
			<p>Headers</p>
			<pre>{JSON.stringify(Object.fromEntries(headers), null, 2)}</pre>
		</div>
	);
};
