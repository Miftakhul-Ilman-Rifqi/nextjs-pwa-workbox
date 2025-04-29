"use client";

import { useEffect, useState } from "react";
import useNetworkStatus from "@/hooks/use-network-status";

export default function NetworkStatus() {
    const { isOnline } = useNetworkStatus();
    const [showOfflineMessage, setShowOfflineMessage] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            // Tampilkan pesan offline setelah delay singkat
            // untuk menghindari flash pada koneksi intermittent
            const timer = setTimeout(() => {
                setShowOfflineMessage(true);
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            setShowOfflineMessage(false);
        }
    }, [isOnline]);

    if (isOnline || !showOfflineMessage) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-50 border border-yellow-200 rounded-md p-3 shadow-md flex items-center space-x-2 z-50">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-600"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                />
            </svg>
            <span className="text-sm text-yellow-700">
                Anda sedang offline. Beberapa fitur mungkin tidak berfungsi.
            </span>
        </div>
    );
}
