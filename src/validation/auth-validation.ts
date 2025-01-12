import { z } from "zod";
import type { LoginRequest } from "@/types/auth-types";

export const loginSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Minimal 2 karakter" })
        .max(30, { message: "Maksimal 30 karakter" }),
    password: z
        .string()
        .min(6, { message: "Password minimal 6 karakter" })
        .max(60, { message: "Password maksimal 60 karakter" }),
}) satisfies z.ZodType<LoginRequest>;

// Tambahkan ini untuk type inference
export type ValidatedLoginRequest = z.infer<typeof loginSchema>;
