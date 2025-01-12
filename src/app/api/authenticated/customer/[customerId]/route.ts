// import { NextRequest, NextResponse } from "next/server";
// import {
//     deleteCustomerService,
//     getCustomerDetailService,
//     updateCustomerService,
// } from "@/services/customer-service";
// import { handleError } from "@/lib/errors/error-handler";
// import { updateCustomerSchema } from "@/validation/customer-validation";

// export async function GET(
//     request: NextRequest,
//     { params }: { params: { customerId: string } }
// ) {
//     try {
//         const result = await getCustomerDetailService(params.customerId);
//         return NextResponse.json(result, { status: result.statusCode });
//     } catch (error) {
//         return handleError(error);
//     }
// }

// export async function PATCH(
//     request: NextRequest,
//     { params }: { params: { customerId: string } }
// ) {
//     try {
//         const body = await request.json();
//         const validatedData = updateCustomerSchema.parse({
//             ...body,
//             customer_id: params.customerId,
//         });
//         const result = await updateCustomerService(validatedData);
//         return NextResponse.json(result, { status: result.statusCode });
//     } catch (error) {
//         return handleError(error);
//     }
// }

// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { customerId: string } }
// ) {
//     try {
//         const result = await deleteCustomerService(params.customerId);
//         return NextResponse.json(result, { status: result.statusCode });
//     } catch (error) {
//         return handleError(error);
//     }
// }

import { NextRequest, NextResponse } from "next/server";
import {
    deleteCustomerService,
    getCustomerDetailService,
    updateCustomerService,
} from "@/services/customer-service";
import { handleError } from "@/lib/errors/error-handler";
import { updateCustomerSchema } from "@/validation/customer-validation";

export async function GET(
    request: NextRequest,
    { params }: { params: Record<string, string> }
) {
    try {
        const result = await getCustomerDetailService(params.customerId);
        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Record<string, string> }
) {
    try {
        const body = await request.json();
        const validatedData = updateCustomerSchema.parse({
            ...body,
            customer_id: params.customerId,
        });
        const result = await updateCustomerService(validatedData);
        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Record<string, string> }
) {
    try {
        const result = await deleteCustomerService(params.customerId);
        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}
