import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventWithConflict } from './calendar.type';
import { areIntervalsOverlapping, isWithinInterval } from 'date-fns';

export const COLORS = {
    priority: {
        HIGH: {
            bg: '#DC2626',
        },
        MEDIUM: {
            bg: '#EA580C',
        },
        LOW: {
            bg: '#16A34A',
        },
    },
    conflict: {
        bg: '#7F1D1D',
    },
};

export const generateEvents = (tasks: any[]): EventWithConflict[] => {
    const allEvents: EventWithConflict[] = [];

    tasks.forEach((task) => {
        const {
            startTime: start,
            duration,
            repeat,
            title,
            priority,
            description,
            id,
        } = task;
        const startTime = new Date(start);
        const endOfWeek = new Date(startTime);
        endOfWeek.setDate(startTime.getDate() + 7);

        let currentStart = new Date(startTime);

        while (currentStart <= endOfWeek) {
            const currentEnd = new Date(
                currentStart.getTime() + duration * 60000,
            );

            const overlappingEvents = allEvents.filter((event) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);

                return (
                    areIntervalsOverlapping(
                        { start: currentStart, end: currentEnd },
                        { start: eventStart, end: eventEnd },
                        { inclusive: true },
                    ) ||
                    isWithinInterval(currentStart, {
                        start: eventStart,
                        end: eventEnd,
                    }) ||
                    isWithinInterval(currentEnd, {
                        start: eventStart,
                        end: eventEnd,
                    })
                );
            });

            const isOverlapping = overlappingEvents.length > 0;
            const eventId = `${id}-${currentStart.getTime()}`;

            const overlappingDetails = overlappingEvents.map((event) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.start),
                end: new Date(event.end),
            }));

            allEvents.push({
                id: eventId,
                title: `${title}${isOverlapping ? ' ⚠️' : ''}`,
                start: currentStart.toISOString(),
                end: currentEnd.toISOString(),
                backgroundColor: isOverlapping
                    ? COLORS.conflict.bg
                    : COLORS.priority[priority as keyof typeof COLORS.priority]
                          ?.bg,
                display: 'block',
                isOverlapping,
                overlappingWith: overlappingDetails,
                task,
                description,
                priority,
            });

            currentStart = new Date(currentStart.getTime() + repeat * 60000);
        }
    });

    return allEvents;
};
