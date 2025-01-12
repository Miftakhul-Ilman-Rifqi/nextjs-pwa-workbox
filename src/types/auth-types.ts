export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    statusCode: number;
}