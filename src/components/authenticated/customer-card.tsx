import Image from "next/image";
import { CITIZENSHIP } from "@prisma/client";
import { Card } from "@/components/ui/card";
import type { CustomerDisplay } from "@/types/customer-types";

interface CustomerCardProps {
    customer: CustomerDisplay;
}

export function CustomerCard({ customer }: CustomerCardProps) {
    return (
        <Card className="p-4 hover:shadow-md transition-shadow bg-blue-600 dark:bg-blue-700 text-white">
            <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-blue-100 dark:bg-blue-800 flex-shrink-0">
                    {customer.images ? (
                        <Image
                            src={customer.images}
                            alt={customer.fullname}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-lg font-bold">
                            {customer.fullname.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex justify-between h-16">
                    {" "}
                    {/* Tambah h-16 untuk match dengan image height */}
                    {/* Nama dan Email */}
                    <div className="flex flex-col justify-between">
                        <h3 className="text-lg font-bold text-white">
                            {customer.fullname}
                        </h3>
                        <p className="text-base font-medium text-blue-100 dark:text-blue-200">
                            {customer.email}
                        </p>
                    </div>
                    {/* Citizenship dan DOB */}
                    <div className="flex flex-col justify-between items-end">
                        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-500 dark:bg-blue-600 text-white">
                            {customer.citizenship === CITIZENSHIP.WNI
                                ? "WNI"
                                : "WNA"}
                        </span>
                        <span className="text-sm font-medium text-blue-200 dark:text-blue-300">
                            {customer.created_at}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
