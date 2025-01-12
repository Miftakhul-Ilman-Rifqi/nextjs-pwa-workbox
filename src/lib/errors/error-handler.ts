import { NextResponse } from "next/server";
import { ApiError } from "./api-error";
import { ZodError } from "zod";

export const handleError = (error: unknown) => {
    if (error instanceof ApiError) {
        return NextResponse.json(
            { message: error.message },
            { status: error.statusCode }
        );
    }

    if (error instanceof ZodError) {
        return NextResponse.json(
            { message: "Validation failed", errors: error.errors },
            { status: 400 }
        );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
    );
};
