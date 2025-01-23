import "server-only";

import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";

interface SimpleMdx {
	markdown: string | undefined;
}

const components: MDXRemoteProps["components"] = {
	code: (props) => {
		return <code {...props} data-language="plaintext" />;
	},
};

export async function SimpleMdx({ markdown }: SimpleMdx) {
	if (!markdown) return null;
	return <MDXRemote source={markdown} components={components} />;
}
