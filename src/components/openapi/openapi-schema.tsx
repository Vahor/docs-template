import { type IJsonSchema, type OpenAPIV3, openapi } from "@/lib/openapi";

export interface OpenapiQueryProps {
	path: string;
	method: OpenAPIV3.HttpMethods;
}

const getOpenapiSpec = ({ path, method }: OpenapiQueryProps) => {
	if (!openapi.paths) throw new Error("No OpenAPI paths");
	if (!openapi.servers) throw new Error("No OpenAPI servers");
	const openapiSpec = openapi.paths[path]?.[method];
	if (!openapiSpec) throw new Error(`No OpenAPI spec for ${path} ${method}`);
	return openapiSpec;
};

export function OpenapiSchema({ path, method }: OpenapiQueryProps) {
	const openapiSpec = getOpenapiSpec({ path, method });
	const requestBody = (openapiSpec.requestBody as OpenAPIV3.RequestBodyObject)
		?.content?.["application/json"].schema as IJsonSchema;
	const parameters = (openapiSpec.parameters ??
		[]) as OpenAPIV3.ParameterObject[];

	return (
		<div>
			<p>Url : {path}</p>
			<p>Method : {method}</p>
			<p>Description : {openapiSpec.description}</p>
			<br />
			<div>
				<p>Parameters</p>
				<ul className="list-disc space-y-4 ml-8">
					{parameters.map((param) => {
						const schema = param.schema as OpenAPIV3.SchemaObject;
						return (
							<li key={param.name}>
								<p>field: {param.name}</p>
								<p>type: {schema.type}</p>
								<p>default: {schema.default}</p>
								<p>desc: {param.description}</p>
								<p>values: {schema.enum?.join(", ")}</p>
							</li>
						);
					})}
				</ul>
			</div>
			<br />
			<div>
				<p>Request Body</p>
				<ul className="list-disc space-y-4 ml-8">
					{Object.entries(requestBody?.properties ?? {}).map(([key, value]) => {
						const schema = value as OpenAPIV3.SchemaObject;
						return (
							<li key={key} className="pl-2">
								<p>field: {key}</p>
								<p>type: {schema.type}</p>
								<p>default: {schema.default}</p>
								<p>desc: {value.description}</p>
								<p>values: {schema.enum?.join(", ")}</p>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
