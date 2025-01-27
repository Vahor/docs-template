"use client";

import type { FormType } from "@/components/openapi/openapi-playground";
import { editorOptions } from "@/lib/monaco";
import type { OpenAPIV3 } from "@/lib/openapi";
import MonacoEditor, { type Monaco } from "@monaco-editor/react";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

export const OpenApiRequestEditor = ({
	spec,
	form,
}: {
	spec: OpenAPIV3.OperationObject;
	form: ReactFormExtendedApi<FormType>;
}) => {
	const requestBody = spec.requestBody as OpenAPIV3.RequestBodyObject;
	const content = requestBody?.content?.["application/json"];
	if (!content?.schema) return null;

	const handleEditorWillMount = (monaco: Monaco) => {
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "http://schema/schema.json", // Don't care about the url, just need to be a valid uri
					fileMatch: ["*"], // Match all files
					schema: content.schema,
				},
			],
		});
	};

	return (
		<div
			className="border p-2 rounded-xl h-full min-h-[200px]"
			data-editor-wrapper
		>
			<form.Field name="_body">
				{(field) => (
					<MonacoEditor
						language="json"
						theme="light"
						value={field.state.value as string}
						options={editorOptions}
						beforeMount={handleEditorWillMount}
						onChange={(value) => {
							field.handleChange(value ?? "");
						}}
					/>
				)}
			</form.Field>
		</div>
	);
};
