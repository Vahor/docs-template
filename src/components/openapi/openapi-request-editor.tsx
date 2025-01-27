"use client";

import type { FormType } from "@/components/openapi/openapi-playground";
import { FormLabel } from "@/components/ui/form";
import { editorOptions } from "@/lib/monaco";
import type { OpenAPIV3 } from "@/lib/openapi";
import MonacoEditor, { type Monaco } from "@monaco-editor/react";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

export const OpenApiRequestEditor = ({
	schema,
	form,
}: {
	schema: OpenAPIV3.SchemaObject;
	form: ReactFormExtendedApi<FormType>;
}) => {
	const handleEditorWillMount = (monaco: Monaco) => {
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "http://schema/schema.json", // Don't care about the url, just need to be a valid uri
					fileMatch: ["*"], // Match all files
					schema: schema,
				},
			],
		});
	};

	return (
		<div className="h-full min-h-[400px]">
			<FormLabel required>Body</FormLabel>

			<div className="border p-2 rounded-xl h-[calc(100%-2rem)]">
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
		</div>
	);
};
