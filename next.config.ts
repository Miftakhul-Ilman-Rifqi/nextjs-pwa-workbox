// next.config.ts
import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

const config = {
    // config options here
} satisfies NextConfig;

export default withPWA(config);
