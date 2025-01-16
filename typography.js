module.exports = ({ theme }) => ({
	DEFAULT: {
		css: {
			"--tw-prose-body": theme("colors.zinc.700"),
			"--tw-prose-headings": theme("colors.zinc.900"),
			"--tw-prose-links": theme("colors.emerald.500"),
			"--tw-prose-links-hover": theme("colors.emerald.600"),
			"--tw-prose-links-underline": theme("colors.emerald.500 / 0.3"),
			"--tw-prose-bold": theme("colors.zinc.900"),
			"--tw-prose-list-item": theme("colors.zinc.600"),
			"--tw-prose-list-bullet": theme("colors.zinc.200"),
			"--tw-prose-hr": theme("colors.zinc.900 / 0.05"),

			// Base
			color: "var(--tw-prose-body)",
			fontSize: theme("fontSize.base")[0],
			lineHeight: theme("lineHeight.7"),

			// Layout
			"> *": {
				maxWidth: theme("maxWidth.2xl"),
				marginLeft: "auto",
				marginRight: "auto",
				"@screen lg": {
					maxWidth: theme("maxWidth.3xl"),
					marginLeft: `calc(50% - min(50%, ${theme("maxWidth.lg")}))`,
					marginRight: `calc(50% - min(50%, ${theme("maxWidth.lg")}))`,
				},
			},

			// Text
			p: {
				marginTop: theme("spacing.6"),
				marginBottom: theme("spacing.6"),
			},

			// Lists
			ol: {
				listStyleType: "decimal",
				marginTop: theme("spacing.5"),
				marginBottom: theme("spacing.5"),
			},
			ul: {
				listStyleType: "none",
				marginTop: theme("spacing.5"),
				marginBottom: theme("spacing.5"),
			},
			li: {
				listStyleType: "none",
				marginTop: theme("spacing.2"),
				marginBottom: theme("spacing.2"),
				position: "relative",
				paddingLeft: "32px",
			},
			"ol > li::before": {
				counterIncrement: "listitem",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				content: "counter(listitem)",
				background: "var(--tw-prose-list-bullet)",
				color: "var(--tw-prose-list-item)",
				fontSize: "12px",
				fontWeight: "500",
				padding: "5px 0",
				height: "20px",
				width: "20px",
				borderRadius: "50%",
				position: "absolute",
				left: "0px",
				top: 3,
			},
			"ul > li::before": {
				background: "var(--tw-prose-list-bullet)",
				height: "6px",
				width: "6px",
				borderRadius: "50%",
				position: "absolute",
				left: 8,
				top: 10,
			},
			"> ul > li p": {
				marginTop: theme("spacing.3"),
				marginBottom: theme("spacing.3"),
			},
			"> ul > li > *:first-child": {
				marginTop: theme("spacing.5"),
			},
			"> ul > li > *:last-child": {
				marginBottom: theme("spacing.5"),
			},
			"> ol > li > *:first-child": {
				marginTop: theme("spacing.5"),
			},
			"> ol > li > *:last-child": {
				marginBottom: theme("spacing.5"),
			},
			"ul ul, ul ol, ol ul, ol ol": {
				marginTop: theme("spacing.3"),
				marginBottom: theme("spacing.3"),
			},

			// Horizontal rules
			hr: {
				borderColor: "var(--tw-prose-hr)",
				borderTopWidth: 1,
				marginTop: theme("spacing.16"),
				marginBottom: theme("spacing.16"),
				maxWidth: "none",
				marginLeft: `calc(-1 * ${theme("spacing.4")})`,
				marginRight: `calc(-1 * ${theme("spacing.4")})`,
				"@screen sm": {
					marginLeft: `calc(-1 * ${theme("spacing.6")})`,
					marginRight: `calc(-1 * ${theme("spacing.6")})`,
				},
				"@screen lg": {
					marginLeft: `calc(-1 * ${theme("spacing.8")})`,
					marginRight: `calc(-1 * ${theme("spacing.8")})`,
				},
			},

			// Headings
			h1: {
				color: "var(--tw-prose-headings)",
				fontWeight: "700",
				fontSize: theme("fontSize.3xl")[0],
				...theme("fontSize.3xl")[1],
				marginBottom: theme("spacing.2"),
			},
			h2: {
				color: "var(--tw-prose-headings)",
				fontWeight: "600",
				fontSize: theme("fontSize.xl")[0],
				...theme("fontSize.xl")[1],
				marginTop: theme("spacing.16"),
				marginBottom: theme("spacing.2"),
			},
			h3: {
				color: "var(--tw-prose-headings)",
				fontSize: theme("fontSize.lg")[0],
				...theme("fontSize.lg")[1],
				fontWeight: "600",
				marginTop: theme("spacing.10"),
				marginBottom: theme("spacing.2"),
			},
			h4: {
				color: "var(--tw-prose-headings)",
				fontSize: theme("fontSize.base")[0],
				...theme("fontSize.sm")[1],
				fontWeight: "600",
				marginTop: theme("spacing.6"),
				marginBottom: theme("spacing.1"),
			},

			// Inline elements
			a: {
				color: "var(--tw-prose-links)",
				textDecoration: "underline transparent",
				fontWeight: "500",
				transitionProperty: "color, text-decoration-color",
				transitionDuration: theme("transitionDuration.DEFAULT"),
				transitionTimingFunction: theme("transitionTimingFunction.DEFAULT"),
				"&:hover": {
					color: "var(--tw-prose-links-hover)",
					textDecorationColor: "var(--tw-prose-links-underline)",
				},
			},
			":is(h1, h2, h3) a": {
				fontWeight: "inherit",
			},
			strong: {
				color: "var(--tw-prose-bold)",
				fontWeight: "600",
			},
			":is(a, blockquote, thead th) strong": {
				color: "inherit",
			},

			// Overrides
			":is(h1, h2, h3) + *": {
				marginTop: "0",
			},
			"> :first-child": {
				marginTop: "0 !important",
			},
			"> :last-child": {
				marginBottom: "0 !important",
			},
		},
	},
});
