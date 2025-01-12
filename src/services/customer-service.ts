// src/services/customer-service.ts
import { prisma } from "@/prisma/client";
import type {
    CustomerDetailResponse,
    CustomerDisplay,
    CustomerResponse,
    DeleteCustomerResponse,
    GetCustomersResponse,
    SearchCustomersResponse,
    SearchParams,
    UpdateCustomerRequest,
    UpdateCustomerResponse,
} from "@/types/customer-types";
import type { ValidatedCustomerRequest } from "@/validation/customer-validation";
import { createApiError } from "@/lib/errors/api-error";
import { CITIZENSHIP, Prisma } from "@prisma/client";

export const createCustomerService = async (
    data: ValidatedCustomerRequest
): Promise<CustomerResponse> => {
    const imageBuffer = data.images
        ? Buffer.from(data.images.split(",")[1], "base64")
        : null;

    // Set country berdasarkan citizenship
    const country =
        data.citizenship === CITIZENSHIP.WNI ? "Indonesia" : data.country || ""; // Fallback empty string jika undefined

    if (data.citizenship === CITIZENSHIP.WNA && !data.country) {
        throw createApiError("Negara wajib diisi untuk WNA", 400);
    }

    try {
        await prisma.$transaction(async (tx) => {
            const existingEmail = await tx.customer.findUnique({
                where: { email: data.email },
            });
            if (existingEmail) {
                throw createApiError("Email sudah txterdaftar", 400);
            }

            const existingPhone = await tx.customer.findUnique({
                where: { phone_number: data.phone_number },
            });
            if (existingPhone) {
                throw createApiError("Nomor telepon sudah terdaftar", 400);
            }

            await tx.customer.create({
                data: {
                    fullname: data.fullname,
                    email: data.email,
                    phone_number: data.phone_number,
                    address: data.address,
                    dob: data.dob,
                    citizenship: data.citizenship,
                    country,
                    images: imageBuffer,
                },
            });
        });

        return {
            message: "Customer berhasil ditambahkan",
            statusCode: 201,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw createApiError(error.message, 400);
        }
        throw error;
    }
};

// Tambahkan fungsi baru
export const getCustomersService = async (): Promise<GetCustomersResponse> => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                created_at: "desc",
            },
            select: {
                customer_id: true,
                fullname: true,
                email: true,
                citizenship: true,
                created_at: true,
                images: true,
            },
        });

        const formattedCustomers: CustomerDisplay[] = customers.map(
            (customer) => ({
                customer_id: customer.customer_id,
                fullname: customer.fullname,
                email: customer.email,
                citizenship: customer.citizenship,
                created_at: formatDate(customer.created_at),
                images: customer.images
                    ? `data:image/jpeg;base64,${Buffer.from(
                          customer.images
                      ).toString("base64")}`
                    : null,
            })
        );

        return {
            customers: formattedCustomers,
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw createApiError(error.message, 400);
        }
        throw error;
    }
};

// Fungsi helper untuk format tanggal
function formatDate(date: Date): string {
    const d = date.getDate(); // Tidak perlu padStart
    const m = date.getMonth() + 1; // Tidak perlu padStart
    const y = date.getFullYear().toString().slice(-2);
    return `${d}/${m}/${y}`;
}

// Fungsi untuk mendapatkan total customer
export const getTotalCustomersService = async (): Promise<{
    total: number;
    statusCode: number;
}> => {
    try {
        const total = await prisma.customer.count();

        return {
            total,
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw createApiError(error.message, 400);
        }
        throw error;
    }
};

export const searchCustomersService = async ({
    search,
    cursor,
    limit = 10,
    sort,
    citizenship,
    inputDate,
}: SearchParams): Promise<SearchCustomersResponse> => {
    try {
        const conditions: Prisma.CustomerWhereInput[] = [];

        // Kondisi search
        if (search) {
            conditions.push({
                OR: [
                    {
                        fullname: {
                            contains: search,
                            mode: "insensitive" as Prisma.QueryMode,
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive" as Prisma.QueryMode,
                        },
                    },
                ],
            });
        }

        // Filter citizenship
        if (citizenship) {
            conditions.push({ citizenship });
        }

        // Filter tanggal input
        if (inputDate) {
            const startOfDay = new Date(inputDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(inputDate);
            endOfDay.setHours(23, 59, 59, 999);

            conditions.push({
                created_at: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            });
        }

        const whereConditions: Prisma.CustomerWhereInput =
            conditions.length > 0 ? { AND: conditions } : {};

        const [customers, filteredTotal] = await prisma.$transaction([
            prisma.customer.findMany({
                where: whereConditions,
                take: limit + 1,
                cursor: cursor ? { customer_id: cursor } : undefined,
                orderBy: (() => {
                    // Jika hanya filter citizenship, sort asc
                    if (citizenship && !inputDate) {
                        return [
                            { citizenship: "asc" as Prisma.SortOrder },
                            { created_at: "desc" as Prisma.SortOrder },
                        ];
                    }

                    // Jika hanya filter tanggal input, sort desc
                    if (inputDate && !citizenship) {
                        return { created_at: "desc" as Prisma.SortOrder };
                    }

                    // Jika ada citizenship dan tanggal input, sort citizenship asc
                    if (citizenship && inputDate) {
                        return [
                            { citizenship: "asc" as Prisma.SortOrder },
                            { created_at: "desc" as Prisma.SortOrder },
                        ];
                    }

                    // Default sorting berdasarkan parameter sort
                    switch (sort) {
                        case "fullname":
                            return { fullname: "asc" as Prisma.SortOrder };
                        case "email":
                            return { email: "asc" as Prisma.SortOrder };
                        default:
                            return { created_at: "desc" as Prisma.SortOrder };
                    }
                })(),
                select: {
                    customer_id: true,
                    fullname: true,
                    email: true,
                    citizenship: true,
                    created_at: true,
                    images: true,
                },
            }),
            prisma.customer.count({
                where: whereConditions,
            }),
        ]);

        // Cek apakah ada data selanjutnya
        let nextCursor: string | null = null;
        if (customers.length > limit) {
            const nextItem = customers.pop(); // Hapus item extra
            nextCursor = nextItem?.customer_id || null;
        }

        const formattedCustomers: CustomerDisplay[] = customers.map(
            (customer) => ({
                customer_id: customer.customer_id,
                fullname: customer.fullname,
                email: customer.email,
                citizenship: customer.citizenship,
                created_at: formatDate(customer.created_at),
                images: customer.images
                    ? `data:image/jpeg;base64,${Buffer.from(
                          customer.images
                      ).toString("base64")}`
                    : null,
            })
        );

        return {
            customers: formattedCustomers,
            filteredTotal,
            nextCursor,
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw createApiError(error.message, 400);
        }
        throw error;
    }
};

export const getCustomerDetailService = async (
    customerId: string
): Promise<CustomerDetailResponse> => {
    try {
        const customer = await prisma.customer.findUnique({
            where: {
                customer_id: customerId,
            },
        });

        if (!customer) {
            throw createApiError("Customer tidak ditemukan", 404);
        }

        return {
            customer: {
                customer_id: customer.customer_id,
                fullname: customer.fullname,
                email: customer.email,
                phone_number: customer.phone_number,
                address: customer.address,
                dob: formatDate(customer.dob),
                citizenship: customer.citizenship,
                country: customer.country,
                images: customer.images
                    ? `data:image/jpeg;base64,${Buffer.from(
                          customer.images
                      ).toString("base64")}`
                    : null,
            },
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw createApiError(
                error.message,
                error.message.includes("tidak ditemukan") ? 404 : 400
            );
        }
        throw error;
    }
};

export const updateCustomerService = async (
    data: UpdateCustomerRequest
): Promise<UpdateCustomerResponse> => {
    try {
        await prisma.$transaction(async (tx) => {
            // Cek apakah customer exist
            const existingCustomer = await tx.customer.findUnique({
                where: { customer_id: data.customer_id },
            });

            if (!existingCustomer) {
                throw createApiError("Customer tidak ditemukan", 404);
            }

            // Cek email uniqueness jika email diupdate
            if (data.email && data.email !== existingCustomer.email) {
                const existingEmail = await tx.customer.findUnique({
                    where: { email: data.email },
                });
                if (existingEmail) {
                    throw createApiError("Email sudah terdaftar", 400);
                }
            }

            // Cek phone uniqueness jika phone diupdate
            if (
                data.phone_number &&
                data.phone_number !== existingCustomer.phone_number
            ) {
                const existingPhone = await tx.customer.findUnique({
                    where: { phone_number: data.phone_number },
                });
                if (existingPhone) {
                    throw createApiError("Nomor telepon sudah terdaftar", 400);
                }
            }

            // Prepare update data
            const updateData: Prisma.CustomerUpdateInput = {
                ...(data.fullname && { fullname: data.fullname }),
                ...(data.email && { email: data.email }),
                ...(data.phone_number && { phone_number: data.phone_number }),
                ...(data.address && { address: data.address }),
                ...(data.dob && { dob: new Date(data.dob) }), // Transform ke Date di sini
                ...(data.citizenship && { citizenship: data.citizenship }),
                country:
                    data.citizenship === CITIZENSHIP.WNI
                        ? "Indonesia"
                        : data.country,
                images:
                    data.images === null
                        ? null
                        : data.images
                        ? Buffer.from(data.images.split(",")[1], "base64")
                        : undefined,
            };

            await tx.customer.update({
                where: { customer_id: data.customer_id },
                data: updateData,
            });
        });

        return {
            message: "Customer berhasil diupdate",
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw createApiError(
                error.message,
                error.message.includes("tidak ditemukan") ? 404 : 400
            );
        }
        throw error;
    }
};

export const deleteCustomerService = async (
    customerId: string
): Promise<DeleteCustomerResponse> => {
    try {
        await prisma.$transaction(async (tx) => {
            // Cek apakah customer exist
            const existingCustomer = await tx.customer.findUnique({
                where: { customer_id: customerId },
            });

            if (!existingCustomer) {
                throw createApiError("Customer tidak ditemukan", 404);
            }

            // Delete customer
            await tx.customer.delete({
                where: { customer_id: customerId },
            });
        });

        return {
            message: "Customer berhasil dihapus",
            statusCode: 200,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw createApiError(
                error.message,
                error.message.includes("tidak ditemukan") ? 404 : 400
            );
        }
        throw error;
    }
};
