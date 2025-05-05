if ("serviceWorker" in navigator) {
    // Cek apakah browser Firefox
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

    // Daftarkan service worker klasik hanya untuk Firefox
    if (isFirefox) {
        navigator.serviceWorker
            .register("/sw-classic.js", { scope: "/" })
            .then(function () {
                console.log("Service Worker klasik terdaftar untuk Firefox");
            })
            .catch(function (error) {
                console.log(
                    "Pendaftaran Service Worker klasik gagal: " + error
                );
            });
    }
}
