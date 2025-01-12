"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { format } from "date-fns";
import { CITIZENSHIP } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FilterOption, SortOption } from "@/types/filter-types";

interface FilterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isMobile: boolean;
    onApplyFilter: (sort: SortOption, filter: FilterOption) => void;
    triggerRef: React.RefObject<HTMLButtonElement | null>; // Ubah ini
}

export function FilterDialog({
    open,
    onOpenChange,
    isMobile,
    onApplyFilter,
    triggerRef, // Tambah ini
}: FilterDialogProps) {
    const [selectedSort, setSelectedSort] = useState<SortOption>(null);
    const [selectedFilter, setSelectedFilter] = useState<FilterOption>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const Content = (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">Filter</span>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => {
                        setSelectedSort(null);
                        setSelectedFilter(null);
                        setSelectedDate(null);
                    }}
                >
                    Reset
                </Button>
            </div>

            {/* Urutkan Berdasarkan */}
            <div className="space-y-2">
                <h3 className="font-medium">Urutkan Berdasarkan</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: "Nama", value: "fullname" },
                        { label: "Email", value: "email" },
                        { label: "Tanggal Input", value: "created_at" },
                    ].map((option) => (
                        <Button
                            key={option.value}
                            variant={
                                selectedSort === option.value
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => {
                                setSelectedSort(option.value as SortOption);
                                setSelectedFilter(null);
                                setSelectedDate(null);
                            }}
                            className={cn(
                                selectedSort === option.value &&
                                    "bg-blue-600 text-white"
                            )}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Kewarganegaraan */}
            <div className="space-y-2">
                <h3 className="font-medium">Kewarganegaraan</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: "WNI", value: CITIZENSHIP.WNI },
                        { label: "WNA", value: CITIZENSHIP.WNA },
                    ].map((option) => (
                        <Button
                            key={option.value}
                            variant={
                                selectedFilter?.citizenship === option.value
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => {
                                setSelectedFilter({
                                    citizenship: option.value,
                                    inputDate: selectedDate
                                        ?.toISOString()
                                        .split("T")[0],
                                });
                                setSelectedSort(null);
                            }}
                            className={cn(
                                selectedFilter?.citizenship === option.value &&
                                    "bg-blue-600 text-white"
                            )}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tanggal Input */}
            <div className="space-y-2">
                <h3 className="font-medium">Tanggal Input</h3>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                selectedDate && "text-blue-600"
                            )}
                        >
                            {selectedDate
                                ? format(selectedDate, "dd/MM/yyyy")
                                : "Pilih tanggal"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate || undefined}
                            onSelect={(date: Date | undefined) => {
                                setSelectedDate(date || null);
                                if (date && selectedFilter?.citizenship) {
                                    const formattedDate =
                                        date.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
                                    setSelectedFilter({
                                        ...selectedFilter,
                                        inputDate: formattedDate,
                                    });
                                } else if (date) {
                                    const formattedDate =
                                        date.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
                                    setSelectedFilter({
                                        inputDate: formattedDate,
                                    });
                                }
                                setSelectedSort(null);
                            }}
                            disabled={(date) => date > new Date()}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Button
                className="w-full bg-blue-600"
                onClick={() => {
                    onApplyFilter(selectedSort, selectedFilter);
                    onOpenChange(false);
                }}
            >
                Lihat Hasil
            </Button>
        </div>
    );

    //     return isMobile ? (
    //         <Dialog open={open} onOpenChange={onOpenChange}>
    //             <DialogContent className="sm:max-w-[425px]">
    //                 <DialogHeader>
    //                     <DialogTitle>Filter</DialogTitle>
    //                 </DialogHeader>
    //                 {Content}
    //             </DialogContent>
    //         </Dialog>
    //     ) : (
    //         <Popover open={open} onOpenChange={onOpenChange}>
    //             <PopoverContent className="w-80">{Content}</PopoverContent>
    //         </Popover>
    //     );
    // }

    return isMobile ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                </DialogHeader>
                {Content}
            </DialogContent>
        </Dialog>
    ) : (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    size="icon"
                    className="bg-blue-50/70 border-blue-200 hover:bg-blue-50 focus:bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                {Content}
            </PopoverContent>
        </Popover>
    );
}
