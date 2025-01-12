import useSWR from "swr";
import { api } from "@/lib/axios";
import type { CustomerDetailResponse } from "@/types/customer-types";

async function getCustomerDetail(
    customerId: string
): Promise<CustomerDetailResponse> {
    const response = await api.get<CustomerDetailResponse>(
        `/authenticated/customer/${customerId}`
    );
    return response.data;
}

export function useCustomerDetail(customerId: string, shouldFetch: boolean) {
    const { data, error, isLoading } = useSWR(
        shouldFetch ? `/authenticated/customer/${customerId}` : null,
        () => getCustomerDetail(customerId),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        customer: data?.customer,
        isLoading,
        error,
    };
}
