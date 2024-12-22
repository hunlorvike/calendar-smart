import { useState, useCallback, useMemo } from 'react';
import { Task } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent } from '@/types/calendar';
import axiosInstance from '@/lib/axios';
import { generateEvents } from '@/utils/calendar-utils';
import { startOfMonth, endOfMonth } from 'date-fns';

interface CalendarManagerState {
    tasks: Task[];
    isLoading: boolean;
    selectedEvent: CalendarEvent | null;
    currentDate: Date;
    showConflictsOnly: boolean;
}

export function useCalendarManager() {
    const { toast } = useToast();
    const [state, setState] = useState<CalendarManagerState>({
        tasks: [],
        isLoading: false,
        selectedEvent: null,
        currentDate: new Date(),
        showConflictsOnly: false,
    });

    const fetchTasks = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            const response = await axiosInstance.get('/tasks', {
                params: { all: true },
            });
            setState((prev) => ({ ...prev, tasks: response.data.data.items }));
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch tasks',
                variant: 'destructive',
                duration: 3000,
            });
        } finally {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [toast]);

    const events = useMemo(() => {
        const allEvents = generateEvents(
            state.tasks,
            startOfMonth(state.currentDate),
            endOfMonth(state.currentDate),
        );
        return state.showConflictsOnly
            ? allEvents.filter((event) => event.hasConflict)
            : allEvents;
    }, [state.tasks, state.currentDate, state.showConflictsOnly]);

    const selectEvent = useCallback((event: CalendarEvent | null) => {
        setState((prev) => ({ ...prev, selectedEvent: event }));
    }, []);

    const setCurrentDate = useCallback((date: Date) => {
        setState((prev) => ({ ...prev, currentDate: date }));
    }, []);

    const toggleShowConflictsOnly = useCallback(() => {
        setState((prev) => ({
            ...prev,
            showConflictsOnly: !prev.showConflictsOnly,
        }));
    }, []);

    return {
        ...state,
        events,
        fetchTasks,
        selectEvent,
        setCurrentDate,
        toggleShowConflictsOnly,
    };
}
