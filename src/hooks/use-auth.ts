import useSWRMutation from "swr/mutation";
import { api } from "@/lib/axios";
import type { LoginRequest, LoginResponse } from "@/types/auth-types";
import { UpdateCustomerRequest, UpdateCustomerResponse } from "@/types/customer-types";

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

// Update Customer
async function updateCustomer(
    url: string,
    { arg }: { arg: UpdateCustomerRequest }
): Promise<UpdateCustomerResponse> {
    const response = await api.patch<UpdateCustomerResponse>(url, arg);
    return response.data;
}

export function useUpdateCustomer(customerId: string) {
    const { trigger, isMutating, error } = useSWRMutation(
        `/authenticated/customer/${customerId}`,
        updateCustomer
    );

    return {
        updateCustomer: trigger,
        isLoading: isMutating,
        error,
    };
}
