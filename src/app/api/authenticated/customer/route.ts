// src/app/api/customer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { customerSchema } from "@/validation/customer-validation";
import {
    createCustomerService,
    getCustomersService,
    searchCustomersService,
} from "@/services/customer-service";
import { handleError } from "@/lib/errors/error-handler";
import { SortField } from "@/types/customer-types";
import { CITIZENSHIP } from "@prisma/client";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = customerSchema.parse(body);
        const result = await createCustomerService(validatedData);

        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search");
        const cursor = searchParams.get("cursor");
        const limit = searchParams.get("limit");
        const sort = searchParams.get("sort") as SortField | undefined;
        const citizenship = searchParams.get("citizenship") as
            | CITIZENSHIP
            | undefined;
        const inputDate = searchParams.get("inputDate");

        // Jika tidak ada parameter search, cursor, atau limit, gunakan getCustomersService
        if (
            !search &&
            !cursor &&
            !limit &&
            !sort &&
            !citizenship &&
            !inputDate
        ) {
            const result = await getCustomersService();
            return NextResponse.json(result, { status: result.statusCode });
        }

        // Jika ada parameter, gunakan searchCustomersService
        const result = await searchCustomersService({
            search: search ?? undefined,
            cursor: cursor ?? undefined,
            limit: limit ? parseInt(limit) : undefined,
            sort,
            citizenship,
            inputDate: inputDate ? new Date(inputDate) : undefined,
        });

        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}
