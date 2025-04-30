// src/components/providers/sw-registrar.tsx
"use client";
import { useEffect } from "react";

function isFirefox() {
    return /Firefox\//.test(navigator.userAgent);
}

export default function SWRegistrar() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        const swUrl = isFirefox() ? "/sw-firefox.js" : "/sw.js";
        const opts = !isFirefox() ? { type: "module" as const } : undefined;

        navigator.serviceWorker
            .register(swUrl, opts)
            .then((reg) => {
                console.log(`SW terdaftar di ${swUrl}`, reg);
                // jika perlu: kirim pesan untuk skipWaiting
                // reg.waiting?.postMessage('skipWaiting');
            })
            .catch((err) => console.error("Gagal register SW:", err));
    }, []);

    return null;
}
