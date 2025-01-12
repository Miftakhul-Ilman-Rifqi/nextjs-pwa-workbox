import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validation/auth-validation";
import { loginService } from "@/services/auth-service";
import { handleError } from "@/lib/errors/error-handler";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = loginSchema.parse(body);
        const result = await loginService(validatedData);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}
