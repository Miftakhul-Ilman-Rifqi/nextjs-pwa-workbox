export class ApiError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
    }
}

export const createApiError = (message: string, statusCode: number) => {
    return new ApiError(message, statusCode);
};
