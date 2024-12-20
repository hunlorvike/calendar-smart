import prisma from '@/lib/prisma';
import { createApiResponse } from '@/lib/types';
import { validateToken } from '@/utils/jwt';
import { Priority } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const userId = await validateToken(req);
        if (!userId) return createApiResponse(null, 'Unauthorized.', 401);

        const { title, description, startTime, duration, repeat, priority } =
            await req.json();

        if (!title || !description || !startTime || !duration || !priority) {
            return createApiResponse(null, 'Missing required fields.', 400);
        }

        if (!Object.values(Priority).includes(priority)) {
            return createApiResponse(null, 'Invalid priority value.', 400);
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                duration,
                repeat,
                priority,
                userId,
            },
        });

        return createApiResponse(task, 'Task created successfully.', 201);
    } catch (error) {
        console.error('Task creation error:', error);
        return createApiResponse(
            null,
            'An error occurred while creating the task.',
            500,
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = await validateToken(req);
        if (!userId) return createApiResponse(null, 'Unauthorized.', 401);

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
        const getAllTasks = url.searchParams.get('all') === 'true';

        if (getAllTasks) {
            const tasks = await prisma.task.findMany({
                where: { userId },
                orderBy: { startTime: 'asc' },
            });

            return createApiResponse(
                {
                    items: tasks,
                    totalPages: 1,
                },
                'All tasks fetched successfully.',
                200,
            );
        }

        const skip = (page - 1) * pageSize;

        const [tasks, totalTasks] = await Promise.all([
            prisma.task.findMany({
                where: { userId },
                skip,
                take: pageSize,
                orderBy: { startTime: 'asc' },
            }),
            prisma.task.count({ where: { userId } }),
        ]);

        return createApiResponse(
            {
                items: tasks,
                totalPages: Math.ceil(totalTasks / pageSize),
            },
            'Tasks fetched successfully.',
            200,
        );
    } catch (error) {
        console.error('Task fetch error:', error);
        return createApiResponse(
            { items: [], totalPages: 0 },
            'An error occurred while fetching tasks.',
            500,
        );
    }
}
