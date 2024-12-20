import prisma from '@/lib/prisma';
import { createApiResponse } from '@/lib/types';
import { validateToken } from '@/utils/jwt';

export async function PUT(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const userId = await validateToken(req);
        if (!userId) return createApiResponse(null, 'Unauthorized.', 401);

        const taskId = parseInt(params.id);
        const task = await prisma.task.findUnique({ where: { id: taskId } });

        if (!task) {
            return createApiResponse(null, 'Task not found.', 404);
        }

        if (task.userId !== userId) {
            return createApiResponse(
                null,
                'Unauthorized to modify this task.',
                403,
            );
        }

        const { title, description, startTime, duration, repeat, priority } =
            await req.json();

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title,
                description,
                startTime: new Date(startTime),
                duration,
                repeat,
                priority,
            },
        });

        return createApiResponse(
            updatedTask,
            'Task updated successfully.',
            200,
        );
    } catch (error) {
        console.error('Task update error:', error);
        return createApiResponse(
            null,
            'An error occurred while updating the task.',
            500,
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const userId = await validateToken(req);
        if (!userId) return createApiResponse(null, 'Unauthorized.', 401);

        const taskId = parseInt(params.id);
        const task = await prisma.task.findUnique({ where: { id: taskId } });

        if (!task) {
            return createApiResponse(null, 'Task not found.', 404);
        }

        if (task.userId !== userId) {
            return createApiResponse(
                null,
                'Unauthorized to delete this task.',
                403,
            );
        }

        await prisma.task.delete({ where: { id: taskId } });
        return createApiResponse(null, 'Task deleted successfully.', 200);
    } catch (error) {
        console.error('Task deletion error:', error);
        return createApiResponse(
            null,
            'An error occurred while deleting the task.',
            500,
        );
    }
}
