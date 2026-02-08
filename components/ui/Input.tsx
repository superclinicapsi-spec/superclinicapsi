'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, required, className = '', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`

        return (
            <div className="input-group">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`label ${required ? 'label-required' : ''}`}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`input-field ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                />
                {error && <p className="error-message">{error}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    required?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, required, className = '', id, ...props }, ref) => {
        const inputId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`

        return (
            <div className="input-group">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`label ${required ? 'label-required' : ''}`}
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={`input-field textarea-field ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                />
                {error && <p className="error-message">{error}</p>}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'

// Select variant
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    required?: boolean
    options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, required, options, className = '', id, ...props }, ref) => {
        const inputId = id || `select-${Math.random().toString(36).slice(2, 9)}`

        return (
            <div className="input-group">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`label ${required ? 'label-required' : ''}`}
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={inputId}
                    className={`input-field select-field ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="error-message">{error}</p>}
            </div>
        )
    }
)

Select.displayName = 'Select'
