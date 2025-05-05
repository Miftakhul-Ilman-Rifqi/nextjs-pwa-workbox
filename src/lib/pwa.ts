import { Workbox } from "workbox-window";

export function registerServiceWorker() {
    if (
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        process.env.NODE_ENV === "production"
    ) {
        const wb = new Workbox("/sw.js");

        wb.addEventListener("installed", (event) => {
            if (event.isUpdate) {
                if (
                    confirm(
                        "Aplikasi memiliki update baru. Muat ulang untuk mendapatkan versi terbaru?"
                    )
                ) {
                    window.location.reload();
                }
            }
        });

        wb.register()
            .then(() => console.log("Service Worker registered"))
            .catch((err) =>
                console.error("Service Worker registration failed: ", err)
            );
    }
}
