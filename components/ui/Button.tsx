'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    children: ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
    }

    const sizeClasses = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    }

    return (
        <button
            className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="spinner" style={{ width: '1rem', height: '1rem' }} />
            ) : leftIcon ? (
                <span className="btn-icon-left">{leftIcon}</span>
            ) : null}
            {children}
            {rightIcon && !isLoading && (
                <span className="btn-icon-right">{rightIcon}</span>
            )}
        </button>
    )
}
