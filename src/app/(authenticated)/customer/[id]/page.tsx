"use client";

import { useCustomerDetail } from "@/hooks/use-customer";
import { ArrowLeft, MoreVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { use } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

// export default function CustomerDetailPage({ params }: PageProps) {
//     const resolvedParams = use(params);
//     const router = useRouter();
//     const { customer, isLoading } = useCustomerDetail(resolvedParams.id);

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (!customer) {
//         return <div>Customer not found</div>;
//     }

//     return (
//         <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-lg p-6 max-w-2xl mx-auto">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//                 <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => router.back()}
//                     className="text-white hover:bg-blue-500"
//                 >
//                     <ArrowLeft className="h-6 w-6" />
//                 </Button>

//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="text-white hover:bg-blue-500"
//                         >
//                             <MoreVertical className="h-6 w-6" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                             onClick={() =>
//                                 router.push(
//                                     `/customer/${resolvedParams.id}/edit`
//                                 )
//                             }
//                         >
//                             Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="text-red-600">
//                             Hapus
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>

//             {/* Image */}
//             <div className="flex justify-center mb-6">
//                 <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-blue-500">
//                     {customer.images ? (
//                         <Image
//                             src={customer.images}
//                             alt={customer.fullname}
//                             fill
//                             className="object-cover"
//                         />
//                     ) : (
//                         <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
//                             {customer.fullname.charAt(0).toUpperCase()}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Info */}
//             <div className="space-y-6">
//                 <div className="flex justify-between items-start">
//                     <div className="space-y-1">
//                         <h2 className="text-xl font-bold">
//                             {customer.fullname}
//                         </h2>
//                         <p className="text-blue-100">{customer.address}</p>
//                     </div>
//                     <span className="px-3 py-1 bg-blue-500 rounded-full text-sm">
//                         {customer.citizenship}
//                     </span>
//                 </div>

//                 <div className="space-y-3 text-blue-100">
//                     <div>
//                         <label className="text-sm text-blue-200">Email</label>
//                         <p>{customer.email}</p>
//                     </div>
//                     <div>
//                         <label className="text-sm text-blue-200">Phone</label>
//                         <p>{customer.phone_number}</p>
//                     </div>
//                     <div>
//                         <label className="text-sm text-blue-200">
//                             Tanggal Lahir
//                         </label>
//                         <p>
//                             {new Date(customer.dob).toLocaleDateString("id-ID")}
//                         </p>
//                     </div>
//                     {customer.citizenship === "WNA" && (
//                         <div>
//                             <label className="text-sm text-blue-200">
//                                 Negara
//                             </label>
//                             <p>{customer.country}</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

export default function CustomerDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { customer, isLoading } = useCustomerDetail(resolvedParams.id);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!customer) {
        return <div>Customer not found</div>;
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `/api/authenticated/customer/${resolvedParams.id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                router.push("/list-customer");
            } else {
                // Handle error, mungkin tampilkan toast error
                console.error("Gagal menghapus customer");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl p-8 max-w-2xl mx-auto shadow-xl">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/list-customer")}
                    className="text-white hover:bg-blue-500/20"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-blue-500/20"
                        >
                            <MoreVertical className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                router.push(
                                    `/customer/${resolvedParams.id}/edit`
                                )
                            }
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={handleDelete}
                        >
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Image Section */}
                <div className="flex-shrink-0">
                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-blue-500/50 shadow-lg">
                        {customer.images ? (
                            <Image
                                src={customer.images}
                                alt={customer.fullname}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white/90">
                                {customer.fullname.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-6">
                    {/* Main Info */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-2xl font-bold tracking-tight">
                                {customer.fullname}
                            </h2>
                            <div className="flex flex-col items-end gap-2">
                                <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm font-medium">
                                    {customer.citizenship}
                                </span>
                                <span className="text-sm text-blue-100">
                                    {customer.citizenship === "WNI"
                                        ? "Indonesia"
                                        : customer.country}
                                </span>
                            </div>
                        </div>

                        <div className="bg-blue-500/20 rounded-xl p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-blue-200 block mb-1">
                                        Alamat
                                    </label>
                                    <p className="text-blue-50">
                                        {customer.address}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-blue-200 block mb-1">
                                        Email
                                    </label>
                                    <p className="text-blue-50">
                                        {customer.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-blue-200 block mb-1">
                                        Nomor Telepon
                                    </label>
                                    <p className="text-blue-50">
                                        {customer.phone_number}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-blue-200 block mb-1">
                                        Tanggal Lahir
                                    </label>
                                    <p className="text-blue-50">
                                        {new Date(
                                            customer.dob
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
