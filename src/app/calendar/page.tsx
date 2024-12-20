'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Task } from '@prisma/client';
import { TaskModal } from '@/components/TaskModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/utils/axios';

export default function CalendarPage() {
    const { toast } = useToast();
    const [state, setState] = useState({
        isModalOpen: false,
        selectedTask: null as Task | null,
        tasks: [] as Task[],
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

    const handleEventClick = (info: { event: { id: string } }) => {
        const task = state.tasks.find((t) => t.id.toString() === info.event.id);
        if (task) {
            setState((prev) => ({
                ...prev,
                selectedTask: task,
                isModalOpen: true,
            }));
        }
    };

    const handleCloseModal = () => {
        setState((prev) => ({
            ...prev,
            isModalOpen: false,
            selectedTask: null,
        }));
    };

    const handleSaveTask = async (
        task: Omit<Task, 'id'> & Partial<Pick<Task, 'id'>>,
    ) => {
        try {
            if (state.selectedTask) {
                await axiosInstance.put(
                    `/tasks/${state.selectedTask.id}`,
                    task,
                );
                toast({ description: 'Task updated successfully' });
            } else {
                await axiosInstance.post('/tasks', task);
                toast({ description: 'Task created successfully' });
            }
            fetchTasks();
            handleCloseModal();
        } catch (error: any) {
            toast({
                description:
                    error?.response?.data?.message || 'Failed to save task',
                variant: 'destructive',
            });
        }
    };

    const events = state.tasks.map((task) => ({
        id: task.id.toString(),
        title: task.title,
        start: task.startTime,
        end: new Date(
            new Date(task.startTime).getTime() + task.duration * 60000,
        ).toISOString(),
        backgroundColor:
            task.priority === 'HIGH'
                ? '#f87171'
                : task.priority === 'MEDIUM'
                  ? '#fb923c'
                  : '#4ade80',
        display: 'block',
        extendedProps: { description: task.description },
    }));

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
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Calendar
                        </h1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <FullCalendar
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        initialView="timeGridWeek"
                        events={events}
                        eventClick={handleEventClick}
                        allDaySlot={false}
                        contentHeight="auto"
                        slotDuration="00:15:00"
                        slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }}
                        eventClassNames="h-5"
                    />
                </CardContent>
            </Card>

            {/* Task Modal for viewing/editing events */}
            <TaskModal
                isOpen={state.isModalOpen}
                onClose={handleCloseModal}
                task={state.selectedTask}
                onSave={handleSaveTask}
            />
        </>
    );
}
