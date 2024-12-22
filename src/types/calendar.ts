import { Task } from '@prisma/client';

export interface BaseCalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

export interface CalendarEvent extends BaseCalendarEvent {
    task: Task;
    hasConflict: boolean;
}

export interface CalendarViewProps {
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
}

export interface TaskWithConflicts extends Task {
    conflicts: Task[];
}

export const PRIORITY_CONFIG = {
    HIGH: {
        color: '#EF4444',
        hoverColor: '#DC2626',
    },
    MEDIUM: {
        color: '#F59E0B',
        hoverColor: '#D97706',
    },
    LOW: {
        color: '#10B981',
        hoverColor: '#059669',
    },
} as const;

export interface CalendarEventInput extends Omit<BaseCalendarEvent, 'id'> {
    task: Task;
    hasConflict?: boolean;
}

export interface EventTooltipProps {
    event: CalendarEvent;
}

export type PriorityConfig = typeof PRIORITY_CONFIG;
