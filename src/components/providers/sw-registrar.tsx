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
                .register("/sw-firefox.js")
                .then((reg) => {
                    console.log("Firefox SW terdaftar:", reg);
                })
                .catch((err) =>
                    console.error("Gagal register sw-firefox.js:", err)
                );
        } else if (window.serwist) {
            // window.serwist.register() akan memanggil public/sw.js (hasil Serwist)
            window.serwist.register();
        } else {
            // fallback murni jika window.serwist belum tersedia
            navigator.serviceWorker
                .register("/sw.js", { type: "module" })
                .then((reg) => console.log("SW fallback terdaftar:", reg))
                .catch((err) => console.error("Gagal register sw.js:", err));
        }
    }, []);

    return null;
}
