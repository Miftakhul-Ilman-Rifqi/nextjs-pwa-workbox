import { CITIZENSHIP } from "@prisma/client";

// Base interface untuk data customer
export interface CustomerRequest {
    fullname: string;
    email: string;
    phone_number: string;
    address: string;
    dob: Date | string; // bisa menerima string dari request
    citizenship: CITIZENSHIP;
    images?: string | null;
    country?: string;
}

// Interface untuk response
export interface CustomerResponse {
    message: string;
    statusCode: number;
}

export interface CustomerDisplay {
    customer_id: string;
    fullname: string;
    email: string;
    citizenship: CITIZENSHIP;
    created_at: string; // Format: D/M/YY
    images: string | null; // Base64
}

// Tambahkan ke response yang sudah ada
export interface GetCustomersResponse {
    customers: CustomerDisplay[];
    statusCode: number;
    filteredTotal?: number;
    nextCursor?: string | null; // Tambahkan ini
}

export interface SearchCustomersResponse {
    customers: CustomerDisplay[];
    filteredTotal: number;
    nextCursor?: string | null; // Cursor untuk data selanjutnya
    statusCode: number;
}

export type SortField = "fullname" | "email" | "created_at";

export interface SearchParams {
    search?: string;
    cursor?: string;
    limit?: number;
    sort?: SortField;
    citizenship?: CITIZENSHIP;
    inputDate?: Date; // Tambahan untuk filter tanggal input
}

export interface CustomerDetail {
    customer_id: string;
    fullname: string;
    email: string;
    phone_number: string;
    address: string;
    dob: string; // Format: DD/MM/YY
    citizenship: CITIZENSHIP;
    country: string;
    images: string | null;
}

export interface CustomerDetailResponse {
    customer: CustomerDetail;
    statusCode: number;
}

export interface UpdateCustomerRequest {
    customer_id: string; // Tetap diperlukan untuk identifikasi
    fullname?: string; // Optional fields yang bisa diupdate
    email?: string;
    phone_number?: string;
    address?: string;
    dob?: string; // Gunakan Date untuk kompatibilitas dengan calendar
    citizenship?: CITIZENSHIP;
    country?: string;
    images?: string | null; // null untuk hapus image, string base64 untuk update
}

export interface UpdateCustomerResponse {
    message: string;
    statusCode: number;
}

export interface DeleteCustomerResponse {
    message: string;
    statusCode: number;
}
