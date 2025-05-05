"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
    interface Navigator {
        standalone?: boolean;
    }

    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isPWA, setIsPWA] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Registrasi service worker klasik untuk Firefox
        const isFirefox = navigator.userAgent.includes("Firefox");

        if (isFirefox && "serviceWorker" in navigator) {
            navigator.serviceWorker.register("/service-worker-classic.js", {
                scope: "/",
            });
        }
    }, []);

    useEffect(() => {
        const checkPWA = () => {
            setIsPWA(
                window.matchMedia("(display-mode: standalone)").matches ||
                    // Gunakan optional chaining untuk navigator.standalone
                    (window.navigator.standalone ?? false) ||
                    document.referrer.includes("android-app://")
            );
        };

        checkPWA();

        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true); // Tampilkan prompt segera tanpa delay
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );
        window
            .matchMedia("(display-mode: standalone)")
            .addEventListener("change", checkPWA);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
            window
                .matchMedia("(display-mode: standalone)")
                .removeEventListener("change", checkPWA);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === "accepted") {
                console.log("User accepted the install prompt");
            }

            // Reset deferred prompt
            setDeferredPrompt(null);
            setIsVisible(false);
        } catch (error) {
            console.error("Error showing install prompt:", error);
        }
    };

    if (isPWA || !isVisible) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-[90%] max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-4 border border-blue-200 dark:border-blue-800">
                <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white">
                        Install aplikasi ini untuk akses lebih cepat
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVisible(false)}
                    >
                        Nanti
                    </Button>
                    <Button size="sm" onClick={handleInstall}>
                        Pasang
                    </Button>
                </div>
            </div>
        </div>
    );
}
