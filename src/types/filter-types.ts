import { CITIZENSHIP } from "@prisma/client";

export type SortOption = "fullname" | "email" | "created_at" | null;
export type FilterOption = {
    citizenship?: CITIZENSHIP;
    inputDate?: string;
} | null;
