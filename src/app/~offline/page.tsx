/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";

export default function OfflinePage() {
    const [loading, setLoading] = useState(false);

    const checkConnection = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            checkConnection();
        }, 5000);
        return () => clearInterval(interval);
    }, [checkConnection]);

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
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    onClick={checkConnection}
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Try Again"}
                </button>
            </div>
        </div>
    );
}
