// src/components/layouts/desktop-navbar.tsx
"use client";
import { Button } from "@/components/ui/button";
import { UserCircle, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DesktopNavbar() {
    const router = useRouter();
    const { setTheme, resolvedTheme } = useTheme();

    const handleLogout = () => {
        // Hapus cookie
        document.cookie =
            "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        // Redirect ke login
        router.push("/login");
    };

    return (
        <div className="hidden md:flex h-16 items-center justify-between px-6 border-b dark:border-gray-800 bg-white dark:bg-gray-950 fixed top-0 right-0 left-0 z-20 ml-[72px] lg:ml-[240px]">
            <div className="flex-1" />
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <UserCircle className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                setTheme(
                                    resolvedTheme === "dark" ? "light" : "dark"
                                )
                            }
                        >
                            {resolvedTheme === "dark" ? (
                                <Sun className="h-4 w-4 mr-2" />
                            ) : (
                                <Moon className="h-4 w-4 mr-2" />
                            )}
                            {resolvedTheme === "dark"
                                ? "Light Mode"
                                : "Dark Mode"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
