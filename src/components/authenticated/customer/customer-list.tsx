"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomers, useTotalCustomer } from "@/hooks/use-customer";
import { CustomerCard } from "../customer-card";
import { useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { FilterOption, SortOption } from "@/types/filter-types";
import { FilterDialog } from "./filter-dialog";
import { useMediaQuery } from "@/hooks/use-media-query";

export function CustomerList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [openFilter, setOpenFilter] = useState(false);
    const [activeSort, setActiveSort] = useState<SortOption>(null);
    const [activeFilter, setActiveFilter] = useState<FilterOption>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const debouncedSearch = useDebounce(searchTerm, 300);

    const { total } = useTotalCustomer();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const { customers, filteredTotal, isLoading } = useCustomers({
        search: debouncedSearch,
        sort: activeSort,
        citizenship: activeFilter?.citizenship,
        inputDate: activeFilter?.inputDate,
    });

    const handleApplyFilter = (sort: SortOption, filter: FilterOption) => {
        setActiveSort(sort);
        setActiveFilter(filter);
    };
    return (
        <div className="w-full">
            {/* Search dan Filter Section */}
            <div className="flex justify-center w-full">
                <div className="flex flex-col w-full max-w-3xl">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Cari customer..."
                                className="pl-9 bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {isMobile && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900"
                                onClick={() => setOpenFilter(true)}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        )}

                        <FilterDialog
                            open={openFilter}
                            onOpenChange={setOpenFilter}
                            isMobile={isMobile}
                            onApplyFilter={handleApplyFilter}
                            triggerRef={filterButtonRef}
                        />
                    </div>

                    {/* Info Total dan Terfilter */}
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {/* <div>Total Customer: {isLoading ? "..." : total}</div> */}
                        <div>Total Customer: {total}</div>
                        <div>
                            {/* Terfilter: {debouncedSearch ? filteredTotal : "-"} */}
                            {debouncedSearch ? filteredTotal : ""}
                        </div>
                    </div>
                </div>
            </div>

            {/* List content area */}
            <div className="w-full flex justify-center">
                <div className="w-full max-w-3xl">
                    <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                        {isLoading ? (
                            <div className="text-center text-gray-500">
                                Loading...
                            </div>
                        ) : customers.length === 0 ? (
                            <div className="text-center text-gray-500">
                                {debouncedSearch
                                    ? "Tidak ada hasil pencarian"
                                    : "Tidak ada data customer"}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {customers.map((customer) => (
                                    <CustomerCard
                                        key={customer.customer_id}
                                        customer={customer}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
