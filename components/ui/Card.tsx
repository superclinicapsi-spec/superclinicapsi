'use client'

import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    variant?: 'default' | 'glass' | 'interactive' | 'stat'
    onClick?: () => void
}

export function Card({
    children,
    className = '',
    variant = 'default',
    onClick
}: CardProps) {
    const variantClasses = {
        default: 'card',
        glass: 'card-glass',
        interactive: 'card card-interactive',
        stat: 'stat-card',
    }

    return (
        <div
            className={`${variantClasses[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

// Card Header
interface CardHeaderProps {
    children: ReactNode
    className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            {children}
        </div>
    )
}

// Card Title
interface CardTitleProps {
    children: ReactNode
    className?: string
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
    return (
        <h3 className={`text-lg font-semibold ${className}`}>
            {children}
        </h3>
    )
}

// Card Content
interface CardContentProps {
    children: ReactNode
    className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

// Stat Card specific
interface StatCardProps {
    title: string
    value: string | number
    icon?: ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
    onClick?: () => void
}

export function StatCard({
    title,
    value,
    icon,
    trend,
    className = '',
    onClick
}: StatCardProps) {
    return (
        <div
            className={`stat-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted mb-1">{title}</p>
                    <p className="stat-card-value">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-2 rounded-lg bg-[var(--primary-light)]">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}
