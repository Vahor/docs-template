import type { NextConfig } from "next";

import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,

	output: "export",
	cleanDistDir: true,

	images: {
		remotePatterns: [],
	},

	env: {
		BUILD_TIME: new Date().toISOString(),
		NEXT_TELEMETRY_DISABLED: "1",
	},

	eslint: {
		ignoreDuringBuilds: true,
	},

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default withContentlayer(nextConfig);
