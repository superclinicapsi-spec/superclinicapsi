'use client';

import { LucideIcon } from 'lucide-react';

interface ReportCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'primary' | 'success' | 'warning' | 'info';
}

const colorClasses = {
    primary: 'bg-lavender-100 text-lavender-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-sky-100 text-sky-600',
};

export function ReportCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = 'primary',
}: ReportCardProps) {
    return (
        <div className="stat-card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-muted mb-1">{title}</p>
                    <p className="stat-card-value">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-muted mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-500'
                            }`}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                            <span className="text-muted">vs período anterior</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
