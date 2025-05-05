import { Workbox } from "workbox-window";

export function registerServiceWorker() {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
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

        wb.register();
    }
}

export function unregisterServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.unregister();
        });
    }
}
