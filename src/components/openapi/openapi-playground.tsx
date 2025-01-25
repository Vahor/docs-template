"use client";

import {
	type Examples,
	generateRequestsFromSchema,
} from "@/components/openapi/example";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code/code-block";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
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
import { Textarea } from "@/components/ui/textarea";
import type { OpenAPIV3 } from "@/lib/openapi";
import { cn } from "@/lib/utils";
import { type ReactFormExtendedApi, useForm } from "@tanstack/react-form";
import { ChevronRightIcon } from "lucide-react";

interface OpenapiPlaygroundProps {
	spec: OpenAPIV3.OperationObject;
	path: string;
	method: OpenAPIV3.HttpMethods;
}

type FormType = {
	_body: string;
	[key: string]: unknown;
};

export function OpenapiPlaygroundTrigger({
	spec,
	path,
	method,
}: OpenapiPlaygroundProps) {
	const params = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
	const content = (spec.requestBody as OpenAPIV3.RequestBodyObject)?.content?.[
		"application/json"
	];
	const bodyExamples = generateRequestsFromSchema(content);
	const firstBody = bodyExamples ? Object.values(bodyExamples)[0] : null;

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
		onSubmit: async (values) => {
			console.log(values);
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
						<Button className="font-semibold group" size="sm" type="submit">
							<span>Send</span>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>

					<ResizablePanelGroup
						direction="horizontal"
						autoSaveId="playground"
						className="grow"
						style={{ height: "auto" }}
					>
						<CustomResizablePanel>
							<Request spec={spec} form={form} examples={bodyExamples} />
						</CustomResizablePanel>
						<ResizableHandle withHandle />
						<CustomResizablePanel>
							<Response />
						</CustomResizablePanel>
					</ResizablePanelGroup>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

const CustomResizablePanel = ({
	children,
	...props
}: React.ComponentProps<typeof ResizablePanel>) => {
	return (
		<ResizablePanel
			minSize={10}
			collapsible
			collapsedSize={10}
			className="group"
			{...props}
		>
			<div className="overflow-x-visible h-full group-data-[panel-size=10.0]:pointer-events-none group-data-[panel-size=10.0]:opacity-50 prose p-2 min-w-[400px]">
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
			<span>{name}</span>
			<form.Field name={name}>
				{(field) => (
					<Input
						className="flex-1 max-w-[400px]"
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

	return (
		<div className="flex flex-col gap-2 h-full">
			{parameters.length > 0 && (
				<div>
					{parameters.map((param) => (
						<ParameterField key={param.name} param={param} form={form} />
					))}
				</div>
			)}

			{examples && (
				<CodeBlock className="grow">
					<form.Field name="_body">
						{(field) => (
							<Textarea
								className="resize-none py-4 px-[1.375rem] font-mono border-none focus-visible:ring-0 text-xs text-white h-full overflow-y-auto"
								autoCorrect="off"
								spellCheck={false}
								value={field.state.value as string}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => {
									field.handleChange(e.target.value);
								}}
							/>
						)}
					</form.Field>
				</CodeBlock>
			)}
		</div>
	);
};

const Response = () => {
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
