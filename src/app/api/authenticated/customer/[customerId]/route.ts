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

// GET Handler
export async function GET(
    request: NextRequest,
    context: { params: { customerId: string } }
) {
    try {
        const { customerId } = context.params; // Extract customerId
        const result = await getCustomerDetailService(customerId);
        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}

// PATCH Handler
export async function PATCH(
    request: NextRequest,
    context: { params: { customerId: string } }
) {
    try {
        const { customerId } = context.params; // Extract customerId
        const body = await request.json();
        const validatedData = updateCustomerSchema.parse({
            ...body,
            customer_id: customerId,
        });
        const result = await updateCustomerService(validatedData);
        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}

// DELETE Handler
export async function DELETE(
    request: NextRequest,
    context: { params: { customerId: string } }
) {
    try {
        const { customerId } = context.params; // Extract customerId
        const result = await deleteCustomerService(customerId);
        return NextResponse.json(result, { status: result.statusCode });
    } catch (error) {
        return handleError(error);
    }
}
