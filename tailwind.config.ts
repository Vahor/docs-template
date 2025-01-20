import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./content/**/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		{
			pattern: /^grid-cols-(1|2|3|4|5)/,
			variants: ["md", "lg"],
		},
	],
	theme: {
		listStyleType: {
			none: "none",
			disc: "disc",
			decimal: "decimal",
			"lower-alpha": "lower-alpha",
		},
		typography: require("./typography.js"),
		fontSize: {
			"2xs": [
				"0.75rem",
				{
					lineHeight: "1.25rem",
				},
			],
			xs: [
				"0.8125rem",
				{
					lineHeight: "1.5rem",
				},
			],
			sm: [
				"0.875rem",
				{
					lineHeight: "1.5rem",
				},
			],
			base: [
				"1rem",
				{
					lineHeight: "1.75rem",
				},
			],
			lg: [
				"1.125rem",
				{
					lineHeight: "1.75rem",
				},
			],
			xl: [
				"1.25rem",
				{
					lineHeight: "1.75rem",
				},
			],
			"2xl": [
				"1.5rem",
				{
					lineHeight: "2rem",
				},
			],
			"3xl": [
				"1.875rem",
				{
					lineHeight: "2.25rem",
				},
			],
			"4xl": [
				"2.25rem",
				{
					lineHeight: "2.5rem",
				},
			],
			"5xl": [
				"3rem",
				{
					lineHeight: "1",
				},
			],
			"6xl": [
				"3.75rem",
				{
					lineHeight: "1",
				},
			],
			"7xl": [
				"4.5rem",
				{
					lineHeight: "1",
				},
			],
			"8xl": [
				"6rem",
				{
					lineHeight: "1",
				},
			],
			"9xl": [
				"8rem",
				{
					lineHeight: "1",
				},
			],
		},
		extend: {
			containers: {
				"2xs": "28rem",
				xs: "32rem",
				sm: "36rem",
				md: "42rem",
				lg: "48rem",
				xl: "56rem",
				"2xl": "64rem",
				"3xl": "72rem",
				"4xl": "80rem",
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/container-queries"),
	],
} satisfies Config;
