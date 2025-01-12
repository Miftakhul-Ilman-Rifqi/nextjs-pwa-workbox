// src/components/layouts/main-layout.tsx
"use client";

import { MobileHeader } from "./mobile-header";
import { MobileFooter } from "./mobile-footer";
import { DesktopSidebar } from "./desktop-sidebar";
import { DesktopNavbar } from "./desktop-navbar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/login");

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen">
            <DesktopSidebar />
            {/* Main content area */}
            <div className={cn("min-h-screen transition-all duration-300")}>
                {/* Navbar for desktop */}
                <DesktopNavbar />
                {/* Header for mobile */}
                <MobileHeader />

                {/* Main content */}
                <main
                    className={cn(
                        "container mx-auto px-4",
                        "pt-20 pb-7", // Mobile padding (header + content)
                        "md:pt-20 md:pb-5" // Desktop padding (navbar + content)
                    )}
                >
                    <div className="items-center justify-center min-h-[calc(100vh-8rem)]">
                        {children}
                    </div>
                </main>
            </div>
            <MobileFooter />
        </div>
    );
}
