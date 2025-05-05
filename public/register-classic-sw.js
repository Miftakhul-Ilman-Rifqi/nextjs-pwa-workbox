// Deteksi browser Firefox
function isFirefox() {
    return (
        navigator.userAgent.includes("Firefox") ||
        (navigator.userAgent.includes("Mozilla") &&
            !navigator.userAgent.includes("Chrome"))
    );
}

// Fungsi untuk mendaftarkan service worker klasik khusus Firefox
function registerClassicServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/classic-sw.js")
            .then(function (reg) {
                console.log(
                    "[Classic SW] Berhasil terdaftar dengan scope: " + reg.scope
                );
            })
            .catch(function (error) {
                console.error("[Classic SW] Pendaftaran gagal: ", error);
            });
    }
}

// Hanya register service worker klasik jika browser adalah Firefox
if (isFirefox()) {
    registerClassicServiceWorker();
}
