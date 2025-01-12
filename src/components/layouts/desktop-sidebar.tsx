"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileInput, CreditCard, Menu, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
    {
        label: "Input Data Customer",
        icon: FileInput,
        href: "/input-data-customer",
    },
    {
        label: "Kartu Customer",
        icon: CreditCard,
        href: "/list-customer",
    },
];

export function DesktopSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "hidden md:flex flex-col fixed left-0 top-0 z-50 h-full bg-white border-r dark:bg-gray-950 dark:border-gray-800 transition-all duration-300",
                isCollapsed ? "w-[72px]" : "w-[240px]"
            )}
        >
            {/* Navbar */}
            <div className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-800">
                {!isCollapsed && (
                    <span className="font-semibold text-lg">Customer App</span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-auto"
                >
                    {isCollapsed ? (
                        <Menu size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}
                </Button>
            </div>

            {/* Sidebar Menu */}
            <nav className="flex-1 py-4">
                <ul className="space-y-1 px-2">
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                                    "hover:bg-gray-100 dark:hover:bg-gray-900",
                                    pathname === item.href &&
                                        "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-500",
                                    isCollapsed && "justify-center"
                                )}
                            >
                                <item.icon size={20} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer area if needed */}
            <div className="p-4 border-t dark:border-gray-800">
                {!isCollapsed && (
                    <div className="text-sm text-gray-500">
                        © 2025 Customer App
                    </div>
                )}
            </div>
        </div>
    );
}
