// biome-ignore lint/suspicious/noExplicitAny: can be any type
export const getNodeText = (node: any): string => {
	// ignore twoslash nodes
	if (node.props?.className?.includes("twoslash-popup-container")) {
		return "";
	}

	if (["string", "number"].includes(typeof node)) {
		// Convert number into string
		return node.toString();
	}

	if (Array.isArray(node)) {
		return node.map(getNodeText).join("");
	}

	if (typeof node === "object" && node?.props?.children) {
		return getNodeText(node.props.children);
	}

	return "";
};
