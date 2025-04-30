// src/components/providers/sw-registrar.tsx
"use client";
import { useEffect } from "react";

export default function SWRegistrar() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        // Deteksi Firefox via User Agent
        const isFirefox = /Firefox\//.test(navigator.userAgent);

        // Pilih file SW
        const swUrl = isFirefox ? "/sw-firefox.js" : "/sw.js";

        // Opsi pendaftaran:
        // - Firefox: classic script → tidak perlu type='module'
        // - Lainnya: ES module
        const options: RegistrationOptions = {
            scope: "/",
            ...(isFirefox ? {} : { type: "module" as const }),
        };

        navigator.serviceWorker
            .register(swUrl, options)
            .then((reg) => {
                console.log(`Service Worker terdaftar: ${swUrl}`, reg);
            })
            .catch((err) => {
                console.error("Gagal register SW:", err);
            });
    }, []);

    return null;
}
