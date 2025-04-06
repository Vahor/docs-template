import "server-only";
import type { Article, WithContext } from "schema-dts";

export const articlePage = (props: Partial<Article>): WithContext<Article> => ({
	"@context": "https://schema.org",
	"@type": "BlogPosting",
	mainEntityOfPage: "True",
	inLanguage: "en-US",
	isFamilyFriendly: true,
	...props,
});
