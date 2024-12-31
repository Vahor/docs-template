import type { IJsonSchema, OpenAPIV3 } from "@/lib/openapi";

export const generateFromSchema = (
	schema: OpenAPIV3.BaseSchemaObject & IJsonSchema,
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
		case "integer":
			return schema.example ?? 0;
		case "string":
			return schema.example ?? "string";
		default:
			return null;
	}
};
