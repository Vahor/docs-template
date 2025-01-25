import { type OpenAPIV3, openapi } from "@/lib/openapi";

export const getOpenapiSpec = ({
	path,
	method,
}: {
	path: string;
	method: OpenAPIV3.HttpMethods;
}) => {
	if (!openapi.paths) throw new Error("No OpenAPI paths");
	if (!openapi.servers) throw new Error("No OpenAPI servers");
	const openapiSpec = openapi.paths[path]?.[method];
	if (!openapiSpec) throw new Error(`No OpenAPI spec for ${path} ${method}`);
	return openapiSpec;
};

export const getServerUrl = () => {
	if (!openapi.servers) throw new Error("No OpenAPI servers");
	return openapi.servers[0].url;
};
