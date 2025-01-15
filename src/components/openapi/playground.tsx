"use client";

import type { OpenapiQueryProps } from "@/components/openapi/openapi-query";
import { PlaygroundResponse } from "@/components/openapi/response";
import { generateFromSchema } from "@/components/openapi/utils";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { OpenAPIV3 } from "@/lib/openapi";
import { shiki, shikiOptions } from "@/lib/shiki";
import { Suspense, use, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";

type FormType = {
	_body: string;
	[key: string]: unknown;
};

export function OpenapiPlayground({
	spec,
	path,
	method,
	server,
}: { spec: OpenAPIV3.OperationObject } & OpenapiQueryProps & {
		server: OpenAPIV3.ServerObject;
	}) {
	const requestBody = (spec.requestBody as OpenAPIV3.RequestBodyObject)
		?.content?.["application/json"].schema as OpenAPIV3.BaseSchemaObject;
	const parameters = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
	const requestDefaultValues = generateFromSchema(requestBody);
	const [loading, setLoading] = useState(false);
	const [headers, setHeaders] = useState<Headers | undefined>(undefined);
	const [response, setResponse] = useState<ArrayBuffer | Error | null>(null);

	const form = useForm<FormType>({
		defaultValues: {
			_body: requestDefaultValues
				? JSON.stringify(requestDefaultValues, null, 2)
				: undefined,
			...parameters.reduce(
				(acc, param) => {
					acc[param.name] = (param.schema as OpenAPIV3.SchemaObject).default;
					return acc;
				},
				{} as Record<string, string>,
			),
		},
	});

	const onSubmit = async (data: FormType) => {
		const { _body, ...rest } = data;
		try {
			setLoading(true);
			const url = new URL(`${server.url}${path}`);
			if (rest.length !== 0) {
				for (const [key, value] of Object.entries(rest)) {
					// TODO: handle array and object
					url.searchParams.set(key, String(value));
				}
			}
			const res = await fetch(url, {
				method: method,
				headers: {
					"Content-Type": "application/json",
				},
				body: _body,
			});
			setHeaders(res.headers);
			setResponse(await res.arrayBuffer());
		} catch (error) {
			setResponse(error as Error);
			setHeaders(undefined);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<ParamsPlayground form={form} parameters={parameters} />
				<Suspense>
					<BodyPlayground form={form} requestBody={requestBody} />
				</Suspense>
				<Button type="submit" disabled={loading}>
					Submit
				</Button>
				<Suspense fallback={<p>Loading...</p>}>
					{(loading || response) && (
						<PlaygroundResponse response={response} headers={headers} />
					)}
				</Suspense>
			</form>
		</Form>
	);
}

const PlaygroundSelect = ({
	field,
	onChange,
	defaultValue,
}: {
	field: OpenAPIV3.ParameterObject;
	onChange: (value: string) => void;
	defaultValue: string;
}) => {
	const schema = field.schema as OpenAPIV3.SchemaObject;
	return (
		<Select
			name={field.name}
			onValueChange={onChange}
			defaultValue={defaultValue}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a value" />
			</SelectTrigger>
			<SelectContent>
				{schema.enum?.map((value) => (
					<SelectItem key={value} value={value}>
						{value}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

function ParamsPlayground({
	parameters,
	form,
}: { parameters: OpenAPIV3.ParameterObject[]; form: UseFormReturn<FormType> }) {
	if (!parameters || !parameters.length) return null;

	return (
		<div>
			{parameters.map((param) => {
				const schema = param.schema as OpenAPIV3.SchemaObject;
				const required = param.required ?? false;

				return (
					<FormField
						key={param.name}
						control={form.control}
						name={param.name}
						render={({ field }) => (
							<FormItem className="grid grid-cols-3">
								<div className="col-span-1">
									<FormLabel required={required}>{field.name}</FormLabel>
									<p>{schema.type}</p>
								</div>
								<div className="col-span-2">
									<p>{param.description}</p>
									<p>Default: {schema.default}</p>
									<FormControl>
										{schema.type === "array" || schema.enum?.length ? (
											<PlaygroundSelect
												field={param}
												onChange={field.onChange}
												defaultValue={field.value as string}
											/>
										) : (
											<p>todo</p>
										)}
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>
				);
			})}
		</div>
	);
}

function BodyPlayground({
	requestBody,
	form,
}: { requestBody: OpenAPIV3.BaseSchemaObject; form: UseFormReturn<FormType> }) {
	if (!requestBody) return null;

	const highlighter = use(shiki);
	const [editing, setEditing] = useState(false);
	const value = form.watch("_body");

	return (
		<div>
			<p>Body</p>
			<div>
				{editing ? (
					<Textarea
						value={value}
						cacheMeasurements
						minRows={3}
						className="resize-none px-0 py-0 font-mono"
						autoCorrect="off"
						onChange={(e) => {
							form.setValue("_body", e.target.value);
						}}
					/>
				) : (
					<div
						className="border"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: json
						dangerouslySetInnerHTML={{
							__html: highlighter.codeToHtml(value, {
								themes: shikiOptions.theme,
								lang: "json",
							}),
						}}
					/>
				)}
			</div>
			<button
				type="button"
				onClick={() => {
					setEditing((prev) => !prev);
				}}
			>
				{editing ? "Hide" : "Show"}
			</button>
		</div>
	);
}
