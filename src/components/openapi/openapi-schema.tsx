import { Properties, Property } from "@/components/ui/property";
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
				<Properties>
					{parameters.map((param) => {
						const schema = param.schema as OpenAPIV3.SchemaObject;
						return (
							<Property
								key={param.name}
								name={param.name}
								type={schema.type}
								defaultValue={schema.default}
								required={param.required}
								values={schema.enum}
							>
								{param.description}
							</Property>
						);
					})}
				</Properties>
			</div>
			<div>
				<p>Request Body</p>
				<Properties>
					{Object.entries(requestBody?.properties ?? {}).map(([key, value]) => {
						const schema = value as OpenAPIV3.SchemaObject;
						return (
							<Property
								key={key}
								name={key}
								type={schema.type}
								defaultValue={schema.default}
								values={schema.enum}
							>
								{value.description}
							</Property>
						);
					})}
				</Properties>
			</div>
		</div>
	);
}
