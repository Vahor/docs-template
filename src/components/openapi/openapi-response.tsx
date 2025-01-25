"use client";

import { CodeBlock } from "@/components/ui/code/code-block";
import { shiki, shikiOptions } from "@/lib/shiki";
import { use } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface ServerResponseProps {
	response: ArrayBuffer | Error | null;
	headers: Headers | undefined;
	statusCode: number;
}

export const ServerResponse = ({ response, headers }: ServerResponseProps) => {
	if (!response) return null;
	if (response instanceof Error)
		return <ErrorResponse message={response.message} />;

	console.log({ response, headers });

	const contentType = headers?.get("content-type")?.split(";")[0];
	const child = (() => {
		switch (contentType) {
			case "application/json":
				return <JSONResponse response={response} />;
			default:
				return <TextResponse response={response} />;
		}
	})();

	return (
		<ErrorBoundary
			fallback={
				<ErrorResponse
					message={"Something went wrong, check console for more details"}
				/>
			}
			onError={console.error}
		>
			{child}
		</ErrorBoundary>
	);
};

const textDecoder = new TextDecoder();

const JSONResponse = ({ response }: { response: ArrayBuffer }) => {
	const jsonStr = textDecoder.decode(response);
	const json = JSON.parse(jsonStr);
	const highlighter = use(shiki);

	return (
		<CodeBlock className="text-white max-h-full group">
			<div
				className="[&_code]:grid [&_pre]:rounded-2xl"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: json
				dangerouslySetInnerHTML={{
					__html: highlighter.codeToHtml(JSON.stringify(json, null, 2), {
						theme: shikiOptions.theme.dark,
						lang: "json",
					}),
				}}
			/>
		</CodeBlock>
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

const ErrorResponse = ({ message }: { message: string }) => {
	return (
		<div>
			<p>Error</p>
			<pre>{message}</pre>
		</div>
	);
};
