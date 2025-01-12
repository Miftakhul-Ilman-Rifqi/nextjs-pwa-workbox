import useSWRMutation from "swr/mutation";
import { api } from "@/lib/axios";
import type {
    CustomerDetailResponse,
    CustomerRequest,
    CustomerResponse,
    GetCustomersResponse,
    UpdateCustomerResponse,
} from "@/types/customer-types";
import useSWR from "swr";
import { SortOption } from "@/types/filter-types";
import { CITIZENSHIP } from "@prisma/client";

async function sendRequest(
    url: string,
    { arg }: { arg: CustomerRequest }
): Promise<CustomerResponse> {
    const response = await api.post<CustomerResponse>(url, arg);
    return response.data;
}

export function useCreateCustomer() {
    const { trigger, isMutating, error } = useSWRMutation(
        "/authenticated/customer",
        sendRequest
    );

    return {
        createCustomer: trigger,
        isLoading: isMutating,
        error,
    };
}

interface TotalCustomerResponse {
    total: number;
    statusCode: number;
}

async function getTotalCustomer(): Promise<TotalCustomerResponse> {
    const response = await api.get<TotalCustomerResponse>(
        "/authenticated/customer/total"
    );
    return response.data;
}

export function useTotalCustomer() {
    const { data, error, isLoading } = useSWR(
        "/authenticated/customer/total",
        getTotalCustomer
    );

    return {
        total: data?.total ?? 0,
        isLoading,
        error,
    };
}

// export function useCustomers() {
//     const { data, error, isLoading } = useSWR(
//         "/authenticated/customer",
//         async () => {
//             const response = await api.get<GetCustomersResponse>(
//                 "/authenticated/customer"
//             );
//             return response.data;
//         }
//     );

//     return {
//         customers: data?.customers ?? [],
//         isLoading,
//         error,
//     };
// }

// // src/hooks/use-customer.ts
// export function useCustomers(search?: string) {
//     const { data, error, isLoading } = useSWR(
//         // Key akan berubah ketika search berubah
//         `/authenticated/customer${search ? `?search=${search}` : ""}`,
//         async () => {
//             const response = await api.get<GetCustomersResponse>(
//                 `/authenticated/customer${search ? `?search=${search}` : ""}`
//             );
//             return response.data;
//         }
//     );

//     return {
//         customers: data?.customers ?? [],
//         filteredTotal: data?.filteredTotal ?? 0,
//         isLoading,
//         error,
//     };
// }

// src/hooks/use-customer.ts
interface UseCustomersParams {
    search?: string;
    sort?: SortOption;
    citizenship?: CITIZENSHIP;
    inputDate?: string;
}

export function useCustomers({
    search,
    sort,
    citizenship,
    inputDate,
}: UseCustomersParams = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);
    if (citizenship) params.append("citizenship", citizenship);
    if (inputDate) params.append("inputDate", inputDate);

    const queryString = params.toString();

    const { data, error, isLoading } = useSWR(
        `/authenticated/customer${queryString ? `?${queryString}` : ""}`,
        async () => {
            const response = await api.get<GetCustomersResponse>(
                `/authenticated/customer${queryString ? `?${queryString}` : ""}`
            );
            console.log("API Response:", response.data); // Debug
            return response.data;
        }
    );

    return {
        customers: data?.customers ?? [],
        // filteredTotal: data?.filteredTotal ?? 0,
        filteredTotal: data?.filteredTotal, // Remove default value
        isLoading,
        error,
    };
}

export function useCustomerDetail(customerId: string) {
    const { data, error, isLoading } = useSWR(
        `/authenticated/customer/${customerId}`,
        async () => {
            const response = await api.get<CustomerDetailResponse>(
                `/authenticated/customer/${customerId}`
            );
            return response.data;
        }
    );

    return {
        customer: data?.customer,
        isLoading,
        error,
    };
}

export function useUpdateCustomer(customerId: string) {
    const { trigger, isMutating } = useSWRMutation(
        `/authenticated/customer/${customerId}`,
        async (url, { arg }: { arg: CustomerRequest }) => {
            const response = await api.patch<UpdateCustomerResponse>(url, arg);
            return response.data;
        }
    );

    return {
        updateCustomer: trigger,
        isLoading: isMutating,
    };
}
