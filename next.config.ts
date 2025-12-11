import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "**.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				port: "",
				pathname: "/v0/b/**",
			},
		],
		domains: ["firebasestorage.googleapis.com"],
	},
};

export default nextConfig;
