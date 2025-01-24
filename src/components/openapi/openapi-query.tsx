import { generateRequestsFromSchema } from "@/components/openapi/example";
import { SchemaViewer } from "@/components/openapi/schema-viewer";
import { getOpenapiSpec } from "@/components/openapi/utils";
import type { OpenAPIV3 } from "@/lib/openapi";

export interface OpenapiQueryProps {
	path: string;
	method: OpenAPIV3.HttpMethods;
}

export function OpenapiQuery({ path, method }: OpenapiQueryProps) {
	const openapiSpec = getOpenapiSpec({ path, method });

	return (
		<div className="sticky-but-not-when-fullscreen-idk">
			<SchemaViewer examples={bodyExamples} title="Request" />
		</div>
	);
}
