import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { ApiResponse } from '@/lib/types';

export async function POST(req: NextRequest): Promise<Response> {
    try {
        const { username, password } = await req.json();
        if (!username || !password) {
            const response: ApiResponse<null> = {
                success: false,
                message: 'Username and password are required',
            };
            return new Response(JSON.stringify(response), { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            const response: ApiResponse<null> = {
                success: false,
                message: 'Invalid username or password',
            };
            return new Response(JSON.stringify(response), { status: 401 });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1h',
            },
        );

        const response: ApiResponse<{ token: string }> = {
            success: true,
            message: 'Login successful',
            data: { token },
        };

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        const response: ApiResponse<null> = {
            success: false,
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}
