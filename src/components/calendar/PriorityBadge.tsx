'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Priority } from './calendar.type';

interface PriorityBadgeProps {
    priority: Priority;
    isConflict?: boolean;
}

const COLORS = {
    priority: {
        HIGH: {
            bg: '#DC2626',
            hover: '#B91C1C',
            badge: 'bg-red-600 hover:bg-red-700',
            text: 'white',
        },
        MEDIUM: {
            bg: '#EA580C',
            hover: '#C2410C',
            badge: 'bg-orange-600 hover:bg-orange-700',
            text: 'white',
        },
        LOW: {
            bg: '#16A34A',
            hover: '#15803D',
            badge: 'bg-green-600 hover:bg-green-700',
            text: 'white',
        },
    },
    conflict: {
        bg: '#7F1D1D',
        hover: '#991B1B',
        badge: 'bg-red-900 hover:bg-red-950',
        border: 'border-red-700',
        text: 'text-red-700',
    },
};

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
    priority,
    isConflict,
}) => {
    const getColorClasses = () => {
        if (isConflict) return COLORS.conflict.badge;
        return (
            COLORS.priority[priority]?.badge ||
            'bg-slate-600 hover:bg-slate-700'
        );
    };

    return (
        <Badge className={`${getColorClasses()} text-white font-medium`}>
            {isConflict ? 'CONFLICT' : priority}
        </Badge>
    );
};

export default PriorityBadge;
