'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Phone,
    Mail,
    Calendar,
    User
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockPatients = [
    {
        id: 1,
        name: 'Maria Silva',
        email: 'maria@email.com',
        phone: '(11) 99999-1111',
        birthDate: '1990-05-15',
        sessions: 12,
        lastSession: '05/02/2026',
        status: 'active'
    },
    {
        id: 2,
        name: 'João Santos',
        email: 'joao@email.com',
        phone: '(11) 99999-2222',
        birthDate: '1985-08-22',
        sessions: 8,
        lastSession: '04/02/2026',
        status: 'active'
    },
    {
        id: 3,
        name: 'Ana Costa',
        email: 'ana@email.com',
        phone: '(11) 99999-3333',
        birthDate: '1995-03-10',
        sessions: 1,
        lastSession: '07/02/2026',
        status: 'new'
    },
    {
        id: 4,
        name: 'Carlos Lima',
        email: 'carlos@email.com',
        phone: '(11) 99999-4444',
        birthDate: '1988-12-01',
        sessions: 24,
        lastSession: '06/02/2026',
        status: 'active'
    },
    {
        id: 5,
        name: 'Paula Souza',
        email: 'paula@email.com',
        phone: '(11) 99999-5555',
        birthDate: '1992-07-18',
        sessions: 6,
        lastSession: '01/02/2026',
        status: 'inactive'
    },
]

export default function PacientesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    const filteredPatients = mockPatients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === 'all' || patient.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="badge badge-success">Ativo</span>
            case 'new':
                return <span className="badge badge-primary">Novo</span>
            case 'inactive':
                return <span className="badge badge-neutral">Inativo</span>
            default:
                return null
        }
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="page-title">Pacientes</h1>
                    <p className="page-subtitle">
                        Gerencie seus pacientes e seus dados
                    </p>
                </div>
                <Link href="/dashboard/pacientes/novo" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    Novo Paciente
                </Link>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                        <input
                            type="text"
                            placeholder="Buscar paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[var(--foreground-muted)]" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input-field select-field w-auto"
                        >
                            <option value="all">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="new">Novos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Patients List */}
            {filteredPatients.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <User className="empty-state-icon" />
                        <p className="font-medium mb-1">Nenhum paciente encontrado</p>
                        <p className="text-sm">Tente ajustar os filtros ou adicione um novo paciente</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPatients.map((patient) => (
                        <div
                            key={patient.id}
                            className="card card-interactive flex flex-col md:flex-row md:items-center gap-4"
                        >
                            {/* Avatar & Basic Info */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className="avatar avatar-lg">
                                    {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{patient.name}</h3>
                                        {getStatusBadge(patient.status)}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-3.5 h-3.5" />
                                            {patient.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3.5 h-3.5" />
                                            {patient.phone}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <p className="font-semibold text-lg">{patient.sessions}</p>
                                    <p className="text-muted">Sessões</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold">{patient.lastSession}</p>
                                    <p className="text-muted">Última sessão</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/dashboard/pacientes/${patient.id}`}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Ver Perfil
                                </Link>
                                <Link
                                    href={`/dashboard/prontuario?paciente=${patient.id}`}
                                    className="btn btn-ghost btn-sm"
                                >
                                    Prontuário
                                </Link>
                                <button className="btn btn-ghost btn-icon">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}
