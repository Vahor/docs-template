// TODO: env var for host
const HOSTNAME =
	process.env.NODE_ENV === "production" ? "vahor.github.io" : "localhost:3000";
const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";
export const BASE_URL = `${PROTOCOL}://${HOSTNAME}`;
export const OPENAPI_JSON_URL = "https://api.textreveal.com/schema/v2";

export const SOME_MARKDOWN =
	"Example of **stuff** that could be `imported` from the api schema";
