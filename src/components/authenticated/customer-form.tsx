"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "@/validation/customer-validation";
import type { CustomerDetail, CustomerRequest } from "@/types/customer-types";
import { CITIZENSHIP } from "@prisma/client";
import { useRef, useState } from "react";
import Image from "next/image";
import { CalendarIcon } from "lucide-react"; // Import icon
import { format } from "date-fns"; // Untuk format tanggal
import { id } from "date-fns/locale"; // Untuk bahasa Indonesia

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customer";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface CustomerFormProps {
    mode?: "create" | "edit";
    initialData?: CustomerDetail;
    customerId?: string;
}

export function CustomerForm({
    mode = "create",
    initialData,
    customerId,
}: CustomerFormProps) {
    const router = useRouter();
    const { createCustomer, isLoading: isLoadingCreate } = useCreateCustomer();
    const { updateCustomer, isLoading: isLoadingUpdate } = useUpdateCustomer(
        customerId || ""
    );
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        initialData?.images || null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tambahkan fungsi parser di luar form component
    const parseDateFromApi = (dateStr: string) => {
        try {
            const [day, month, year] = dateStr.split("/").map(Number);
            let fullYear = year;
            if (year < 100) {
                fullYear = year < 50 ? 2000 + year : 1900 + year;
            }
            const date = new Date(fullYear, month - 1, day);
            date.setHours(12, 0, 0, 0);
            return date.toISOString().split("T")[0]; // Return format YYYY-MM-DD
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return dateStr;
        }
    };

    const form = useForm<CustomerRequest>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            fullname: initialData?.fullname || "",
            email: initialData?.email || "",
            phone_number: initialData?.phone_number || "",
            address: initialData?.address || "",
            dob: initialData?.dob
                ? parseDateFromApi(initialData.dob)
                : new Date().toISOString().split("T")[0],
            citizenship: initialData?.citizenship || CITIZENSHIP.WNI,
            country: initialData?.country || "",
            images: initialData?.images || null,
        },
    });

    const watchCitizenship = form.watch("citizenship");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                form.setError("images", {
                    message:
                        "Format gambar tidak valid. Gunakan JPEG, JPG, atau PNG",
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewUrl(base64String);
                form.setValue("images", base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setPreviewUrl(null);
        form.setValue("images", null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input file
        }
    };

    const onSubmit = async (data: CustomerRequest) => {
        try {
            if (mode === "edit" && customerId && initialData) {
                type CustomerKey = keyof CustomerRequest;
                const changedFields = Object.entries(data).reduce<
                    Partial<CustomerRequest>
                >((acc, [key, currentValue]) => {
                    const typedKey = key as CustomerKey;
                    const initialValue = initialData[typedKey];

                    // Special handling for date comparison
                    if (typedKey === "dob") {
                        // Parse initial date (format: dd/m/yy)
                        const parseDate = (dateStr: string) => {
                            try {
                                const [day, month, year] = dateStr
                                    .split("/")
                                    .map(Number);
                                let fullYear = year;
                                if (year < 100) {
                                    fullYear =
                                        year < 50 ? 2000 + year : 1900 + year;
                                }
                                // Return format YYYY-MM-DD
                                return `${fullYear}-${month
                                    .toString()
                                    .padStart(2, "0")}-${day
                                    .toString()
                                    .padStart(2, "0")}`;
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            } catch (error) {
                                return dateStr;
                            }
                        };

                        // Parse current value (format: date string)
                        const formatCurrentDate = (dateStr: string) => {
                            try {
                                // Remove timezone and get only YYYY-MM-DD
                                return new Date(dateStr)
                                    .toISOString()
                                    .split("T")[0];
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            } catch (error) {
                                return dateStr;
                            }
                        };

                        const parsedInitialDate = initialValue
                            ? parseDate(initialValue as string)
                            : null;
                        const currentFormattedDate = currentValue
                            ? formatCurrentDate(currentValue)
                            : null;

                        if (
                            currentFormattedDate &&
                            currentFormattedDate !== parsedInitialDate
                        ) {
                            // Kirim dengan format YYYY-MM-DD
                            acc[typedKey] = currentFormattedDate;
                        }
                    }
                    // Handle optional fields
                    else if (typedKey === "images" || typedKey === "country") {
                        if (
                            typedKey === "images" &&
                            currentValue !== initialValue
                        ) {
                            acc[typedKey] = currentValue;
                        } else if (
                            typedKey === "country" &&
                            currentValue !== initialValue
                        ) {
                            acc[typedKey] = currentValue;
                        }
                    }
                    // Regular comparison for required fields
                    else if (currentValue !== initialValue) {
                        acc[typedKey] = currentValue;
                    }

                    return acc;
                }, {});

                // If no changes were made
                if (Object.keys(changedFields).length === 0) {
                    toast.info("Tidak ada perubahan data");
                    return;
                }

                // Send only changed fields
                const response = await updateCustomer({
                    ...changedFields,
                    customer_id: customerId,
                } as CustomerRequest);

                if (response.statusCode === 200) {
                    toast.success("Data customer berhasil diperbarui");
                    router.push(`/customer/${customerId}`);
                }
            } else {
                const response = await createCustomer(data);
                if (response.statusCode === 201) {
                    toast.success("Data customer berhasil disimpan");
                    form.reset();
                    router.push("/list-customer");
                }
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(
                    error.response?.data?.message ||
                        `Terjadi kesalahan saat ${
                            mode === "edit" ? "memperbarui" : "menyimpan"
                        } data`
                );
            } else {
                console.error("Non-Axios Error:", error);
                toast.error("Terjadi kesalahan yang tidak diketahui");
            }
        }
    };

    return (
        <Card className="w-full max-w-[500px] border-0 shadow-lg bg-white dark:bg-gray-950">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center font-bold text-blue-700 dark:text-blue-500">
                    {mode === "edit"
                        ? "Edit Data Customer"
                        : "Input Data Customer"}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue-900 dark:text-blue-300">
                                        Nama Lengkap
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Masukkan nama lengkap"
                                            {...field}
                                            className="bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-950/30 dark:focus:bg-blue-950/30"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue-900 dark:text-blue-300">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Masukkan email"
                                            {...field}
                                            className="bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-950/30 dark:focus:bg-blue-950/30"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue-900 dark:text-blue-300">
                                        Nomor Telepon
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Masukkan nomor telepon"
                                            {...field}
                                            className="bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-950/30 dark:focus:bg-blue-950/30"
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue-900 dark:text-blue-300">
                                        Alamat
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Masukkan alamat"
                                            {...field}
                                            className="bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-950/30 dark:focus:bg-blue-950/30"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => {
                                // Parser untuk format tanggal dari API
                                const parseInitialDate = (dateStr: string) => {
                                    try {
                                        const [day, month, year] = dateStr
                                            .split("/")
                                            .map(Number);

                                        // Konversi 2-digit year ke 4-digit year
                                        let fullYear = year;
                                        if (year < 100) {
                                            fullYear =
                                                year < 50
                                                    ? 2000 + year
                                                    : 1900 + year;
                                        }

                                        // Buat objek Date dengan urutan yang benar (bulan dimulai dari 0)
                                        const date = new Date(
                                            fullYear,
                                            month - 1,
                                            day
                                        );

                                        // Validasi tanggal
                                        if (isNaN(date.getTime())) {
                                            return new Date(); // fallback ke tanggal hari ini jika invalid
                                        }

                                        // Set waktu ke tengah hari
                                        date.setHours(12, 0, 0, 0);
                                        return date;
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    } catch (error) {
                                        return new Date(); // fallback ke tanggal hari ini jika error
                                    }
                                };

                                // Parse nilai awal jika formatnya dd/mm/yy
                                const initialValue =
                                    field.value &&
                                    typeof field.value === "string" &&
                                    field.value.includes("/")
                                        ? parseInitialDate(field.value)
                                        : field.value;

                                return (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-blue-900 dark:text-blue-300">
                                            Tanggal Lahir
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            "bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-950/30 dark:focus:bg-blue-950/30",
                                                            !initialValue &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {initialValue ? (
                                                            format(
                                                                new Date(
                                                                    initialValue
                                                                ),
                                                                "dd MMMM yyyy",
                                                                { locale: id }
                                                            )
                                                        ) : (
                                                            <span>
                                                                Masukkan Tanggal
                                                                Lahir
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="center"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        initialValue
                                                            ? new Date(
                                                                  initialValue
                                                              )
                                                            : undefined
                                                    }
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            const selectedDate =
                                                                new Date(date);
                                                            selectedDate.setHours(
                                                                12,
                                                                0,
                                                                0,
                                                                0
                                                            );
                                                            field.onChange(
                                                                selectedDate
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            );
                                                        } else {
                                                            field.onChange(
                                                                null
                                                            );
                                                        }
                                                    }}
                                                    disabled={(date) =>
                                                        date > new Date()
                                                    }
                                                    initialFocus
                                                    footer={
                                                        <div className="flex gap-2 p-3">
                                                            <Select
                                                                onValueChange={(
                                                                    month
                                                                ) => {
                                                                    const current =
                                                                        field.value
                                                                            ? new Date(
                                                                                  field.value
                                                                              )
                                                                            : new Date();
                                                                    current.setMonth(
                                                                        parseInt(
                                                                            month
                                                                        )
                                                                    );
                                                                    current.setHours(
                                                                        12,
                                                                        0,
                                                                        0,
                                                                        0
                                                                    );
                                                                    field.onChange(
                                                                        current
                                                                            .toISOString()
                                                                            .split(
                                                                                "T"
                                                                            )[0]
                                                                    );
                                                                }}
                                                                value={
                                                                    field.value
                                                                        ? new Date(
                                                                              field.value
                                                                          )
                                                                              .getMonth()
                                                                              .toString()
                                                                        : undefined
                                                                }
                                                            >
                                                                <SelectTrigger className="w-[130px]">
                                                                    <SelectValue placeholder="Pilih Bulan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from(
                                                                        {
                                                                            length: 12,
                                                                        },
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    i
                                                                                }
                                                                                value={i.toString()}
                                                                            >
                                                                                {format(
                                                                                    new Date(
                                                                                        0,
                                                                                        i
                                                                                    ),
                                                                                    "MMMM",
                                                                                    {
                                                                                        locale: id,
                                                                                    }
                                                                                )}
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>

                                                            <Select
                                                                onValueChange={(
                                                                    year
                                                                ) => {
                                                                    const current =
                                                                        field.value
                                                                            ? new Date(
                                                                                  field.value
                                                                              )
                                                                            : new Date();
                                                                    current.setFullYear(
                                                                        parseInt(
                                                                            year
                                                                        )
                                                                    );
                                                                    current.setHours(
                                                                        12,
                                                                        0,
                                                                        0,
                                                                        0
                                                                    );
                                                                    field.onChange(
                                                                        current
                                                                            .toISOString()
                                                                            .split(
                                                                                "T"
                                                                            )[0]
                                                                    );
                                                                }}
                                                                value={
                                                                    field.value
                                                                        ? new Date(
                                                                              field.value
                                                                          )
                                                                              .getFullYear()
                                                                              .toString()
                                                                        : undefined
                                                                }
                                                            >
                                                                <SelectTrigger className="w-[100px]">
                                                                    <SelectValue placeholder="Tahun" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from(
                                                                        {
                                                                            length: 124,
                                                                        },
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => {
                                                                            const year =
                                                                                new Date().getFullYear() -
                                                                                i;
                                                                            return (
                                                                                <SelectItem
                                                                                    key={
                                                                                        year
                                                                                    }
                                                                                    value={year.toString()}
                                                                                >
                                                                                    {
                                                                                        year
                                                                                    }
                                                                                </SelectItem>
                                                                            );
                                                                        }
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="citizenship"
                            defaultValue={CITIZENSHIP.WNI} // Tambahkan defaultValue di level FormField
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue-900 dark:text-blue-300">
                                        Kewarganegaraan
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-950/30 dark:focus:bg-blue-950/30">
                                                <SelectValue placeholder="Pilih kewarganegaraan">
                                                    {field.value ===
                                                    CITIZENSHIP.WNI
                                                        ? "WNI"
                                                        : "WNA"}
                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={CITIZENSHIP.WNI}>
                                                WNI
                                            </SelectItem>
                                            <SelectItem value={CITIZENSHIP.WNA}>
                                                WNA
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Field Negara hanya muncul jika WNA */}
                        {watchCitizenship === CITIZENSHIP.WNA && (
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-900 dark:text-blue-300">
                                            Negara
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""} // Pastikan value tidak undefined
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-950/30 dark:focus:bg-blue-950/30">
                                                    <SelectValue placeholder="Pilih negara" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem
                                                        key={country.code}
                                                        value={country.name}
                                                    >
                                                        {country.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue-900 dark:text-blue-300">
                                        Foto Customer
                                    </FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            <Input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png"
                                                onChange={handleImageChange}
                                                ref={fileInputRef}
                                                className="cursor-pointer bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-950/30 dark:focus:bg-blue-950/30"
                                                name={field.name}
                                                onBlur={field.onBlur}
                                                disabled={field.disabled}
                                            />
                                            {previewUrl && (
                                                <div className="relative w-32 h-32">
                                                    <Image
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover rounded-md"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute -top-2 -right-2"
                                                        onClick={clearImage}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold"
                            disabled={
                                mode === "edit"
                                    ? isLoadingUpdate
                                    : isLoadingCreate
                            }
                        >
                            {mode === "edit"
                                ? isLoadingUpdate
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"
                                : isLoadingCreate
                                ? "Menyimpan..."
                                : "Simpan Data"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
