"use client";

import { useEffect } from "react";

export default function PWAHandler() {
    useEffect(() => {
        // Listen for messages from the service worker
        const handleMessage = (event: MessageEvent) => {
            if (
                event.data.type === "ONLINE_RECONNECTED" ||
                event.data.type === "WINDOW_RELOAD"
            ) {
                // Reload when back online or when service worker is updated
                window.location.reload();
            }
        };

        // Register the event listener
        navigator.serviceWorker.addEventListener("message", handleMessage);

        // Also listen for the online event directly in the browser
        window.addEventListener("online", () => {
            if (window.location.pathname === "/~offline") {
                window.location.href = "/"; // Redirect to home page when back online
            } else {
                window.location.reload();
            }
        });

        // Cleanup
        return () => {
            navigator.serviceWorker.removeEventListener(
                "message",
                handleMessage
            );
            window.removeEventListener("online", () => {});
        };
    }, []);

    return null; // This component doesn't render anything
}
