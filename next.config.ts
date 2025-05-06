import { NextConfig } from "next";
import { DefinePlugin } from "webpack";
import WorkboxWebpackPlugin from "workbox-webpack-plugin";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            // Workbox configuration
            config.plugins.push(
                new WorkboxWebpackPlugin.InjectManifest({
                    swSrc: "./src/service-worker.ts",
                    swDest: "service-worker.js",
                    exclude: [
                        /_middleware.js$/,
                        /_middleware.js.map$/,
                        /middleware-manifest.json$/,
                    ],
                    additionalManifestEntries: [
                        {
                            url: "/offline",
                            revision: Math.random().toString(36),
                        },
                    ],
                    mode: "production",
                    compileSrc: true,
                }),
                new DefinePlugin({
                    __BUILD_ID: JSON.stringify(
                        process.env.BUILD_ID || Date.now().toString()
                    ),
                })
            );
        }
        return config;
    },
};

export default nextConfig;
