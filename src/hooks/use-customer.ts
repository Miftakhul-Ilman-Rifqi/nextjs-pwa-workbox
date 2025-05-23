import useSWRMutation from "swr/mutation";
import useSWRInfinite from "swr/infinite";
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
    try {
        const response = await api.get<TotalCustomerResponse>(
            "/authenticated/customer/total"
        );
        return response.data;
    } catch (err) {
        // Fallback ke cache jika offline
        if (typeof window !== "undefined" && "caches" in window) {
            const cache = await caches.open("apis");
            const cachedResp = await cache.match(
                "/api/authenticated/customer/total"
            );
            if (cachedResp) {
                const data = await cachedResp.json();
                return data as TotalCustomerResponse;
            }
        }
        throw err;
    }
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

interface UseCustomersParams {
    search?: string;
    sort?: SortOption;
    citizenship?: CITIZENSHIP;
    inputDate?: string;
    limit?: number;
}

export function useCustomers({
    search,
    sort,
    citizenship,
    inputDate,
    limit = 20, // Default limit
}: UseCustomersParams = {}) {
    const getKey = (
        pageIndex: number,
        previousPageData: GetCustomersResponse | null
    ) => {
        if (previousPageData && !previousPageData.nextCursor) return null;

        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (sort) params.append("sort", sort);
        if (citizenship) params.append("citizenship", citizenship);
        if (inputDate) params.append("inputDate", inputDate);
        params.append("limit", limit.toString());

        if (pageIndex !== 0 && previousPageData?.nextCursor) {
            params.append("cursor", previousPageData.nextCursor);
        }

        return `/authenticated/customer${
            params.toString() ? `?${params.toString()}` : ""
        }`;
    };

    const { data, error, size, setSize, isLoading, isValidating } =
        useSWRInfinite<GetCustomersResponse>(getKey, async (url) => {
            try {
                const response = await api.get<GetCustomersResponse>(url);
                return response.data;
            } catch (err) {
                // Fallback ke cache jika offline
                if (typeof window !== "undefined" && "caches" in window) {
                    const cache = await caches.open("apis");
                    // url sudah berbentuk "/authenticated/customer?..."
                    const cacheUrl = "/api" + url;
                    const cachedResp = await cache.match(cacheUrl);
                    if (cachedResp) {
                        const data = await cachedResp.json();
                        return data as GetCustomersResponse;
                    }
                }
                throw err;
            }
        });

    const customers = data
        ? data
              .flatMap((page) => page.customers)
              .filter(
                  (customer, index, self) =>
                      index ===
                      self.findIndex(
                          (c) => c.customer_id === customer.customer_id
                      )
              )
        : [];
    const filteredTotal = data?.[0]?.filteredTotal ?? 0;
    const isLoadingMore =
        isLoading ||
        (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.customers.length === 0;
    const isReachingEnd =
        isEmpty || (data && !data[data.length - 1]?.nextCursor);
    const isRefreshing = isValidating && data && data.length === size;

    return {
        customers,
        filteredTotal,
        isLoading,
        isLoadingMore,
        isReachingEnd,
        isRefreshing,
        error,
        loadMore: () => setSize(size + 1),
    };
}

export function useCustomerDetail(customerId: string) {
    const { data, error, isLoading } = useSWR(
        `/authenticated/customer/${customerId}`,
        async () => {
            try {
                const response = await api.get<CustomerDetailResponse>(
                    `/authenticated/customer/${customerId}`
                );
                return response.data;
            } catch (err) {
                // Fallback ke cache jika offline
                if (typeof window !== "undefined" && "caches" in window) {
                    const cache = await caches.open("apis");
                    const cachedResp = await cache.match(
                        `/api/authenticated/customer/${customerId}`
                    );
                    if (cachedResp) {
                        const data = await cachedResp.json();
                        return data as CustomerDetailResponse;
                    }
                }
                throw err;
            }
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
