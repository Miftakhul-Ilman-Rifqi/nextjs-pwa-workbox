import type { NextConfig } from "next";
import { join } from "path";
import { InjectManifest } from "workbox-webpack-plugin";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            config.plugins.push(
                new InjectManifest({
                    swSrc: join(__dirname, "src", "sw.ts"),
                    swDest: "sw.js",
                    exclude: [
                        /_next\/static\/chunks\/pages\/api/,
                        /middleware-manifest\.json$/,
                        /_middleware\.js$/,
                        /_error\.js$/,
                    ],
                    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
                })
            );
        }
        return config;
    },
};

export default nextConfig;
