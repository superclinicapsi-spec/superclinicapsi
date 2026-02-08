'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/ui/Card'
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Plus
} from 'lucide-react'
import Link from 'next/link'

// Dados mockados - depois conectar ao Supabase
const mockStats = {
    patientsActive: 24,
    appointmentsToday: 5,
    appointmentsWeek: 18,
    monthlyRevenue: 8750,
}

const mockTodayAppointments = [
    { id: 1, patient: 'Maria Silva', time: '09:00', status: 'confirmed', type: 'Sessão Individual' },
    { id: 2, patient: 'João Santos', time: '10:00', status: 'confirmed', type: 'Sessão Individual' },
    { id: 3, patient: 'Ana Costa', time: '14:00', status: 'pending', type: 'Primeira Consulta' },
    { id: 4, patient: 'Carlos Lima', time: '15:30', status: 'confirmed', type: 'Sessão Individual' },
    { id: 5, patient: 'Paula Souza', time: '17:00', status: 'confirmed', type: 'Terapia de Casal' },
]

const mockRecentPatients = [
    { id: 1, name: 'Fernanda Oliveira', lastSession: '05/02/2026', sessions: 12 },
    { id: 2, name: 'Roberto Mendes', lastSession: '04/02/2026', sessions: 8 },
    { id: 3, name: 'Lucia Ferreira', lastSession: '03/02/2026', sessions: 24 },
]

export default function DashboardPage() {
    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="page-title">Olá, Gabriela! 👋</h1>
                    <p className="page-subtitle">
                        Aqui está o resumo do seu dia
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/pacientes/novo" className="btn btn-secondary">
                        <Plus className="w-4 h-4" />
                        Novo Paciente
                    </Link>
                    <Link href="/dashboard/agenda/novo" className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Agendar Consulta
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Pacientes Ativos"
                    value={mockStats.patientsActive}
                    icon={<Users className="w-5 h-5 text-[var(--primary)]" />}
                    trend={{ value: 8, isPositive: true }}
                />
                <StatCard
                    title="Consultas Hoje"
                    value={mockStats.appointmentsToday}
                    icon={<Calendar className="w-5 h-5 text-[var(--primary)]" />}
                />
                <StatCard
                    title="Consultas na Semana"
                    value={mockStats.appointmentsWeek}
                    icon={<Clock className="w-5 h-5 text-[var(--primary)]" />}
                />
                <StatCard
                    title="Faturamento do Mês"
                    value={`R$ ${mockStats.monthlyRevenue.toLocaleString('pt-BR')}`}
                    icon={<TrendingUp className="w-5 h-5 text-[var(--primary)]" />}
                    trend={{ value: 12, isPositive: true }}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Today's Appointments */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Consultas de Hoje</h2>
                            <Link href="/dashboard/agenda" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                                Ver agenda
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {mockTodayAppointments.length === 0 ? (
                            <div className="empty-state">
                                <Calendar className="empty-state-icon" />
                                <p>Nenhuma consulta agendada para hoje</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {mockTodayAppointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--lavender-50)] dark:hover:bg-[var(--primary-light)] transition-colors"
                                    >
                                        {/* Time */}
                                        <div className="text-center min-w-[60px]">
                                            <p className="text-lg font-semibold">{appointment.time}</p>
                                        </div>

                                        {/* Status Indicator */}
                                        <div className={`w-1 h-12 rounded-full ${appointment.status === 'confirmed'
                                                ? 'bg-[var(--success)]'
                                                : 'bg-[var(--warning)]'
                                            }`} />

                                        {/* Info */}
                                        <div className="flex-1">
                                            <p className="font-medium">{appointment.patient}</p>
                                            <p className="text-sm text-muted">{appointment.type}</p>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`badge ${appointment.status === 'confirmed'
                                                ? 'badge-success'
                                                : 'badge-warning'
                                            }`}>
                                            {appointment.status === 'confirmed' ? (
                                                <><CheckCircle className="w-3 h-3" /> Confirmado</>
                                            ) : (
                                                <><AlertCircle className="w-3 h-3" /> Pendente</>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Patients */}
                <div>
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Pacientes Recentes</h2>
                            <Link href="/dashboard/pacientes" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                                Ver todos
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {mockRecentPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="flex items-center gap-3"
                                >
                                    <div className="avatar avatar-md">
                                        {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{patient.name}</p>
                                        <p className="text-sm text-muted">
                                            {patient.sessions} sessões • Última: {patient.lastSession}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card mt-6">
                        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/dashboard/prontuario"
                                className="p-4 rounded-lg bg-[var(--lavender-50)] dark:bg-[var(--primary-light)] text-center hover:bg-[var(--lavender-100)] transition-colors"
                            >
                                <DollarSign className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
                                <p className="text-sm font-medium">Prontuário</p>
                            </Link>
                            <Link
                                href="/dashboard/financeiro"
                                className="p-4 rounded-lg bg-[var(--lavender-50)] dark:bg-[var(--primary-light)] text-center hover:bg-[var(--lavender-100)] transition-colors"
                            >
                                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
                                <p className="text-sm font-medium">Financeiro</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
