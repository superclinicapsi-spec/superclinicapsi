'use client';

import { Plus } from 'lucide-react';

export default function QuickActions() {
    const actions = [
        { label: 'Nova Sessão', href: '/aba/session/new' },
        { label: 'Agendar', href: '/schedule/new' },
        { label: 'Nota SOAP', href: '/patients' },
        { label: 'Adicionar Paciente', href: '/patients/new' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
                <button
                    key={action.label}
                    className="btn btn-secondary text-sm"
                >
                    <Plus className="w-4 h-4" />
                    {action.label}
                </button>
            ))}
        </div>
    );
}
