"use client";

import {
	type Examples,
	generateRequestsFromSchema,
} from "@/components/openapi/example";
import {
	ServerResponse,
	type ServerResponseProps,
} from "@/components/openapi/openapi-response";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tag } from "@/components/ui/tag";
import { editorOptions } from "@/lib/monaco";
import type { OpenAPIV3 } from "@/lib/openapi";
import { shiki, shikiOptions } from "@/lib/shiki";
import { cn } from "@/lib/utils";
import MonacoEditor, { type Monaco } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { type ReactFormExtendedApi, useForm } from "@tanstack/react-form";
import { ChevronRightIcon, LoaderCircleIcon } from "lucide-react";
import { Suspense, use, useMemo, useState } from "react";

interface OpenapiPlaygroundProps {
	spec: OpenAPIV3.OperationObject;
	path: string;
	method: OpenAPIV3.HttpMethods;
	server: string;
}

type FormType = {
	_body: string;
	[key: string]: unknown;
};

const buildUrl = (
	server: string,
	path: string,
	params: OpenAPIV3.ParameterObject[],
	values: FormType,
) => {
	let cleanPath = path;
	const queryParams = new URLSearchParams();
	for (const param of params) {
		const val = values[param.name] as string | string[];
		if (param.in === "query") {
			if (Array.isArray(val)) {
				for (const v of val) {
					queryParams.append(param.name, v);
				}
			} else {
				queryParams.set(param.name, val);
			}
		} else if (param.in === "path") {
			if (Array.isArray(val)) {
				const valStr = val.join(",");
				cleanPath = cleanPath.replace(`{${param.name}}`, valStr);
			} else {
				cleanPath = cleanPath.replace(`{${param.name}}`, val);
			}
		}
	}
	const targetUrl = new URL(`${server}${cleanPath}`);
	targetUrl.search = queryParams.toString();
	return targetUrl;
};

export function OpenapiPlaygroundTrigger({
	spec,
	path,
	method,
	server,
}: OpenapiPlaygroundProps) {
	const params = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
	const content = (spec.requestBody as OpenAPIV3.RequestBodyObject)?.content?.[
		"application/json"
	];
	const bodyExamples = useMemo(
		() => generateRequestsFromSchema(content),
		[content],
	);
	const firstBody = bodyExamples ? Object.values(bodyExamples)[0] : null;

	const [response, setResponse] = useState<ServerResponseProps | null>(null);

	const form = useForm<FormType>({
		defaultValues: {
			_body: firstBody ? JSON.stringify(firstBody, null, 2) : "",
			...params.reduce(
				(acc, key) => {
					acc[key.name] = "";
					return acc;
				},
				{} as Record<string, string>,
			),
		},
		onSubmit: async ({ value }) => {
			//const targetUrl = buildUrl(
			//	server,
			//	path,
			//	params,
			//	value,
			//);
			const targetUrl = new URL("https://jsonplaceholder.typicode.com/posts/1");

			let res: Response | null = null;
			try {
				res = await fetch(targetUrl.toString(), {
					method: method,
					headers: {
						"Content-Type": "application/json",
					},
					body: method === "get" ? undefined : value._body,
				});
				setResponse({
					response: await res.arrayBuffer(),
					headers: res.headers,
					statusCode: res.status,
				});
			} catch (error) {
				setResponse({
					response: error as Error,
					headers: res?.headers ?? undefined,
					statusCode: res?.status ?? 500,
				});
			}
		},
	});

	return (
		<Dialog>
			<div className="flex items-center py-1 gap-2">
				<UrlWithMethod method={method} path={path} />
				<DialogTrigger asChild>
					<Button className="font-semibold group" size="sm" type="button">
						<span>Try it out</span>
						<ChevronRightIcon className="size-4" />
					</Button>
				</DialogTrigger>
			</div>
			<DialogContent className="h-[90%] overflow-y-hidden max-w-screen-2xl lg:w-[calc(100vw-4rem)] p-0 block">
				<Form onSubmit={form.handleSubmit} className="h-full flex flex-col">
					<DialogClose className="absolute top-4 right-4 z-10" />

					<DialogTitle className="sr-only">Run in playground</DialogTitle>
					<DialogDescription className="sr-only">
						Try out the API in the playground
					</DialogDescription>
					<div className="border-b w-full py-2 gap-4 flex justify-center items-center">
						<UrlWithMethod method={method} path={path} />
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									size="sm"
									disabled={!canSubmit || isSubmitting}
									className="font-semibold group"
								>
									<span>Send</span>

									{isSubmitting ? (
										<LoaderCircleIcon className="size-4 animate-spin" />
									) : (
										<ChevronRightIcon className="size-4" />
									)}
								</Button>
							)}
						</form.Subscribe>
					</div>

					<ResizablePanelGroup
						direction="horizontal"
						autoSaveId="playground"
						className="grow"
						style={{ height: "auto" }}
					>
						<CustomResizablePanel title="Request">
							<Request spec={spec} form={form} examples={bodyExamples} />
						</CustomResizablePanel>
						<ResizableHandle withHandle />
						<CustomResizablePanel title="Response">
							<Response response={response} />
						</CustomResizablePanel>
					</ResizablePanelGroup>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

const CustomResizablePanel = ({
	children,
	title,
	...props
}: React.ComponentProps<typeof ResizablePanel> & { title: string }) => {
	return (
		<ResizablePanel
			minSize={10}
			collapsible
			collapsedSize={10}
			className="prose data-[panel-size=10.0]:pointer-events-none data-[panel-size=10.0]:opacity-50 flex flex-col"
			{...props}
		>
			<div className="font-mono w-full border-b px-2">{title}</div>
			<div className="overflow-x-visible min-w-[400px] py-2 grow">
				{children}
			</div>
		</ResizablePanel>
	);
};

const ParameterField = ({
	param,
	form,
}: {
	param: OpenAPIV3.ParameterObject;
	form: ReactFormExtendedApi<FormType>;
}) => {
	const { name, schema } = param;
	if (!schema) return null;

	return (
		<div className="flex items-center gap-2">
			<span className="shrink-0">{name}</span>
			<form.Field name={name}>
				{(field) => (
					<Input
						value={field.state.value as string}
						name={field.name}
						onBlur={field.handleBlur}
						onChange={(e) => {
							field.handleChange(e.target.value);
						}}
					/>
				)}
			</form.Field>
		</div>
	);
};

const Request = ({
	spec,
	form,
	examples,
}: {
	spec: OpenAPIV3.OperationObject;
	form: ReactFormExtendedApi<FormType>;
	examples: Examples | null;
}) => {
	const parameters = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
	const requestBody = spec.requestBody as OpenAPIV3.RequestBodyObject;
	const content = requestBody?.content?.["application/json"];
	const highlighter = use(shiki);

	const handleEditorWillMount = (monaco: Monaco) => {
		shikiToMonaco(highlighter, monaco);

		const schema = content.schema;
		// TODO: fix directly in the openapi schema
		// note: we should also fix the enum (see fields and issue on order)
		// @ts-expect-error hack
		for (const entry of Object.entries(schema.properties)) {
			const [key, value] = entry;
			// @ts-expect-error hack
			if (value.format === "YYYY-MM-DD") {
				// @ts-expect-error hack
				value.type = "string";
				// @ts-expect-error hack
				value.format = "date";
			}
		}

		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "http://schema/schema.json",
					fileMatch: ["*"], // Match all files
					schema: content?.schema,
				},
			],
		});
	};

	return (
		<div className="flex flex-col gap-2 h-full px-2">
			{parameters.length > 0 && (
				<div>
					{parameters.map((param) => (
						<ParameterField key={param.name} param={param} form={form} />
					))}
				</div>
			)}
			<form.Field name="_body">
				{(field) => (
					<MonacoEditor
						language="json"
						theme={shikiOptions.theme.dark}
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

const Response = ({
	response,
}: {
	response: ServerResponseProps | null;
}) => {
	if (!response) return <ResponsePlaceholder />;

	return (
		<div className="flex flex-col gap-2 h-full">
			<div className="grow p-2">
				<Suspense fallback={<ResponsePlaceholder />}>
					<ServerResponse {...response} />
				</Suspense>
			</div>
			<div className="h-[200px] justify-end border-t p-2">headers</div>
		</div>
	);
};

const ResponsePlaceholder = () => {
	return <div className="overflow-x-visible h-full">response</div>;
};

const UrlWithMethod = ({
	method,
	path,
	className,
}: { method: OpenAPIV3.HttpMethods; path: string; className?: string }) => {
	return (
		<div
			className={cn(
				"border bg-background rounded-md w-auto px-2 flex items-center gap-2 divide-x",
				className,
			)}
		>
			<Tag variant="small" className="text-xs">
				{method.toUpperCase()}
			</Tag>
			<code
				data-language="plaintext"
				className="text-xs text-slate-600 px-px pl-2"
			>
				<PathWithColoredParams path={path} />
			</code>
		</div>
	);
};

const PathWithColoredParams = ({ path }: { path: string }) => {
	const params = path.split("/").map((part, index) => {
		const isParam = part[0] === "{" && part[part.length - 1] === "}";
		const key = `${part}-${index}`;
		const isLast = index === path.split("/").length - 1;
		if (isParam) {
			return (
				<span key={key}>
					<mark className="text-emerald-500 dark:text-emerald-400  bg-emerald-400/10 rounded-lg px-1.5">
						{part}
					</mark>
					/
				</span>
			);
		}
		return (
			<span key={key}>
				{part}
				{isLast ? "" : "/"}
			</span>
		);
	});

	return <code data-language="plaintext">{params}</code>;
};
