const HOSTNAME =
	process.env.NODE_ENV === "production" ? "localhost:8080" : "localhost:3000";
const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";
export const BASE_URL = `${PROTOCOL}://${HOSTNAME}`;
