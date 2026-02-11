import React from 'react';
import { cn } from '@/lib/utils';

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("border rounded shadow p-4 bg-white", className)}>
            {children}
        </div>
    );
}
