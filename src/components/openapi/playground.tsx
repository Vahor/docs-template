"use client";

import type { OpenapiQueryProps } from "@/components/openapi/openapi-query";
import { PlaygroundResponse } from "@/components/openapi/response";
import {
	type Examples,
	generateRequestsFromSchema,
} from "@/components/openapi/example";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code/code-block";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { NativeSelect } from "@/components/ui/native-select";
import { Properties, Property } from "@/components/ui/property";
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
	const parameters = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
	const bodyExamples = generateRequestsFromSchema(spec);
	const [loading, setLoading] = useState(false);
	const [headers, setHeaders] = useState<Headers | undefined>(undefined);
	const [response, setResponse] = useState<ArrayBuffer | Error | null>(null);

	const firstExample = Object.values(bodyExamples)[0];

	const form = useForm<FormType>({
		defaultValues: {
			_body: JSON.stringify(firstExample, null, 2),
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
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 h-full relative"
			>
				<ParamsPlayground form={form} parameters={parameters} />
				<Suspense>
					<BodyPlayground form={form} examples={bodyExamples} />
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
	values,
}: {
	field: OpenAPIV3.ParameterObject;
	onChange: (value: string) => void;
	defaultValue: string;
	values?: string[];
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
				{(values ?? schema.enum)?.map((value) => (
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
		<Properties>
			{parameters.map((param) => {
				const schema = param.schema as OpenAPIV3.SchemaObject;

				return (
					<FormField
						key={param.name}
						control={form.control}
						name={param.name}
						render={({ field }) => (
							<FormItem>
								<Property
									key={param.name}
									name={param.name}
									type={schema.type}
									required={param.required}
								>
									<FormControl>
										{schema.type === "array" || schema.enum?.length ? (
											<PlaygroundSelect
												field={param}
												onChange={field.onChange}
												defaultValue={field.value as string}
											/>
										) : schema.type === "boolean" ? (
											<PlaygroundSelect
												field={param}
												onChange={field.onChange}
												defaultValue={field.value as string}
												values={["true", "false"]}
											/>
										) : (
											<p>todo</p>
										)}
									</FormControl>
									<FormMessage />
								</Property>
							</FormItem>
						)}
					/>
				);
			})}
		</Properties>
	);
}

function BodyPlayground({
	form,
	examples,
}: { form: UseFormReturn<FormType>; examples: Examples }) {
	const highlighter = use(shiki);
	const [editing, setEditing] = useState(false);
	const value = form.watch("_body");

	return (
		<CodeBlock filename="Request" className="text-white">
			{editing ? (
				<Textarea
					value={value}
					cacheMeasurements
					minRows={3}
					className="resize-none py-4 px-[1.375rem] font-mono border-none focus-visible:ring-0 text-xs max-h-[500px] group-data-[fullscreen=true]:max-h-[calc(100svh-theme(spacing.12))]"
					autoCorrect="off"
					spellCheck={false}
					onChange={(e) => {
						form.setValue("_body", e.target.value);
					}}
				/>
			) : (
				<div
					className="[&_code]:grid [&_span]:break-words [&_pre]:rounded-2xl"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: json
					dangerouslySetInnerHTML={{
						__html: highlighter.codeToHtml(value, {
							theme: shikiOptions.theme,
							lang: "json",
						}),
					}}
				/>
			)}

			<div className="flex items-center justify-between gap-4 w-full">
				<button
					type="button"
					onClick={() => {
						setEditing((prev) => !prev);
					}}
				>
					{editing ? "Hide" : "Edit"}
				</button>
				<NativeSelect
					className="border-zinc-800 basis-2/3 h-6 py-1 text-sm overflow-hidden truncate"
					onChange={(e) => {
						const example = examples[e.target.value];
						form.setValue("_body", JSON.stringify(example, null, 2));
					}}
				>
					{Object.keys(examples).map((key) => (
						<option key={key} value={key}>
							{key === "schema" ? "Schema" : key}
						</option>
					))}
				</NativeSelect>
			</div>
		</CodeBlock>
	);
}
