import type { OpenAPIV3 } from "@/lib/openapi";

export const buildUrl = (
	hostname: string,
	path: string,
	params: OpenAPIV3.ParameterObject[],
	values: Record<string, unknown>,
) => {
	let cleanPath = path;
	const queryParams = new URLSearchParams();

	for (const param of params) {
		const val = values[param.name] as string | string[];
		if (param.in === "query") {
			if (Array.isArray(val)) {
				for (const v of val) {
					queryParams.append(param.name, v);
				}
			} else {
				queryParams.set(param.name, val);
			}
		} else if (param.in === "path") {
			if (Array.isArray(val)) {
				const valStr = val.join(",");
				cleanPath = cleanPath.replace(`{${param.name}}`, valStr);
			} else {
				cleanPath = cleanPath.replace(`{${param.name}}`, val);
			}
		}
	}

	const targetUrl = new URL(`${hostname}${cleanPath}`);
	targetUrl.search = queryParams.toString();
	return targetUrl;
};
