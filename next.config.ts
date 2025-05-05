import { join } from "path";
import { InjectManifest } from "workbox-webpack-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            config.plugins.push(
                new InjectManifest({
                    swSrc: join(__dirname, "src", "sw.ts"),
                    swDest: join(__dirname, "public", "sw.js"),
                    exclude: [
                        /_next\/static\/chunks\/pages\/api/,
                        /middleware-manifest\.json$/,
                        /_middleware\.js$/,
                        /_error\.js$/,
                        /_next\/app-build-manifest\.json$/,
                        /_next\/build-manifest\.json$/,
                    ],
                    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
                })
            );
        }
        return config;
    },
};

export default nextConfig;
