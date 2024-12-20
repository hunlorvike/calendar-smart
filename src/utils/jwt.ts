import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const verifyToken = (
    token: string,
): { id: number; username: string } => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as {
            id: number;
            username: string;
        };
    } catch (error) {
        console.error(error);
        throw new Error('Invalid or expired token.');
    }
};

export const createToken = (userId: number, username: string): string => {
    return jwt.sign(
        { id: userId, username: username },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' },
    );
};

export async function validateToken(
    req: NextRequest | Request,
): Promise<number | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = verifyToken(token);
        return decoded.id;
    } catch {
        return null;
    }
}
