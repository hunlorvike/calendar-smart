import { NextResponse } from 'next/server';

export interface Response<T = any> {
    data: T;
    succeed: boolean;
    statusCode: number;
    message: string;
}

export interface PaginatedData<T = any> {
    items: T[];
    totalPages: number;
}

export type PaginatedResponse<T = any> = Response<PaginatedData<T>>;

export function createApiResponse<T>(
    data: T,
    message: string,
    statusCode: number,
): NextResponse {
    const response: Response<T> = {
        data,
        succeed: statusCode >= 200 && statusCode < 300,
        statusCode,
        message,
    };
    return NextResponse.json(response, { status: statusCode });
}
