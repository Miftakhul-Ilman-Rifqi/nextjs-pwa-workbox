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
import { useEffect, useState } from "react";

export default function OfflinePage() {
    const [isChecking, setIsChecking] = useState(false);

    const checkNetwork = async () => {
        setIsChecking(true);
        try {
            const response = await fetch("/", {
                method: "HEAD",
                cache: "no-store",
            });
            if (response.ok) {
                window.location.reload();
            }
        } catch {
            setTimeout(() => checkNetwork(), 3000);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            if (event.data?.type === "NETWORK_STATUS" && event.data.isOnline) {
                window.location.reload();
            }
        };

        // Mulai pengecekan jaringan
        checkNetwork();

        // Listen for messages dari service worker
        navigator.serviceWorker?.addEventListener("message", messageHandler);

        return () => {
            navigator.serviceWorker?.removeEventListener(
                "message",
                messageHandler
            );
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
