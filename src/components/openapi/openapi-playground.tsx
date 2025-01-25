"use client";

import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import type { OpenAPIV3 } from "@/lib/openapi";
import { Tag } from "@/components/ui/tag";
import { useForm } from "@tanstack/react-form";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface OpenapiPlaygroundProps {
	spec: OpenAPIV3.OperationObject;
	path: string;
	method: OpenAPIV3.HttpMethods;
}

export function OpenapiPlaygroundTrigger({
	spec,
	path,
	method,
}: OpenapiPlaygroundProps) {
	const params = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
	const paramsMap = new Map(params.map((p) => [p.name, p]));

	const form = useForm({
		defaultValues: {
			_body: "",
			...Object.keys(paramsMap).reduce(
				(acc, key) => {
					acc[key] = "";
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
			<DialogTrigger asChild>
				<Button className="font-semibold group" size="sm">
					<span>Try it out</span>
					<ChevronRightIcon className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent
				className="h-[80%] overflow-y-hidden md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl p-0"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<DialogClose className="absolute top-4 right-4 z-10" />
				<DialogHeader>
					<DialogTitle className="sr-only">Run in playground</DialogTitle>
					<DialogDescription className="sr-only">
						Try out the API in the playground
					</DialogDescription>
					<div className="flex justify-center border-b w-full py-1 gap-2">
						<div className="border bg-background rounded-md w-auto min-w-[400px] px-2 flex items-center gap-2">
							<Tag variant="small" className="text-xs">
								{method.toUpperCase()}
							</Tag>
							<div className="h-full w-px bg-border" />
							<code
								data-language="plaintext"
								className="text-xs text-slate-600 px-px"
							>
								{path.split("/").map((part, index) => {
									const withoutBrackets = part.replace(/[{}]/g, "");
									const isParam = paramsMap.has(withoutBrackets);
									const key = `${withoutBrackets}-${index}`;
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
								})}
							</code>
						</div>
						<Button className="font-semibold group" size="sm">
							<span>Send</span>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
