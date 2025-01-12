import { prisma } from "@/prisma/client";
import type { LoginResponse } from "@/types/auth-types";
import type { ValidatedLoginRequest } from "@/validation/auth-validation";
import { createApiError } from "@/lib/errors/api-error";

export const loginService = async (
    data: ValidatedLoginRequest
): Promise<LoginResponse> => {
    await prisma.$transaction(async (tx) => {
        const user = await tx.userAccount.findUnique({
            where: { username: data.username },
        });
        if (!user) {
            throw createApiError("Invalid username or password", 401);
        }
        if (user.password !== data.password) {
            throw createApiError("Invalid username or password", 401);
        }
    });
    return {
        message: "Login successful",
        statusCode: 200,
    };
};
