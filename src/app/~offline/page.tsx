/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
// export default function OfflinePage() {
//     return (
//         <div className="flex min-h-screen flex-col items-center justify-center p-4">
//             <h1 className="text-2xl font-bold mb-4">Anda Sedang Offline</h1>
//             <p className="text-center text-gray-600">
//                 Silakan periksa koneksi internet Anda dan coba lagi.
//             </p>
//         </div>
//     );
// }

// import Image from "next/image";

// export default function OfflinePage() {
//     return (
//         <div className="flex h-screen w-full items-center justify-center">
//             <div className="text-center space-y-4">
//                 <div className="flex justify-center">
//                     <Image
//                         src="/favicon/android-chrome-512x512.png"
//                         alt="Offline Icon"
//                         width={96}
//                         height={96}
//                         className="opacity-80"
//                         priority
//                     />
//                 </div>
//                 <h1 className="text-2xl font-bold">You are offline</h1>
//                 <p className="mt-2">Please check your internet connection</p>
//             </div>
//         </div>
//     );
// }

"use client";
import { useCallback, useEffect, useState } from "react";

export default function OfflinePage() {
    const [isChecking, setIsChecking] = useState(false);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const checkNetwork = useCallback(async () => {
        setIsChecking(true);
        try {
            // Tambahkan timestamp untuk menghindari cache Firefox
            const timestamp = Date.now();
            const response = await fetch(`/?t=${timestamp}`, {
                method: "HEAD",
                cache: "no-store",
                mode: "no-cors", // Penting untuk Firefox
                credentials: "omit", // Hindari cookie untuk kurangi overhead
            });

            // Firefox kadang tidak throw error meskipun offline
            // Kita hanya reload jika response.type bukan opaque (untuk Firefox)
            if (response.type !== "opaque" || navigator.onLine) {
                window.location.reload();
            } else {
                throw new Error("Still offline");
            }
        } catch (err) {
            // Increment reconnect attempts
            setReconnectAttempts((prev) => prev + 1);

            // Exponential backoff untuk mengurangi beban
            const delay = Math.min(
                3000 * Math.pow(1.5, Math.min(reconnectAttempts, 5)),
                30000
            );
            setTimeout(() => checkNetwork(), delay);
        } finally {
            setIsChecking(false);
        }
    }, [reconnectAttempts]);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            if (event.data?.type === "NETWORK_STATUS" && event.data.isOnline) {
                window.location.reload();
            }
        };

        // Firefox support: listen to online/offline events
        const handleOnline = () => {
            window.location.reload();
        };

        // Mulai pengecekan jaringan
        checkNetwork();

        // Listen for messages dari service worker
        navigator.serviceWorker?.addEventListener("message", messageHandler);

        // Listen untuk event online browser (Firefox support)
        window.addEventListener("online", handleOnline);

        return () => {
            navigator.serviceWorker?.removeEventListener(
                "message",
                messageHandler
            );
            window.removeEventListener("online", handleOnline);
        };
    }, [checkNetwork]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <img
                        src="/favicon/android-chrome-512x512.png"
                        alt="Offline Icon"
                        width={96}
                        height={96}
                        className="opacity-80"
                        loading="eager"
                    />
                </div>
                <h1 className="text-2xl font-bold">You are offline</h1>
                <p className="mt-2">Please check your internet connection</p>
                <button
                    onClick={checkNetwork}
                    disabled={isChecking}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isChecking ? "Checking..." : "Try Again"}
                </button>
            </div>
        </div>
    );
}
