'use client';
import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import { Task } from '@prisma/client';
import { TaskModal } from '@/components/TaskModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import axiosInstance from '@/utils/axios';
import { EventWithConflict } from '@/components/calendar/calendar.type';
import { generateEvents, COLORS } from '@/components/calendar/CalendarConfig';
import EventTooltip from '@/components/calendar/EventTooltip';
import dayGridPlugin from '@fullcalendar/daygrid';

interface CalendarState {
    isModalOpen: boolean;
    selectedEvent: EventWithConflict | null;
    tasks: Task[];
    isLoading: boolean;
}

export default function CalendarPage() {
    const { toast } = useToast();
    const [state, setState] = useState<CalendarState>({
        isModalOpen: false,
        selectedEvent: null,
        tasks: [],
        isLoading: true,
    });

    const fetchTasks = async () => {
        try {
            setState((prev) => ({ ...prev, isLoading: true }));
            const response = await axiosInstance.get('/tasks', {
                params: { all: true },
            });
            setState((prev) => ({
                ...prev,
                tasks: response.data.data.items,
                isLoading: false,
            }));
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            toast({
                description:
                    error?.response?.data?.message || 'Failed to fetch tasks',
                variant: 'destructive',
            });
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleEventClick = (info: {
        event: { id: string; extendedProps: any };
    }) => {
        const eventId = info.event.id;
        const selectedEvent = events.find((e) => e.id === eventId);
        if (selectedEvent) {
            setState((prev) => ({
                ...prev,
                selectedEvent,
                isModalOpen: true,
            }));
        }
    };

    const handleCloseModal = () => {
        setState((prev) => ({
            ...prev,
            isModalOpen: false,
            selectedEvent: null,
        }));
    };

    const events = useMemo(() => generateEvents(state.tasks), [state.tasks]);

    if (state.isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center min-h-[400px]">
                    <div className="text-muted-foreground">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Calendar
                            </h1>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: COLORS.conflict.bg,
                                        }}
                                    ></div>
                                    <span className="font-medium">
                                        Conflicts
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                COLORS.priority.HIGH.bg,
                                        }}
                                    ></div>
                                    <span>High Priority</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                COLORS.priority.MEDIUM.bg,
                                        }}
                                    ></div>
                                    <span>Medium Priority</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                COLORS.priority.LOW.bg,
                                        }}
                                    ></div>
                                    <span>Low Priority</span>
                                </div>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                start: 'prev',
                                center: 'title',
                                end: 'next',
                            }}
                            fixedWeekCount={false}
                            showNonCurrentDates={false}
                            dayMaxEvents={4}
                            eventClassNames="cursor-pointer"
                            events={events}
                            eventClick={handleEventClick}
                            eventContent={(info) => {
                                const event = events.find(
                                    (e) => e.id === info.event.id,
                                );
                                if (!event) return null;

                                return (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-full h-full p-1">
                                                <div className="text-xs font-medium truncate">
                                                    {info.event.title}
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            align="start"
                                            className="z-[100]"
                                        >
                                            <EventTooltip event={event} />
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }}
                        />
                    </TooltipProvider>
                </CardContent>
            </Card>

            <TaskModal
                isOpen={state.isModalOpen}
                onClose={handleCloseModal}
                task={state.selectedEvent?.task}
                viewOnly={true}
            />
        </>
    );
}
