// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/components/providers/theme-provider";
// import { Toaster } from "sonner";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

// export const metadata: Metadata = {
//     title: "Customer Management App",
//     description: "Aplikasi manajemen data customer",
//     manifest: "/manifest.json",
//     themeColor: "#2563eb",
//     viewport: "width=device-width, initial-scale=1, maximum-scale=1",
//     appleWebApp: {
//         capable: true,
//         statusBarStyle: "default",
//         title: "Customer Management App",
//     },
//     icons: {
//         icon: "/vercel.svg",
//         apple: "/vercel.svg", // menggunakan vercel.svg juga untuk apple
//     },
// };

// export default function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     return (
//         <html lang="en" suppressHydrationWarning>
//             <body
//                 className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//             >
//                 <ThemeProvider
//                     attribute="class"
//                     defaultTheme="system"
//                     enableSystem
//                     disableTransitionOnChange
//                 >
//                     {children}
//                     <Toaster />
//                 </ThemeProvider>
//             </body>
//         </html>
//     );
// }
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import NetworkStatus from "../components/network-status";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const APP_NAME = "Customer Management App";
const APP_DEFAULT_TITLE = "Customer Management App";
const APP_TITLE_TEMPLATE = "%s - Customer Management";
const APP_DESCRIPTION = "Aplikasi manajemen data customer";

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_DEFAULT_TITLE,
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            {
                url: "/favicon/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
            {
                url: "/favicon/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
        ],
        apple: [{ url: "/favicon/apple-touch-icon.png" }],
        other: [
            {
                rel: "mask-icon",
                url: "/favicon/android-chrome-192x192.png",
            },
        ],
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
};

export const viewport: Viewport = {
    themeColor: "#2563eb",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Meta tags khusus untuk Firefox PWA */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                    <NetworkStatus />
                </ThemeProvider>
                {/* Script untuk mendaftarkan service worker lebih reliabel di Firefox */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        if ('serviceWorker' in navigator) {
                            window.addEventListener('load', function() {
                                navigator.serviceWorker.register('/sw.js').then(
                                    function(registration) {
                                        console.log('Service Worker registered with scope:', registration.scope);
                                    },
                                    function(error) {
                                        console.log('Service Worker registration failed:', error);
                                    }
                                );
                            });
                        }
                        `,
                    }}
                />
            </body>
        </html>
    );
}
