'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import {
    Users,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Plus,
    MoreHorizontal,
    FileText,
    DollarSign,
    Settings
} from 'lucide-react'
import Link from 'next/link'

// Mock data
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
    const currentDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                            Olá, Gabriela! 👋
                        </h1>
                        <p className="text-gray-500 mt-1 capitalize">
                            {currentDate}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/pacientes/novo"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Novo Paciente</span>
                        </Link>
                        <Link
                            href="/dashboard/agenda/novo"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" />
                            Agendar Consulta
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Pacientes */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            +8%
                        </span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900">{mockStats.patientsActive}</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">Pacientes Ativos</p>
                    </div>
                </div>

                {/* Hoje */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900">{mockStats.appointmentsToday}</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">Consultas Hoje</p>
                    </div>
                </div>

                {/* Semana */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900">{mockStats.appointmentsWeek}</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">Consultas na Semana</p>
                    </div>
                </div>

                {/* Faturamento */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl border border-gray-700 shadow-sm text-white">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-white/10 rounded-xl text-white">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                            +12%
                        </span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">R$ {mockStats.monthlyRevenue.toLocaleString('pt-BR')}</p>
                        <p className="text-sm text-gray-400 font-medium mt-1">Faturamento Mês</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Today's Appointments */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Agenda de Hoje</h2>
                            <Link href="/dashboard/agenda" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                Ver completa
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="p-4">
                            {mockTodayAppointments.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Calendar className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">Nenhuma consulta hoje</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {mockTodayAppointments.map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/50 transition-all group"
                                        >
                                            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gray-50 text-gray-900 font-bold border border-gray-200 group-hover:border-purple-200 group-hover:bg-white transition-colors">
                                                <span className="text-sm">{appointment.time}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-semibold text-gray-900 truncate">{appointment.patient}</p>
                                                    {appointment.status === 'confirmed' ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Confirmado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Pendente
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{appointment.type}</p>
                                            </div>

                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/dashboard/prontuario"
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <FileText className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Prontuário</span>
                            </Link>
                            <Link
                                href="/dashboard/financeiro"
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <DollarSign className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Financeiro</span>
                            </Link>
                            <Link
                                href="/dashboard/sessoes"
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Clock className="w-5 h-5 text-gray-600 group-hover:text-pink-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-700">Sessão ABA</span>
                            </Link>
                            <Link
                                href="/dashboard/configuracoes"
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Ajustes</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Patients */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Pacientes Recentes</h2>
                            <Link href="/dashboard/pacientes" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                                Ver todos
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {mockRecentPatients.map((patient) => (
                                <Link
                                    key={patient.id}
                                    href={`/dashboard/pacientes/${patient.id}`}
                                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                                        {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{patient.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Última: {patient.lastSession}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
