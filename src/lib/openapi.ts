import { OPENAPI_JSON_URL } from "@/lib/constants";
import OpenAPIParser from "@readme/openapi-parser";
import type { OpenAPIV3, IJsonSchema } from "openapi-types";

const parser = new OpenAPIParser();
const openapi = (await parser.dereference(OPENAPI_JSON_URL, {
	validate: {
		schema: true,
		colorizeErrors: false,
	},
})) as Required<OpenAPIV3.Document>;
export { openapi, type OpenAPIV3, type IJsonSchema };
