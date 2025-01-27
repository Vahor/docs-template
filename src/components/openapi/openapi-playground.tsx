"use client";

import {
	type Examples,
	generateRequestsFromSchema,
} from "@/components/openapi/example";
import { OpenApiBoxedUrl } from "@/components/openapi/openapi-boxed-url";
import { ParameterField } from "@/components/openapi/openapi-playground-parameter";
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
import { Form, FormLabel } from "@/components/ui/form";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { OpenAPIV3 } from "@/lib/openapi";
import { buildUrl } from "@/lib/url";
import { type ReactFormExtendedApi, useForm } from "@tanstack/react-form";
import { ChevronRightIcon, LoaderCircleIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense, useMemo, useState } from "react";

const OpenApiRequestEditor = dynamic(
	() =>
		import("./openapi-request-editor").then((mod) => mod.OpenApiRequestEditor),
	{ ssr: false },
);

interface OpenapiPlaygroundProps {
	spec: OpenAPIV3.OperationObject;
	path: string;
	method: OpenAPIV3.HttpMethods;
	server: string;
}

export type FormType = {
	_body: string;
	[key: string]: unknown;
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
			const _targetUrl = buildUrl(server, path, params, value);
			console.log(_targetUrl.toString());
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
					//response: await res.arrayBuffer(),
					// encode body for debug
					response: new TextEncoder().encode(value._body).buffer,
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
				<OpenApiBoxedUrl method={method} path={path} />
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
						<OpenApiBoxedUrl method={method} path={path} />
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
							<Request spec={spec} form={form} />
						</CustomResizablePanel>
						{!response ? null : (
							<>
								<ResizableHandle withHandle />
								<CustomResizablePanel title="Response" defaultSize={60}>
									<Response response={response} />
								</CustomResizablePanel>
							</>
						)}
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
}: Omit<React.ComponentProps<typeof ResizablePanel>, "title"> & {
	title: React.ReactNode;
}) => {
	return (
		<ResizablePanel
			minSize={15}
			collapsible
			collapsedSize={15}
			className="prose data-[panel-size=15.0]:pointer-events-none data-[panel-size=15.0]:opacity-50 flex flex-col"
			{...props}
		>
			<div className="font-mono w-full border-b px-2">{title}</div>
			<div className="overflow-x-visible overflow-y-hidden min-w-[400px] py-2 h-full @container">
				{children}
			</div>
		</ResizablePanel>
	);
};

const Request = ({
	spec,
	form,
}: {
	spec: OpenAPIV3.OperationObject;
	form: ReactFormExtendedApi<FormType>;
}) => {
	const parameters = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
	const requestBody = spec.requestBody as OpenAPIV3.RequestBodyObject;
	const content = requestBody?.content?.["application/json"];
	const schema = content?.schema as OpenAPIV3.SchemaObject;

	return (
		<div className="flex flex-col gap-2 h-full px-1 overflow-y-auto mx-1">
			{parameters.length > 0 && (
				<div className="flex flex-col gap-2">
					{parameters.map((param) => (
						<ParameterField key={param.name} param={param} form={form} />
					))}
				</div>
			)}
			{schema && (
				<Suspense
					fallback={
						<div className="h-full flex items-center justify-center">
							Loading...
						</div>
					}
				>
					<OpenApiRequestEditor schema={schema} form={form} />
				</Suspense>
			)}
		</div>
	);
};

const Response = ({
	response,
}: {
	response: ServerResponseProps | null;
}) => {
	if (!response) return null;

	return (
		<ResizablePanelGroup
			direction="vertical"
			autoSaveId="response"
			className="gap-2 h-full"
		>
			<ResizablePanel
				minSize={10}
				collapsible
				collapsedSize={10}
				className="grow px-2 overflow-hidden h-full"
			>
				<ServerResponse {...response} />
			</ResizablePanel>

			<ResizableHandle withHandle />

			{response.headers && (
				<ResizablePanel
					minSize={10}
					collapsible
					collapsedSize={10}
					className="shrink-0 justify-end px-2 pt-2 overflow-y-auto [&>div]:max-h-full"
				>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Header</TableHead>
								<TableHead>Value</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="overflow-y-auto">
							{Array.from(response.headers.entries()).map(([key, value]) => (
								<TableRow key={key}>
									<TableCell>{key}</TableCell>
									<TableCell>{value}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ResizablePanel>
			)}
		</ResizablePanelGroup>
	);
};
