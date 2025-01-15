const HOSTNAME =
	process.env.NODE_ENV === "production" ? "localhost:8080" : "localhost:3000";
const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";
export const BASE_URL = `${PROTOCOL}://${HOSTNAME}`;
export const OPENAPI_JSON_URL =
	"https://petstore3.swagger.io/api/v3/openapi.json";

export const SOME_MARKDOWN =
	"Example of **stuff** that could be `imported` from the api schema";
