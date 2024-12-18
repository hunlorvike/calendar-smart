'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Task } from '@/lib/types';
import { TaskModal } from '@/components/TaskModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CalendarPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        setTasks(storedTasks);
    }, []);

    const handleEventClick = (info: { event: { id: string } }) => {
        const task = tasks.find((t) => t.id.toString() === info.event.id);
        if (task) {
            setSelectedTask(task);
            setIsModalOpen(true);
        }
    };

    const events = tasks.map((task) => ({
        id: task.id.toString(),
        title: task.title,
        start: task.startTime,
        end: new Date(
            new Date(task.startTime).getTime() + task.duration * 60000,
        ).toISOString(),
        backgroundColor:
            task.priority === 'high'
                ? '#f87171'
                : task.priority === 'medium'
                  ? '#fb923c'
                  : '#4ade80',
        display: 'block',
        extendedProps: { description: task.description },
    }));

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleSaveTask = (updatedTask: Task) => {
        const updatedTasks = tasks.map((t) =>
            t.id === updatedTask.id ? updatedTask : t,
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        handleCloseModal();
    };

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
                    {selectedTask && (
                        <TaskModal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            task={selectedTask}
                            onSave={handleSaveTask}
                        />
                    )}
                </CardContent>
            </Card>
        </>
    );
}
