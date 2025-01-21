import type { IJsonSchema, OpenAPIV3 } from "@/lib/openapi";

type Example = Record<string, unknown> | unknown[] | string | number | null;

export interface Examples {
	schema: Example;
	[key: string]: Example;
}

export const generateRequestsFromSchema = (
	schema: OpenAPIV3.OperationObject,
) => {
	const requestBody = schema.requestBody as OpenAPIV3.RequestBodyObject;
	const content = requestBody?.content?.["application/json"];
	return {
		...Object.entries(content.examples ?? {}).reduce((acc, [key, example]) => {
			acc[key] = (example as OpenAPIV3.ExampleObject).value;
			return acc;
		}, {} as Examples),
		schema: generateFromSchema(content.schema),
	};
};

export const generateFromSchema = (
	schema: (OpenAPIV3.BaseSchemaObject & IJsonSchema) | undefined,
): Record<string, unknown> | unknown[] | string | number | null => {
	if (!schema || !schema.type) return null;

	switch (schema.type) {
		case "object": {
			const result = {} as Record<string, unknown>;
			if (schema.properties) {
				for (const [key, value] of Object.entries(schema.properties)) {
					result[key] = generateFromSchema(value as OpenAPIV3.BaseSchemaObject);
				}
			}
			return result;
		}
		case "array": {
			const items = schema.items as OpenAPIV3.BaseSchemaObject;
			if (!items) return [];
			return [generateFromSchema(items)];
		}
		case "number($float)":
		case "number":
		case "integer":
			return schema.example ?? 0;
		case "map":
			return {};
		case "string":
			return schema.example ?? "string";
		default:
			return null;
	}
};
