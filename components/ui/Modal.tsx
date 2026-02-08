'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    footer?: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}: ModalProps) {
    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    return (
        <div
            className="modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={`modal ${sizeClasses[size]}`}>
                {title && (
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-icon p-1.5 hover:bg-[var(--lavender-100)]"
                            aria-label="Fechar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

// Confirm Dialog variant
interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'primary'
    isLoading?: boolean
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'primary',
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-muted">{message}</p>
        </Modal>
    )
}
