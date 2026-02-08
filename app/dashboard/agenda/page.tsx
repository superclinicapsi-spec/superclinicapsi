'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    User,
    CheckCircle,
    AlertCircle,
    X as XIcon
} from 'lucide-react'

// Mock data
const mockAppointments = [
    { id: 1, patient: 'Maria Silva', time: '09:00', duration: 60, status: 'confirmed', type: 'Sessão Individual', day: 7 },
    { id: 2, patient: 'João Santos', time: '10:00', duration: 60, status: 'confirmed', type: 'Sessão Individual', day: 7 },
    { id: 3, patient: 'Ana Costa', time: '14:00', duration: 60, status: 'pending', type: 'Primeira Consulta', day: 7 },
    { id: 4, patient: 'Carlos Lima', time: '15:30', duration: 60, status: 'confirmed', type: 'Sessão Individual', day: 7 },
    { id: 5, patient: 'Paula Souza', time: '17:00', duration: 90, status: 'confirmed', type: 'Terapia de Casal', day: 7 },
    { id: 6, patient: 'Roberto Mendes', time: '09:00', duration: 60, status: 'confirmed', type: 'Sessão Individual', day: 8 },
    { id: 7, patient: 'Lucia Ferreira', time: '11:00', duration: 60, status: 'cancelled', type: 'Sessão Individual', day: 8 },
]

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function AgendaPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 7)) // 7 de fevereiro de 2026
    const [view, setView] = useState<'week' | 'day'>('week')
    const [selectedDay, setSelectedDay] = useState(7)

    const getWeekDays = () => {
        const start = new Date(currentDate)
        start.setDate(start.getDate() - start.getDay())

        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start)
            day.setDate(start.getDate() + i)
            return {
                date: day.getDate(),
                dayName: weekDays[i],
                isToday: day.getDate() === 7 && day.getMonth() === 1,
                appointments: mockAppointments.filter(a => a.day === day.getDate())
            }
        })
    }

    const getDayAppointments = () => {
        return mockAppointments.filter(a => a.day === selectedDay)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-[var(--success)]'
            case 'pending': return 'bg-[var(--warning)]'
            case 'cancelled': return 'bg-[var(--error)]'
            default: return 'bg-[var(--slate-300)]'
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Confirmado</span>
            case 'pending':
                return <span className="badge badge-warning"><AlertCircle className="w-3 h-3" /> Pendente</span>
            case 'cancelled':
                return <span className="badge badge-error"><XIcon className="w-3 h-3" /> Cancelado</span>
            default:
                return null
        }
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="page-title">Agenda</h1>
                    <p className="page-subtitle">
                        Gerencie suas consultas e horários
                    </p>
                </div>
                <button className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    Nova Consulta
                </button>
            </div>

            {/* Calendar Header */}
            <div className="card mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                const newDate = new Date(currentDate)
                                newDate.setDate(newDate.getDate() - 7)
                                setCurrentDate(newDate)
                            }}
                            className="btn btn-ghost btn-icon"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold">
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button
                            onClick={() => {
                                const newDate = new Date(currentDate)
                                newDate.setDate(newDate.getDate() + 7)
                                setCurrentDate(newDate)
                            }}
                            className="btn btn-ghost btn-icon"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setView('week')}
                            className={`btn btn-sm ${view === 'week' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => setView('day')}
                            className={`btn btn-sm ${view === 'day' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            Dia
                        </button>
                    </div>
                </div>
            </div>

            {view === 'week' ? (
                /* Week View */
                <div className="grid grid-cols-7 gap-2">
                    {getWeekDays().map((day, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedDay(day.date)
                                setView('day')
                            }}
                            className={`card cursor-pointer min-h-[200px] ${day.isToday ? 'ring-2 ring-[var(--primary)]' : ''
                                }`}
                        >
                            <div className={`text-center mb-3 pb-3 border-b border-[var(--border)] ${day.isToday ? 'text-[var(--primary)]' : ''
                                }`}>
                                <p className="text-sm text-muted">{day.dayName}</p>
                                <p className={`text-2xl font-bold ${day.isToday ? 'text-[var(--primary)]' : ''}`}>
                                    {day.date}
                                </p>
                            </div>

                            <div className="space-y-2">
                                {day.appointments.slice(0, 3).map((apt) => (
                                    <div
                                        key={apt.id}
                                        className={`p-2 rounded-lg text-xs ${apt.status === 'cancelled'
                                                ? 'bg-[var(--slate-100)] line-through opacity-60'
                                                : 'bg-[var(--primary-light)]'
                                            }`}
                                    >
                                        <p className="font-medium">{apt.time}</p>
                                        <p className="truncate">{apt.patient}</p>
                                    </div>
                                ))}
                                {day.appointments.length > 3 && (
                                    <p className="text-xs text-center text-muted">
                                        +{day.appointments.length - 3} mais
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Day View */
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">
                            Dia {selectedDay} de {months[currentDate.getMonth()]}
                        </h3>
                        <button
                            onClick={() => setView('week')}
                            className="btn btn-secondary btn-sm"
                        >
                            Voltar para Semana
                        </button>
                    </div>

                    {getDayAppointments().length === 0 ? (
                        <div className="empty-state">
                            <Clock className="empty-state-icon" />
                            <p>Nenhuma consulta agendada para este dia</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {getDayAppointments().map((apt) => (
                                <div
                                    key={apt.id}
                                    className={`flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] ${apt.status === 'cancelled' ? 'opacity-60' : ''
                                        }`}
                                >
                                    {/* Time */}
                                    <div className="text-center min-w-[80px]">
                                        <p className="text-xl font-bold">{apt.time}</p>
                                        <p className="text-sm text-muted">{apt.duration} min</p>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className={`w-1 h-16 rounded-full ${getStatusColor(apt.status)}`} />

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="w-4 h-4 text-muted" />
                                            <span className="font-medium">{apt.patient}</span>
                                        </div>
                                        <p className="text-sm text-muted">{apt.type}</p>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(apt.status)}
                                        <button className="btn btn-secondary btn-sm">
                                            Detalhes
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    )
}
