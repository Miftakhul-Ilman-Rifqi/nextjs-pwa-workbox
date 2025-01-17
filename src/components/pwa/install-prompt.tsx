// // src/components/pwa/install-prompt.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "../ui/button";

// interface BeforeInstallPromptEvent extends Event {
//     readonly platforms: string[];
//     readonly userChoice: Promise<{
//         outcome: "accepted" | "dismissed";
//         platform: string;
//     }>;
//     prompt(): Promise<void>;
// }

// export function InstallPWA() {
//     const [deferredPrompt, setDeferredPrompt] =
//         useState<BeforeInstallPromptEvent | null>(null);
//     const [isPWA, setIsPWA] = useState(false);
//     const [showButton, setShowButton] = useState(false);

//     useEffect(() => {
//         // Cek apakah sudah di-install sebagai PWA
//         const checkPWA = () => {
//             setIsPWA(window.matchMedia("(display-mode: standalone)").matches);
//         };

//         checkPWA();

//         const handler = (e: Event) => {
//             e.preventDefault();
//             setDeferredPrompt(e as BeforeInstallPromptEvent);
//             setShowButton(true);
//         };

//         window.addEventListener("beforeinstallprompt", handler);
//         window
//             .matchMedia("(display-mode: standalone)")
//             .addEventListener("change", checkPWA);

//         return () => {
//             window.removeEventListener("beforeinstallprompt", handler);
//             window
//                 .matchMedia("(display-mode: standalone)")
//                 .removeEventListener("change", checkPWA);
//         };
//     }, []);

//     if (isPWA) {
//         return (
//             <div className="fixed bottom-4 right-4  p-2 rounded-md text-sm">
//                 Aplikasi sudah terinstall
//             </div>
//         );
//     }

//     if (!showButton) return null;

//     return (
//         <Button
//             onClick={async () => {
//                 if (deferredPrompt) {
//                     await deferredPrompt.prompt();
//                     const { outcome } = await deferredPrompt.userChoice;
//                     if (outcome === "accepted") {
//                         setShowButton(false);
//                     }
//                 }
//             }}
//             className="fixed bottom-4 right-4"
//         >
//             Install Aplikasi
//         </Button>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Cek apakah sudah di-install sebagai PWA
        const checkPWA = () => {
            setIsPWA(window.matchMedia("(display-mode: standalone)").matches);
        };

        checkPWA();

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Tunda munculnya prompt selama 2 detik
            setTimeout(() => {
                setShowPrompt(true);
            }, 2000);
        };

        window.addEventListener("beforeinstallprompt", handler);
        window
            .matchMedia("(display-mode: standalone)")
            .addEventListener("change", checkPWA);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window
                .matchMedia("(display-mode: standalone)")
                .removeEventListener("change", checkPWA);
        };
    }, []);

    // Jika sudah terinstall, bisa tampilkan notifikasi sebentar lalu hilang
    if (isPWA) return null;

    // Jika belum muncul prompt, tidak tampilkan apa-apa
    if (!showPrompt) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
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
                        onClick={() => setShowPrompt(false)}
                    >
                        Nanti
                    </Button>
                    <Button
                        size="sm"
                        onClick={async () => {
                            if (deferredPrompt) {
                                await deferredPrompt.prompt();
                                const { outcome } =
                                    await deferredPrompt.userChoice;
                                if (outcome === "accepted") {
                                    setShowPrompt(false);
                                }
                            }
                        }}
                    >
                        Install
                    </Button>
                </div>
            </div>
        </div>
    );
}
