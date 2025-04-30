"use client";
import { useEffect } from "react";

function isFirefox() {
    return /Firefox\//.test(navigator.userAgent);
}

declare global {
    interface Window {
        serwist: {
            register: () => void;
        };
    }
}

export default function SWRegistrar() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        // Jika Firefox, daftarkan sw-firefox.js; selain itu pakai Serwist API
        if (isFirefox()) {
            navigator.serviceWorker
                .register("/sw-firefox.js", { scope: "/" })
                .then((reg) => console.log("SW Firefox terdaftar:", reg))
                .catch((err) =>
                    console.error("Gagal register sw-firefox.js:", err)
                );
        } else if (window.serwist) {
            window.serwist.register(); // register sw.js (ESM) via Serwist :contentReference[oaicite:4]{index=4}
        } else {
            navigator.serviceWorker
                .register("/sw.js", { type: "module", scope: "/" })
                .then((reg) => console.log("SW fallback terdaftar:", reg))
                .catch((err) => console.error("Gagal register sw.js:", err));
        }
    }, []);

    return null;
}
