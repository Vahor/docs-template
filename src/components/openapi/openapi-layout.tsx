import { OpenapiQuery } from "@/components/openapi/openapi-query";
import { OpenapiSchema } from "@/components/openapi/openapi-schema";
import { Col } from "@/components/ui/col";
import { Tag } from "@/components/ui/tag";
import type { OpenAPIV3 } from "@/lib/openapi";

export interface OpenapiLayoutProps {
	path: string;
	method: OpenAPIV3.HttpMethods;
	children?: React.ReactNode;
}

export function OpenapiLayout({ path, method, children }: OpenapiLayoutProps) {
	return (
		<div>
			<div className="space-x-2">
				<Tag>{method}</Tag>
				<code data-language="plaintext">{path}</code>
			</div>
			{children}
			<Col>
				<OpenapiSchema path={path} method={method} />
				<OpenapiQuery path={path} method={method} />
			</Col>
		</div>
	);
}
