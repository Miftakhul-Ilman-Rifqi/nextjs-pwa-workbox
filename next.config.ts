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
                urlPattern: /^https:\/\/nextjs-pwa-card\.mirifqi\.my\.id\/api\/.*$/,
                handler: "NetworkFirst",
                options: {
                    cacheName: "vercel-api-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 300,
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                    fetchOptions: {
                        credentials: 'same-origin',
                    },
                    plugins: [{
                        handlerDidError: async () => {
                            return caches.match('/~offline') || Response.error();
                        }
                    }]
                },
            },
            {
                urlPattern: /^https:\/\/nextjs-pwa-card\.mirifqi\.my\.id\/_next\/.*$/,
                handler: "CacheFirst",
                options: {
                    cacheName: "vercel-static-assets",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 86400 * 30, // 30 days
                    },
                },
            },
            {
                urlPattern: /^https:\/\/nextjs-pwa-card\.mirifqi\.my\.id\/.*$/,
                handler: "NetworkFirst",
                options: {
                    cacheName: "vercel-pages",
                    networkTimeoutSeconds: 3, // Fallback to cache if network takes longer than 3 seconds
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 86400 * 7, // 7 days
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                    fetchOptions: {
                        credentials: 'same-origin',
                    },
                    plugins: [{
                        handlerDidError: async () => {
                            return caches.match('/~offline') || Response.error();
                        },
                        cacheWillUpdate: async ({response}) => {
                            // Only cache successful responses
                            return response.status === 200 ? response : null;
                        }
                    }]
                },
            },
        ],
        // Precache offline page
        additionalManifestEntries: [
            { url: '/~offline', revision: '1' }
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
