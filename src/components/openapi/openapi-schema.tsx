import { getOpenapiSpec } from "@/components/openapi/utils";
import { SimpleMdx } from "@/components/simple-mdx";
import { Properties, Property } from "@/components/ui/property";
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

	return (
		<div>
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
								<SimpleMdx markdown={param.description} />
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
								<SimpleMdx markdown={value.description} />
							</Property>
						);
					})}
				</Properties>
			</div>
		</div>
	);
}
