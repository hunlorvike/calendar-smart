'use client';

import { useEffect } from 'react';
import { useCalendarManager } from '@/hooks/use-calendar-manager';
import { CalendarView } from '@/components/calendar/calendar-view';
import { TaskModal } from '@/components/tasks/task-modal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalendarPage() {
    const { events, isLoading, selectedEvent, fetchTasks, selectEvent } =
        useCalendarManager();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (isLoading && events.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Calendar
                            </h1>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CalendarView events={events} onEventClick={selectEvent} />
                </CardContent>
            </Card>

            <TaskModal
                isOpen={selectedEvent !== null}
                mode="view"
                onClose={() => selectEvent(null)}
                task={selectedEvent?.task}
            />
        </div>
    );
}
