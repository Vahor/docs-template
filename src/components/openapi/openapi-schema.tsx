import { Properties, Property } from "@/components/openapi/openapi-property";
import { getOpenapiSpec } from "@/components/openapi/utils";
import type { IJsonSchema, OpenAPIV3 } from "@/lib/openapi";

export interface OpenapiQueryProps {
	path: string;
	method: OpenAPIV3.HttpMethods;
}

export function OpenapiSchema({ path, method }: OpenapiQueryProps) {
	const openapiSpec = getOpenapiSpec({ path, method });
	const requestBody = (openapiSpec.requestBody as OpenAPIV3.RequestBodyObject)
		?.content?.["application/json"].schema as IJsonSchema;
	const parameters = (openapiSpec.parameters ??
		[]) as OpenAPIV3.ParameterObject[];

	const requiredParameters = parameters.filter((p) => p.required);

	return (
		<div>
			<div>
				<p>Parameters</p>
				<Properties>
					{parameters.map((param) => {
						const schema = param.schema as OpenAPIV3.SchemaObject;
						const isRequired = requiredParameters.includes(param);
						return (
							// @ts-expect-error we are using a custom type
							<Property
								key={param.name}
								name={param.name}
								{...schema}
								required={isRequired}
							/>
						);
					})}
				</Properties>
			</div>
			<div>
				<h3>Request Body</h3>
				<Properties>
					{Object.entries(requestBody?.properties ?? {}).map(([key, value]) => {
						const schema = value as OpenAPIV3.SchemaObject;
						const isRequired = requestBody.required?.includes(key);
						return (
							// @ts-expect-error we are using a custom type
							<Property
								key={key}
								name={key}
								{...schema}
								required={isRequired}
							/>
						);
					})}
				</Properties>
			</div>
		</div>
	);
}
