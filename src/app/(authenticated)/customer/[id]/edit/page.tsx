"use client";

import { CustomerForm } from "@/components/authenticated/customer-form";
import { useCustomerDetail } from "@/hooks/use-customer";
import { use } from "react";

export default function EditCustomerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const { customer, isLoading } = useCustomerDetail(resolvedParams.id);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!customer) {
        return <div>Customer tidak ditemukan</div>;
    }

    return (
        <main className="min-h-screen grid place-items-center p-4">
            <CustomerForm
                mode="edit"
                initialData={customer}
                customerId={resolvedParams.id}
            />
        </main>
    );
}
