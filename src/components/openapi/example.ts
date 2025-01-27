import type { IJsonSchema, OpenAPIV3 } from "@/lib/openapi";

type Example =
	| Record<string, unknown>
	| unknown[]
	| string
	| number
	| null
	| undefined;

export interface Examples {
	schema: Example;
	[key: string]: Example;
}

export const generateRequestsFromSchema = (
	content: OpenAPIV3.MediaTypeObject | undefined,
): Examples | null => {
	if (!content) return null;
	return {
		...Object.entries(content.examples ?? {}).reduce((acc, [key, example]) => {
			acc[key] = (example as OpenAPIV3.ExampleObject).value;
			return acc;
		}, {} as Examples),
		schema: content.examples ? undefined : generateFromSchema(content.schema),
	};
};

export const generateFromSchema = (
	schema: (OpenAPIV3.BaseSchemaObject & IJsonSchema) | undefined | null,
): Record<string, unknown> | unknown[] | string | number | null => {
	if (!schema) return null;

	if (schema.oneOf) {
		return generateFromSchema(schema.oneOf[0] as OpenAPIV3.BaseSchemaObject);
	}

	if (!schema.type) return null;

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
			const value = generateFromSchema(items);
			if (Array.isArray(value)) {
				return value;
			}
			return [value];
		}
		case "number($float)":
		case "number":
		case "integer": {
			console.log(schema);
			if (schema.example) {
				return schema.example;
			}
			if (schema.maximum !== undefined && schema.minimum !== undefined) {
				return (schema.maximum - schema.minimum) / 2;
			}

			if (schema.type === "number($float)") {
				return 0.5;
			}

			return 0;
		}
		case "map":
			return {};
		case "string":
			return schema.example ?? "string";
		default:
			return schema.example ?? null;
	}
};
