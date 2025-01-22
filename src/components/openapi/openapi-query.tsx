import { OpenapiPlayground } from "@/components/openapi/playground";
import { getOpenapiSpec } from "@/components/openapi/utils";
import { type OpenAPIV3, openapi } from "@/lib/openapi";

export interface OpenapiQueryProps {
	path: string;
	method: OpenAPIV3.HttpMethods;
}

export function OpenapiQuery({ path, method }: OpenapiQueryProps) {
	const openapiSpec = getOpenapiSpec({ path, method });

	return (
		<div className="sticky-but-not-when-fullscreen-idk">
			<OpenapiPlayground
				spec={openapiSpec}
				path={path}
				method={method}
				server={openapi.servers[0]}
			/>
		</div>
	);
}
