'use client';

import * as React from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/utils/cn-utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';

export function DateTimePicker24h({
    onChange,
    defaultDate,
    disabled = false,
}: {
    onChange?: (date: Date | undefined) => void;
    defaultDate?: Date;
    disabled?: boolean;
}) {
    const [date, setDate] = React.useState<Date | undefined>(defaultDate);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            onChange?.(selectedDate);
        }
    };

    const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
        if (date) {
            const newDate = new Date(date);
            if (type === 'hour') {
                newDate.setHours(parseInt(value));
            } else if (type === 'minute') {
                newDate.setMinutes(parseInt(value));
            }
            setDate(newDate);
            onChange?.(newDate);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, 'MM/dd/yyyy hh:mm')
                    ) : (
                        <span>MM/DD/YYYY hh:mm</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 24 }, (_, i) => i).map(
                                    (hour) => (
                                        <Button
                                            key={hour}
                                            size="icon"
                                            variant={
                                                date?.getHours() === hour
                                                    ? 'default'
                                                    : 'ghost'
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange(
                                                    'hour',
                                                    hour.toString(),
                                                )
                                            }
                                            disabled={disabled}
                                        >
                                            {hour}
                                        </Button>
                                    ),
                                )}
                            </div>
                            <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                            />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from(
                                    { length: 12 },
                                    (_, i) => i * 5,
                                ).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={
                                            date?.getMinutes() === minute
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() =>
                                            handleTimeChange(
                                                'minute',
                                                minute.toString(),
                                            )
                                        }
                                        disabled={disabled}
                                    >
                                        {minute.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                            />
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
