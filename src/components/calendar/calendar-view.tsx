import { useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
    CalendarViewProps,
    CalendarEvent,
    PRIORITY_CONFIG,
} from '@/types/calendar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { EventTooltip } from './event-tooltip';

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
    const renderEventContent = useCallback(
        (info: { event: any }) => {
            const event = events.find(
                (e) => e.id === info.event.id,
            ) as CalendarEvent;

            const priorityConfig = PRIORITY_CONFIG[event.task.priority];

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="w-full h-full p-1 rounded-md cursor-pointer relative group"
                                style={{
                                    backgroundColor: priorityConfig.color,
                                    border: event.hasConflict
                                        ? '2px solid #DC2626'
                                        : 'none',
                                    transition: 'all 0.3s',
                                }}
                            >
                                <div className="flex items-center justify-between gap-1 text-xs text-white font-medium truncate">
                                    <span>{info.event.title}</span>
                                    {event.hasConflict && <span>⚠️</span>}
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="text-white text-xs font-medium">
                                        Click for details
                                    </span>
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
                </TooltipProvider>
            );
        },
        [events],
    );

    const handleEventClick = useCallback(
        (info: { event: any }) => {
            const event = events.find((e) => e.id === info.event.id);
            if (event) {
                onEventClick(event);
            }
        },
        [events, onEventClick],
    );

    return (
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
            eventClassNames="cursor-pointer !bg-transparent border-0"
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            eventDisplay="block"
            eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short',
            }}
            eventOverlap={false}
            eventBackgroundColor="transparent"
            eventBorderColor="transparent"
            slotEventOverlap={false}
        />
    );
}
