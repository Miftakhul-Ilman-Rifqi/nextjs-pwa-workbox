import { NextResponse } from "next/server";
import { getTotalCustomersService } from "@/services/customer-service";
import { handleError } from "@/lib/errors/error-handler";

export async function GET() {
    try {
        const result = await getTotalCustomersService();
        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}
