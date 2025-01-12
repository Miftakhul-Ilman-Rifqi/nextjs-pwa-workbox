"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileInput, CreditCard } from "lucide-react";

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
    // {
    //     label: "Saya",
    //     icon: UserCircle,
    //     href: "/profile",
    // },
];

export function MobileFooter() {
    const pathname = usePathname();

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-20 h-16 bg-white border-t md:hidden dark:bg-gray-950 dark:border-gray-800">
            <nav className="h-full">
                <ul className="h-full flex items-center justify-around">
                    {menuItems.map((item) => (
                        <li key={item.href} className="w-full">
                            <Link
                                href={item.href}
                                className={cn(
                                    "h-full flex flex-col items-center justify-center gap-1 px-4",
                                    "text-sm text-gray-500 dark:text-gray-400",
                                    "hover:text-blue-600 dark:hover:text-blue-500",
                                    pathname === item.href &&
                                        "text-blue-600 dark:text-blue-500"
                                )}
                            >
                                <item.icon size={20} />
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </footer>
    );
}
