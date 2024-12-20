'use client';
import React from 'react';
import { EventWithConflict } from './calendar.type';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Clock, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

interface EventTooltipProps {
    event: EventWithConflict;
}

const EventTooltip: React.FC<EventTooltipProps> = ({ event }) => {
    return (
        <div className="p-4 w-80 space-y-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 text-white">
            {/* Header - Title & Priority */}
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base text-white">
                        {event.title}
                    </h3>
                    <div className="flex gap-1.5">
                        {event.isOverlapping && (
                            <Badge className="bg-red-500">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Conflict
                            </Badge>
                        )}
                        <PriorityBadge priority={event.priority} />
                    </div>
                </div>
                {event.description && (
                    <p className="text-sm text-gray-300">{event.description}</p>
                )}
            </div>

            {/* Time Details */}
            <div className="space-y-2 bg-gray-700 p-2.5 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100">
                        <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-100">
                        {format(new Date(event.start), 'EEEE, MMM d, yyyy')}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-100">
                        {format(new Date(event.start), 'HH:mm')} -
                        {format(new Date(event.end), 'HH:mm')}
                    </span>
                </div>
            </div>

            {/* Conflict Details */}
            {event.isOverlapping && event.overlappingWith.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-semibold text-sm">
                            Conflicts with {event.overlappingWith.length} other
                            task{event.overlappingWith.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <ScrollArea className="h-[120px] w-full">
                        <div className="space-y-2 pr-4">
                            {event.overlappingWith.map((conflict, index) => (
                                <div
                                    key={index}
                                    className="p-2.5 rounded-md bg-red-900 border-l-2 border-red-700"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="font-medium text-sm text-white">
                                                {conflict.title}
                                            </div>
                                            <div className="text-sm text-gray-300 flex items-center gap-1.5 mt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {format(
                                                    conflict.start,
                                                    'HH:mm',
                                                )}{' '}
                                                -{format(conflict.end, 'HH:mm')}
                                            </div>
                                        </div>
                                        <Badge className="bg-red-800 text-red-200 border-red-600">
                                            {format(conflict.end, 'HH:mm')}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}

            {/* Task Details */}
            <div className="pt-2 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="ml-1 font-medium text-gray-100">
                            {event.task.duration} mins
                        </span>
                    </div>
                    {event.task.repeat > 0 && (
                        <div>
                            <span className="text-gray-400">
                                Repeats every:
                            </span>
                            <span className="ml-1 font-medium text-gray-100">
                                {event.task.repeat} mins
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventTooltip;
