import "server-only";
import type { Article, WithContext } from "schema-dts";

export const articlePage = (props: Partial<Article>): WithContext<Article> => ({
	"@context": "https://schema.org",
	"@type": "BlogPosting",
	maintainer: {
		"@id": "https://vahor.fr#organization",
	},
	copyrightHolder: {
		"@id": "https://vahor.fr#organization",
	},
	provider: {
		"@id": "https://vahor.fr#organization",
	},
	...props,
});
