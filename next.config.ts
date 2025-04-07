import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: false,
    register: true,
    fallbacks: {
        document: "/~offline",
    },
    extendDefaultRuntimeCaching: true,
    workboxOptions: {
        runtimeCaching: [
            {
                urlPattern:
                    /^(http:\/\/localhost:3000|https:\/\/nextjs-pwa-card\.mirifqi\.my\.id)\/api\/.*$/,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "api-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 300,
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
            {
                urlPattern:
                    /^(http:\/\/localhost:3000|https:\/\/nextjs-pwa-card\.mirifqi\.my\.id)\/_next\/.*$/,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "next-static",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 86400,
                    },
                },
            },
            {
                urlPattern:
                    /^(http:\/\/localhost:3000|https:\/\/nextjs-pwa-card\.mirifqi\.my\.id)\/.*$/,
                handler: "NetworkFirst",
                options: {
                    cacheName: "pages-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 604800,
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                    plugins: [{
                        handlerDidError: async () => {
                            return caches.match('/~offline');
                        }
                    }],
                    precacheFallback: {
                        fallbackURL: '/~offline'
                    }
                },
            },
        ],
    },
});

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["nextjs-pwa-card.mirifqi.my.id"],
    },
};

export default withPWA(nextConfig);
