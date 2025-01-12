import useSWRMutation from "swr/mutation";
import { api } from "@/lib/axios";
import type { LoginRequest, LoginResponse } from "@/types/auth-types";

async function login(url: string, { arg }: { arg: LoginRequest }) {
    const response = await api.post<LoginResponse>(url, arg);
    return response.data;
}

export function useLogin() {
    const { trigger, isMutating, error } = useSWRMutation("/auth/login", login);

    return {
        login: trigger,
        isLoading: isMutating,
        error,
    };
}
