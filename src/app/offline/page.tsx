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

import Image from "next/image";

export default function OfflinePage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <Image
                        src="/favicon/android-chrome-512x512.png"
                        alt="Offline Icon"
                        width={96}
                        height={96}
                        className="opacity-80"
                        priority
                    />
                </div>
                <h1 className="text-2xl font-bold">You are offline</h1>
                <p className="mt-2">Please check your internet connection</p>
            </div>
        </div>
    );
}
