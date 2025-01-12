// src/validation/customer-validation.ts
import { z } from "zod";
import { CITIZENSHIP } from "@prisma/client";
import type {
    CustomerRequest,
    UpdateCustomerRequest,
} from "@/types/customer-types";

// Schema untuk create customer
export const customerSchema = z
    .object({
        fullname: z
            .string()
            .min(1, "Nama lengkap wajib diisi")
            .max(30, "Nama lengkap maksimal 30 karakter"),
        email: z
            .string()
            .min(1, "Email wajib diisi")
            .email("Format email tidak valid")
            .max(255, { message: "Email maksimal 255 karakter" }),
        phone_number: z
            .string()
            .min(1, "Nomor telepon wajib diisi")
            .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
        address: z
            .string()
            .min(1, "Alamat wajib diisi")
            .max(255, "Alamat maksimal 255 karakter"),
        dob: z.string().transform((str) => new Date(str)), // Transform string ke Date
        citizenship: z.enum([CITIZENSHIP.WNI, CITIZENSHIP.WNA], {
            required_error: "Kewarganegaraan wajib dipilih",
        }),
        country: z.string().optional(), // Buat opsional
        images: z
            .string()
            .refine(
                (val) =>
                    val === "" ||
                    /^data:image\/(jpeg|jpg|png);base64,/.test(val),
                "Format gambar tidak valid. Gunakan JPEG, JPG, atau PNG"
            )
            .optional()
            .nullable(),
    })
    .refine(
        (data) => {
            if (data.citizenship === CITIZENSHIP.WNA) {
                return data.country && data.country.length > 0;
            }
            return true;
        },
        {
            message: "Negara wajib dipilih untuk WNA",
            path: ["country"],
        }
    ) satisfies z.ZodType<CustomerRequest>;

// Schema untuk update customer
export const updateCustomerSchema = z.object({
    customer_id: z.string().uuid("Invalid UUID format"),
    fullname: z
        .string()
        .min(1, "Nama lengkap wajib diisi")
        .max(30, "Nama lengkap maksimal 30 karakter")
        .optional(),
    email: z
        .string()
        .email("Format email tidak valid")
        .max(255, { message: "Email maksimal 255 karakter" })
        .optional(),
    phone_number: z
        .string()
        .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka")
        .optional(),
    address: z
        .string()
        .min(1, "Alamat wajib diisi")
        .max(255, "Alamat maksimal 255 karakter")
        .optional(),
    dob: z.string().optional(), // Terima string, transformasi dilakukan di service
    citizenship: z.enum([CITIZENSHIP.WNI, CITIZENSHIP.WNA]).optional(),
    country: z.string().optional(),
    images: z
        .string()
        .refine(
            (val) =>
                val === "" || /^data:image\/(jpeg|jpg|png);base64,/.test(val),
            "Format gambar tidak valid. Gunakan JPEG, JPG, atau PNG"
        )
        .nullable()
        .optional(),
}) satisfies z.ZodType<UpdateCustomerRequest>;

export type ValidatedCustomerRequest = z.infer<typeof customerSchema>;
export type ValidatedUpdateCustomerRequest = z.infer<
    typeof updateCustomerSchema
>;
