import { generateRequestsFromSchema } from "@/components/openapi/example";
import { OpenapiPlaygroundTrigger } from "@/components/openapi/openapi-playground";
import { Properties, Property } from "@/components/openapi/openapi-property";
import { SchemaViewer } from "@/components/openapi/schema-viewer";
import { getOpenapiSpec, getServerUrl } from "@/components/openapi/utils";
import { Col } from "@/components/ui/col";
import type { OpenAPIV3 } from "@/lib/openapi";

export interface OpenapiLayoutProps {
	path: string;
	method: OpenAPIV3.HttpMethods;
	children?: React.ReactNode;
}

export function OpenapiLayout({ path, method, children }: OpenapiLayoutProps) {
	const openapiSpec = getOpenapiSpec({ path, method });

	return (
		<div>
			<div className="flex items-baseline gap-2">
				<OpenapiPlaygroundTrigger
					spec={openapiSpec}
					method={method}
					path={path}
					server={getServerUrl()}
				/>
			</div>
			<div>{children}</div>
			<div className="mt-14">
				<h2 className="sr-only" id="request">
					Request
				</h2>
				<RequestBody spec={openapiSpec} />
				<hr />
				<h2 className="sr-only" id="response">
					Response
				</h2>
				<ResponseBody spec={openapiSpec} />
			</div>
		</div>
	);
}

const RequestBody = ({ spec }: { spec: OpenAPIV3.OperationObject }) => {
	const parameters = (spec.parameters ?? []) as OpenAPIV3.ParameterObject[];
	const content = (spec.requestBody as OpenAPIV3.RequestBodyObject)?.content?.[
		"application/json"
	];
	const requestBody = content?.schema as OpenAPIV3.SchemaObject;
	const bodyExamples = generateRequestsFromSchema(content);
	const properties = Object.entries(requestBody?.properties ?? {});

	return (
		<Col>
			<div className="space-y-8">
				{parameters.length > 0 && (
					<div>
						<h3 className="mb-4">Parameters</h3>
						<Properties>
							{parameters.map((param) => (
								/* @ts-expect-error we are using a custom type */
								<Property
									id={`request-query-${param.name}`}
									key={param.name}
									description={param.description}
									required={param.required}
									{...param.schema}
									name={param.name}
								/>
							))}
						</Properties>
					</div>
				)}
				{properties.length > 0 && (
					<div>
						<h3 className="mb-4">Request Body</h3>
						<Properties>
							{/* @ts-expect-error we are using a custom type */}
							<Property {...requestBody} name={null} id="request-body" />
						</Properties>
					</div>
				)}
			</div>

			<div className="sticky-but-not-when-fullscreen-idk">
				<SchemaViewer examples={bodyExamples} title="Request" />
			</div>
		</Col>
	);
};

const ResponseBody = ({ spec }: { spec: OpenAPIV3.OperationObject }) => {
	if (!spec.responses) return null;
	const responses = spec.responses as Record<string, OpenAPIV3.ResponseObject>;

	return (
		<div className="space-y-8">
			{Object.entries(responses).map(([code, response]) => {
				const content = response.content?.["application/json"];
				const codeNumber = Number.parseInt(code);
				if (Number.isNaN(codeNumber)) return null;
				if (codeNumber > 299) return null; // Already in the error doc page
				const schema = content?.schema as OpenAPIV3.SchemaObject;
				const example = generateRequestsFromSchema(content);

				return (
					<Col key={code}>
						<div>
							<h3>Response - {code}</h3>
							<p className={schema ? undefined : "mb-0"}>
								{response.description}
							</p>
							{schema && (
								<Properties>
									{/* @ts-expect-error we are using a custom type */}
									<Property {...schema} id="response-body" />
								</Properties>
							)}
						</div>

						{example != null && (
							<div className="sticky-but-not-when-fullscreen-idk">
								<SchemaViewer examples={example} title="Response" />
							</div>
						)}
					</Col>
				);
			})}
		</div>
	);
};
