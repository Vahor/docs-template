import type { RequestTemplate } from "@/components/openapi/type";

export const buildCurlCommand = (template: RequestTemplate) => {
	const method = template.method.toUpperCase();
	const url = new URL(template.path, template.baseUrl);
	if (method === "GET") {
		url.search = new URLSearchParams(template.params).toString();
	}
	const data = JSON.stringify(template.data, null, 2);
	const headers = (
		template.headers ? Object.entries(template.headers) : []
	).map(([key, value]) => `--header '${key}: ${value}'`);

	const result = [
		"curl --request ${method}",
		"--url ${url.toString()}",
		...headers,
		data && `--data '${data}'`,
	]
		.filter(Boolean)
		.join("\n");

	return result;
};
