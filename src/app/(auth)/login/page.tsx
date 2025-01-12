import LoginForm from "@/components/auth/login-form";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export default function LoginPage() {
    return (
        <>
            <main className="min-h-screen grid place-items-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900">
                <LoginForm />
            </main>
            <InstallPrompt />
        </>
    );
}
