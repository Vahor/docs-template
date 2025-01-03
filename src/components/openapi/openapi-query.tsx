import { OpenapiPlayground } from "@/components/openapi/playground";
import { openapi, type OpenAPIV3 } from "@/lib/openapi";

export interface OpenapiQueryProps {
	path: string;
	method: OpenAPIV3.HttpMethods;
}

const getOpenapiSpec = ({
	path,
	method,
}: OpenapiQueryProps): OpenAPIV3.OperationObject => {
	if (!openapi.paths) throw new Error("No OpenAPI paths");
	if (!openapi.servers) throw new Error("No OpenAPI servers");
	const openapiSpec = openapi.paths[path]?.[method];
	if (!openapiSpec) throw new Error(`No OpenAPI spec for ${path} ${method}`);
	return openapiSpec;
};

export function OpenapiQuery({ path, method }: OpenapiQueryProps) {
	const openapiSpec = getOpenapiSpec({ path, method });

	return (
		<div>
			<p>Url : {path}</p>
			<OpenapiPlayground
				spec={openapiSpec}
				path={path}
				method={method}
				server={openapi.servers[0]}
			/>
		</div>
	);
}
