/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";

export default function useNetworkStatus() {
    // Gunakan state untuk menyimpan status koneksi
    const [isOnline, setIsOnline] = useState<boolean>(
        typeof navigator !== "undefined" ? navigator.onLine : true
    );

    // Fungsi untuk memeriksa status koneksi secara aktif
    const checkConnection = useCallback(async () => {
        // Hanya jalankan di browser
        if (typeof window === "undefined") return;

        try {
            // Tambahkan timestamp untuk menghindari cache di Firefox
            const timestamp = Date.now();
            const controller = new AbortController();

            // Set timeout 5 detik
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`/status-check?t=${timestamp}`, {
                method: "HEAD",
                cache: "no-store",
                mode: "no-cors",
                credentials: "omit",
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Firefox kadang tidak throw error meskipun offline
            // Kita perlu check jika response type adalah opaque
            const reallyOnline = response.type !== "opaque" || navigator.onLine;

            setIsOnline(reallyOnline);
            return reallyOnline;
        } catch (error) {
            setIsOnline(false);
            return false;
        }
    }, []);

    useEffect(() => {
        // Handler untuk event online/offline browser
        const handleOnline = () => {
            checkConnection().then((result) => {
                // Double check dengan fetch untuk validasi
                setIsOnline(result ?? false);
            });
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        // Handler untuk pesan dari service worker
        const handleSWMessage = (event: MessageEvent) => {
            if (event.data?.type === "NETWORK_STATUS") {
                setIsOnline(event.data.isOnline);
            }
        };

        // Register event listeners
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        navigator.serviceWorker?.addEventListener("message", handleSWMessage);

        // Set interval untuk periodic checking (penting untuk Firefox)
        const intervalId = setInterval(checkConnection, 30000);

        // Initial check
        checkConnection();

        // Cleanup
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            navigator.serviceWorker?.removeEventListener(
                "message",
                handleSWMessage
            );
            clearInterval(intervalId);
        };
    }, [checkConnection]);

    return { isOnline, checkConnection };
}
