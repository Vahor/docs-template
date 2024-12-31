import type { Thing, WithContext } from "schema-dts";

export const JsonLd = ({ jsonLd }: { jsonLd: WithContext<Thing> }) => {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: This is a JSON object
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
};
