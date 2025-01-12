"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
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
        </div>
    );
}
