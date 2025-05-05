import { MainLayout } from "@/components/layouts/main-layout";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
