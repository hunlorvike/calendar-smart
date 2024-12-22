import React from 'react';
import { CalendarEvent, PRIORITY_CONFIG } from '@/types/calendar';
import { Badge } from '../ui/badge';
import { AlertCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/utils/cn-utils';

interface EventTooltipProps {
    event: CalendarEvent;
}

export const EventTooltip: React.FC<EventTooltipProps> = ({ event }) => {
    const priorityConfig = PRIORITY_CONFIG[event.task.priority];

    return (
        <div
            className={cn(
                'p-5 w-80 space-y-5 rounded-lg shadow-lg border',
                event.hasConflict
                    ? 'bg-red-800/90 border-red-600'
                    : 'bg-gray-800 border-gray-700',
            )}
        >
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg text-white truncate">
                        {event.title}
                    </h3>
                    <div className="flex gap-2">
                        <Badge
                            className={cn(
                                'px-2 py-1 rounded-md text-sm text-white',
                                priorityConfig.color,
                            )}
                        >
                            {event.task.priority}
                        </Badge>
                        {event.hasConflict && (
                            <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-sm px-2 py-1 rounded-md text-white font-semibold flex items-center gap-1 animate-pulse">
                                <AlertCircle className="w-4 h-4" />
                                Conflict
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Time Details Section */}
            <div
                className={cn(
                    'space-y-3 p-3 rounded-md',
                    event.hasConflict
                        ? 'bg-red-900/30 border border-red-600'
                        : 'bg-gray-700',
                )}
            >
                <DetailRow
                    icon={<CalendarIcon className="w-4 h-4 text-blue-600" />}
                    label={format(new Date(event.start), 'EEEE, MMM d, yyyy')}
                />
                <DetailRow
                    icon={<Clock className="w-4 h-4 text-blue-600" />}
                    label={`${format(new Date(event.start), 'HH:mm')} - ${format(
                        new Date(event.end),
                        'HH:mm',
                    )}`}
                />
            </div>

            {/* Task Details Section */}
            <div className="pt-3 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <InfoRow
                        label="Duration:"
                        value={`${event.task.duration} mins`}
                    />
                    {event.task.repeat > 0 && (
                        <InfoRow
                            label="Repeats:"
                            value={`Every ${event.task.repeat} mins`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const DetailRow: React.FC<{
    icon: React.ReactNode;
    label: string;
}> = ({ icon, label }) => (
    <div className="flex items-center gap-3 text-sm">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100">
            {icon}
        </div>
        <span className="font-medium text-gray-100">{label}</span>
    </div>
);

const InfoRow: React.FC<{
    label: string;
    value: string;
}> = ({ label, value }) => (
    <div>
        <span className="text-gray-400">{label}</span>
        <span className="ml-1 font-medium text-gray-100">{value}</span>
    </div>
);
