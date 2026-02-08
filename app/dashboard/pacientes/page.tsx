'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import {
    Search,
    Plus,
    ChevronDown,
    Phone,
    Mail,
    MoreHorizontal,
    Eye,
    FileText,
    Calendar,
    UserPlus,
    TrendingUp
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
        status: 'active',
        progress: 78
    },
    {
        id: 2,
        name: 'João Santos',
        email: 'joao@email.com',
        phone: '(11) 99999-2222',
        birthDate: '1985-08-22',
        sessions: 8,
        lastSession: '04/02/2026',
        status: 'active',
        progress: 65
    },
    {
        id: 3,
        name: 'Ana Costa',
        email: 'ana@email.com',
        phone: '(11) 99999-3333',
        birthDate: '1995-03-10',
        sessions: 1,
        lastSession: '07/02/2026',
        status: 'new',
        progress: 15
    },
    {
        id: 4,
        name: 'Carlos Lima',
        email: 'carlos@email.com',
        phone: '(11) 99999-4444',
        birthDate: '1988-12-01',
        sessions: 24,
        lastSession: '06/02/2026',
        status: 'active',
        progress: 92
    },
    {
        id: 5,
        name: 'Paula Souza',
        email: 'paula@email.com',
        phone: '(11) 99999-5555',
        birthDate: '1992-07-18',
        sessions: 6,
        lastSession: '01/02/2026',
        status: 'inactive',
        progress: 45
    },
]

const statusConfig = {
    active: { label: 'Ativo', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    new: { label: 'Novo', bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
    inactive: { label: 'Inativo', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
}

export default function PacientesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    const filteredPatients = mockPatients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === 'all' || patient.status === filterStatus
        return matchesSearch && matchesFilter
    })

    // Stats
    const totalPatients = mockPatients.length
    const activePatients = mockPatients.filter(p => p.status === 'active').length
    const newPatients = mockPatients.filter(p => p.status === 'new').length

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--gray-900)] tracking-tight">
                            Pacientes
                        </h1>
                        <p className="text-[var(--gray-500)] mt-1">
                            Gerencie seus pacientes e acompanhe o progresso
                        </p>
                    </div>
                    <Link
                        href="/dashboard/pacientes/novo"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg, var(--lavender-500) 0%, var(--lavender-600) 100%)' }}
                    >
                        <Plus className="w-5 h-5" />
                        Novo Paciente
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6 lg:hidden">
                    <div className="bg-white rounded-xl p-3 border border-[var(--gray-200)]">
                        <p className="text-xl font-bold text-[var(--lavender-600)]">{totalPatients}</p>
                        <p className="text-xs text-[var(--gray-500)]">Total</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[var(--gray-200)]">
                        <p className="text-xl font-bold text-emerald-600">{activePatients}</p>
                        <p className="text-xs text-[var(--gray-500)]">Ativos</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-[var(--gray-200)]">
                        <p className="text-xl font-bold text-sky-600">{newPatients}</p>
                        <p className="text-xs text-[var(--gray-500)]">Novos</p>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-[var(--gray-200)] bg-[var(--gray-50)] text-[var(--gray-900)] placeholder:text-[var(--gray-400)] focus:outline-none focus:border-[var(--lavender-400)] focus:ring-4 focus:ring-[var(--lavender-100)] transition-all"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 h-11 px-4 rounded-xl border border-[var(--gray-200)] bg-white text-[var(--gray-700)] hover:border-[var(--gray-300)] transition-colors"
                        >
                            <span className="text-sm font-medium">
                                {filterStatus === 'all' ? 'Todos' : statusConfig[filterStatus as keyof typeof statusConfig]?.label}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl border border-[var(--gray-200)] shadow-lg z-10 overflow-hidden">
                                {[
                                    { value: 'all', label: 'Todos' },
                                    { value: 'active', label: 'Ativos' },
                                    { value: 'new', label: 'Novos' },
                                    { value: 'inactive', label: 'Inativos' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => { setFilterStatus(option.value); setShowFilters(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${filterStatus === option.value
                                                ? 'bg-[var(--lavender-50)] text-[var(--lavender-700)] font-medium'
                                                : 'hover:bg-[var(--gray-50)] text-[var(--gray-700)]'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results count */}
                <div className="mt-3 pt-3 border-t border-[var(--gray-100)]">
                    <p className="text-sm text-[var(--gray-500)]">
                        <span className="font-medium text-[var(--gray-700)]">{filteredPatients.length}</span> paciente{filteredPatients.length !== 1 ? 's' : ''} encontrado{filteredPatients.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Patients List */}
            {filteredPatients.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--gray-100)] flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-[var(--gray-400)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-1">Nenhum paciente encontrado</h3>
                    <p className="text-[var(--gray-500)] mb-4">Tente ajustar os filtros ou adicione um novo paciente</p>
                    <Link
                        href="/dashboard/pacientes/novo"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--lavender-100)] text-[var(--lavender-700)] font-medium hover:bg-[var(--lavender-200)] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Paciente
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredPatients.map((patient) => {
                        const status = statusConfig[patient.status as keyof typeof statusConfig]

                        return (
                            <div
                                key={patient.id}
                                className="bg-white rounded-2xl border border-[var(--gray-200)] p-4 lg:p-5 hover:border-[var(--lavender-300)] hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Avatar & Info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {/* Avatar com indicador de progresso */}
                                        <div className="relative flex-shrink-0">
                                            <div
                                                className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-base lg:text-lg font-bold"
                                                style={{
                                                    background: `linear-gradient(135deg, var(--lavender-${patient.progress > 70 ? '200' : patient.progress > 40 ? '100' : '50'}) 0%, var(--sky-${patient.progress > 70 ? '200' : patient.progress > 40 ? '100' : '50'}) 100%)`,
                                                    color: `var(--lavender-${patient.progress > 70 ? '700' : patient.progress > 40 ? '600' : '500'})`
                                                }}
                                            >
                                                {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                            </div>
                                            {/* Progress ring */}
                                            <div
                                                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center"
                                                style={{ borderColor: patient.progress > 70 ? 'var(--success)' : patient.progress > 40 ? 'var(--warning)' : 'var(--gray-300)' }}
                                            >
                                                <TrendingUp className="w-2.5 h-2.5" style={{ color: patient.progress > 70 ? 'var(--success)' : patient.progress > 40 ? 'var(--warning)' : 'var(--gray-400)' }} />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-[var(--gray-900)] truncate">{patient.name}</h3>
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-[var(--gray-500)]">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="truncate">{patient.email}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {patient.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 lg:gap-8 pl-16 lg:pl-0">
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-[var(--lavender-600)]">{patient.sessions}</p>
                                            <p className="text-xs text-[var(--gray-500)]">Sessões</p>
                                        </div>
                                        <div className="text-center hidden sm:block">
                                            <p className="text-sm font-semibold text-[var(--gray-900)]">{patient.lastSession}</p>
                                            <p className="text-xs text-[var(--gray-500)]">Última sessão</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pl-16 lg:pl-0 lg:border-l lg:border-[var(--gray-200)] lg:ml-4 lg:pl-6">
                                        <Link
                                            href={`/dashboard/pacientes/${patient.id}`}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--lavender-100)] text-[var(--lavender-700)] hover:bg-[var(--lavender-200)] transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span className="hidden sm:inline">Ver Perfil</span>
                                        </Link>
                                        <Link
                                            href={`/dashboard/prontuario?paciente=${patient.id}`}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--gray-600)] hover:bg-[var(--gray-100)] transition-colors"
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span className="hidden sm:inline">Prontuário</span>
                                        </Link>
                                        <button className="p-2 rounded-xl text-[var(--gray-400)] hover:bg-[var(--gray-100)] hover:text-[var(--gray-600)] transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </DashboardLayout>
    )
}
