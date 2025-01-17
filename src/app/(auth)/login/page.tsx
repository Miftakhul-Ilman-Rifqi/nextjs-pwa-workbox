// import LoginForm from "@/components/auth/login-form";
// import { InstallPWA } from "@/components/pwa/install-prompt";

// export default function LoginPage() {
//     return (
//         <>
//             <main className="min-h-screen grid place-items-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900">
//                 <LoginForm />
//                 <InstallPWA />
//             </main>
//         </>
//     );
// }

"use client";

import LoginForm from "@/components/auth/login-form";
import { InstallPWA } from "@/components/pwa/install-prompt";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main className="min-h-screen grid place-items-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900">
            {mounted && (
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full fixed top-4 right-4"
                    onClick={() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                >
                    {resolvedTheme === "dark" ? (
                        <Sun className="h-5 w-5 text-white" />
                    ) : (
                        <Moon className="h-5 w-5 text-black" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            )}
            <LoginForm />
            <InstallPWA />
        </main>
    );
}
