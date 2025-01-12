"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "@/validation/customer-validation";
import type { CustomerRequest } from "@/types/customer-types";
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
import { useCreateCustomer } from "@/hooks/use-customer";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function CustomerForm() {
    const router = useRouter();
    const { createCustomer, isLoading } = useCreateCustomer();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CustomerRequest>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            fullname: "",
            email: "",
            phone_number: "",
            address: "",
            dob: new Date().toISOString(),
            citizenship: CITIZENSHIP.WNI,
            country: "",
            images: null,
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
            const response = await createCustomer(data);

            if (response.statusCode === 201) {
                toast.success("Data customer berhasil disimpan");
                form.reset();
                router.push("/list-customer");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(
                    error.response?.data?.message ||
                        "Terjadi kesalahan saat menyimpan data"
                );
            } else {
                toast.error("Terjadi kesalahan yang tidak diketahui");
            }
        }
    };

    return (
        <Card className="w-full max-w-[500px] border-0 shadow-lg bg-white dark:bg-gray-950">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center font-bold text-blue-700 dark:text-blue-500">
                    Input Data Customer
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
                            render={({ field }) => (
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
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(
                                                            new Date(
                                                                field.value
                                                            ),
                                                            "dd MMMM yyyy",
                                                            {
                                                                locale: id,
                                                            }
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
                                            className="w-auto min-w-[320px]"
                                            align="center"
                                            sideOffset={5}
                                        >
                                            <div className="flex flex-col space-y-4 p-2">
                                                <div className="flex justify-between gap-2">
                                                    {/* Dropdown Tahun */}
                                                    <Select
                                                        onValueChange={(
                                                            year
                                                        ) => {
                                                            const current =
                                                                new Date(
                                                                    field.value
                                                                );
                                                            const newDate =
                                                                new Date(
                                                                    parseInt(
                                                                        year
                                                                    ),
                                                                    current.getMonth(),
                                                                    current.getDate()
                                                                );
                                                            field.onChange(
                                                                newDate.toISOString()
                                                            );
                                                        }}
                                                        value={new Date(
                                                            field.value
                                                        )
                                                            .getFullYear()
                                                            .toString()}
                                                    >
                                                        <SelectTrigger className="w-[110px]">
                                                            <SelectValue placeholder="Tahun" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from(
                                                                { length: 124 },
                                                                (_, i) => (
                                                                    <SelectItem
                                                                        key={
                                                                            2024 -
                                                                            i
                                                                        }
                                                                        value={(
                                                                            2024 -
                                                                            i
                                                                        ).toString()}
                                                                    >
                                                                        {2024 -
                                                                            i}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>

                                                    {/* Dropdown Bulan */}
                                                    <Select
                                                        onValueChange={(
                                                            month
                                                        ) => {
                                                            const current =
                                                                new Date(
                                                                    field.value
                                                                );
                                                            const newDate =
                                                                new Date(
                                                                    current.getFullYear(),
                                                                    parseInt(
                                                                        month
                                                                    ),
                                                                    current.getDate()
                                                                );
                                                            field.onChange(
                                                                newDate.toISOString()
                                                            );
                                                        }}
                                                        value={new Date(
                                                            field.value
                                                        )
                                                            .getMonth()
                                                            .toString()}
                                                    >
                                                        <SelectTrigger className="w-[110px]">
                                                            <SelectValue placeholder="Bulan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from(
                                                                { length: 12 },
                                                                (_, i) => (
                                                                    <SelectItem
                                                                        key={i}
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
                                                </div>
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : undefined
                                                    }
                                                    onSelect={(date) => {
                                                        field.onChange(
                                                            date?.toISOString() ??
                                                                null
                                                        );
                                                    }}
                                                    disabled={(date) =>
                                                        date > new Date()
                                                    }
                                                    initialFocus
                                                    className="rounded-md border"
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
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
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Data"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
