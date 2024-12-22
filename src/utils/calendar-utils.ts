import { Task } from '@prisma/client';
import { CalendarEvent, TaskWithConflicts } from '@/types/calendar';
import {
    addMinutes,
    isBefore,
    isEqual,
    startOfDay,
    endOfDay,
    addDays,
} from 'date-fns';

export function generateEvents(
    tasks: Task[],
    startDate: Date,
    endDate: Date,
): CalendarEvent[] {
    const sortedTasks = tasks
        .map((task) => ({
            ...task,
            startTime:
                task.startTime instanceof Date
                    ? task.startTime
                    : new Date(task.startTime),
        }))
        .filter((task) => !isNaN(task.startTime.getTime()))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const allTasksWithConflicts: TaskWithConflicts[] = [];

    sortedTasks.forEach((task) => {
        let currentTaskStartTime = task.startTime;
        const periodEnd = addDays(endDate, 5);

        while (isBefore(currentTaskStartTime, periodEnd)) {
            if (isBefore(currentTaskStartTime, startDate)) {
                currentTaskStartTime = addMinutes(
                    currentTaskStartTime,
                    task.repeat || 24 * 60,
                );
                continue;
            }

            const newTask: TaskWithConflicts = {
                ...task,
                startTime: currentTaskStartTime,
                conflicts: [],
            };
            allTasksWithConflicts.push(newTask);

            currentTaskStartTime = addMinutes(
                currentTaskStartTime,
                task.repeat || 24 * 60,
            );
        }
    });

    const tasksWithConflicts = findConflicts(allTasksWithConflicts);

    return tasksWithConflicts
        .filter(
            (task) =>
                isEqual(startOfDay(task.startTime), startOfDay(startDate)) ||
                (isBefore(task.startTime, endOfDay(endDate)) &&
                    isEqual(startOfDay(task.startTime), startOfDay(endDate))) ||
                (isBefore(task.startTime, endDate) &&
                    isBefore(startDate, task.startTime)),
        )
        .map(
            (task): CalendarEvent => ({
                id: `${task.id}-${task.startTime.getTime()}`,
                title: task.title,
                start: task.startTime,
                end: addMinutes(task.startTime, task.duration),
                task,
                hasConflict: task.conflicts.length > 0,
            }),
        );
}

function findConflicts(tasks: TaskWithConflicts[]): TaskWithConflicts[] {
    return tasks.map((task) => {
        const conflicts = tasks.filter((otherTask) => {
            if (task.id === otherTask.id) return false;

            const taskEnd = addMinutes(task.startTime, task.duration);
            const otherTaskEnd = addMinutes(
                otherTask.startTime,
                otherTask.duration,
            );

            return (
                (isBefore(task.startTime, otherTaskEnd) &&
                    isBefore(otherTask.startTime, taskEnd)) ||
                isEqual(task.startTime, otherTask.startTime)
            );
        });

        return { ...task, conflicts };
    });
}
