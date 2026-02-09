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
    X as XIcon,
    Calendar as CalendarIcon,
    MoreHorizontal,
    MapPin
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockAppointments = [
    { id: 1, patient: 'Maria Silva', time: '09:00', endTime: '10:00', duration: 60, status: 'confirmed', type: 'Sessão Individual', day: 7, notes: 'Acompanhamento quinzenal' },
    { id: 2, patient: 'João Santos', time: '10:00', endTime: '11:00', duration: 60, status: 'confirmed', type: 'Sessão Individual', day: 7, notes: 'Focar em ansiedade social' },
    { id: 3, patient: 'Ana Costa', time: '14:00', endTime: '15:00', duration: 60, status: 'pending', type: 'Primeira Consulta', day: 7, notes: 'Anamnese inicial' },
    { id: 4, patient: 'Carlos Lima', time: '15:30', endTime: '16:30', duration: 60, status: 'confirmed', type: 'Sessão Individual', day: 7, notes: 'Retorno após férias' },
    { id: 5, patient: 'Paula Souza', time: '17:00', endTime: '18:30', duration: 90, status: 'confirmed', type: 'Terapia de Casal', day: 7, notes: 'Conflitos de comunicação' },
    { id: 6, patient: 'Roberto Mendes', time: '09:00', endTime: '10:00', duration: 60, status: 'confirmed', type: 'Sessão Individual', day: 8, notes: 'TDAH' },
    { id: 7, patient: 'Lucia Ferreira', time: '11:00', endTime: '12:00', duration: 60, status: 'cancelled', type: 'Sessão Individual', day: 8, notes: 'Cancelou por motivos de saúde' },
]

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const statusConfig = {
    confirmed: { label: 'Confirmado', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
    pending: { label: 'Pendente', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertCircle },
    cancelled: { label: 'Cancelado', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XIcon },
}

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
            const isToday = day.getDate() === 7 && day.getMonth() === 1
            const appointments = mockAppointments.filter(a => a.day === day.getDate())

            return {
                date: day.getDate(),
                dayName: weekDays[i].substring(0, 3), // Dom, Seg, Ter...
                fullDayName: weekDays[i],
                isToday,
                appointments
            }
        })
    }

    const getDayAppointments = () => {
        return mockAppointments.filter(a => a.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time))
    }

    // Navegação de data
    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate)
        if (view === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        } else {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
            setSelectedDay(newDate.getDate())
        }
        setCurrentDate(newDate)
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Agenda</h1>
                        <p className="text-gray-500 mt-1">
                            Organize seus atendimentos e compromissos
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-[0.98]">
                        <Plus className="w-5 h-5" />
                        Novo Agendamento
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-xl">
                        <button
                            onClick={() => navigateDate('prev')}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                            {view === 'week' ? (
                                <span>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                            ) : (
                                <span>{selectedDay} de {months[currentDate.getMonth()]}</span>
                            )}
                        </h2>
                        <button
                            onClick={() => navigateDate('next')}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex bg-gray-50 p-1 rounded-xl w-full sm:w-auto">
                        <button
                            onClick={() => setView('week')}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'week'
                                    ? 'bg-white text-purple-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => setView('day')}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'day'
                                    ? 'bg-white text-purple-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Dia
                        </button>
                    </div>
                </div>
            </div>

            {view === 'week' ? (
                /* Week View Grid */
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {getWeekDays().map((day, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedDay(day.date)
                                setView('day')
                            }}
                            className={`
                                group bg-white rounded-2xl border transition-all duration-200 cursor-pointer
                                hover:shadow-md hover:border-purple-200 min-h-[180px] flex flex-col
                                ${day.isToday ? 'border-purple-200 ring-4 ring-purple-50' : 'border-gray-200'}
                            `}
                        >
                            {/* Day Header */}
                            <div className={`
                                p-3 text-center border-b transition-colors
                                ${day.isToday ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100 group-hover:bg-purple-50/30'}
                            `}>
                                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${day.isToday ? 'text-purple-600' : 'text-gray-500'
                                    }`}>
                                    {day.dayName}
                                </p>
                                <div className={`
                                    w-8 h-8 mx-auto flex items-center justify-center rounded-full text-lg font-bold
                                    ${day.isToday ? 'bg-purple-600 text-white' : 'text-gray-900 group-hover:bg-purple-100 group-hover:text-purple-700'}
                                `}>
                                    {day.date}
                                </div>
                            </div>

                            {/* Appointments List */}
                            <div className="p-2 flex-1 space-y-2">
                                {day.appointments.length === 0 ? (
                                    <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="w-5 h-5 text-gray-300" />
                                    </div>
                                ) : (
                                    <>
                                        {day.appointments.slice(0, 3).map((apt) => {
                                            const status = statusConfig[apt.status as keyof typeof statusConfig]
                                            return (
                                                <div
                                                    key={apt.id}
                                                    className={`
                                                        p-2 rounded-lg text-xs border border-transparent
                                                        ${apt.status === 'confirmed' ? 'bg-purple-50 text-purple-700 hover:border-purple-200' : ''}
                                                        ${apt.status === 'pending' ? 'bg-amber-50 text-amber-700 hover:border-amber-200' : ''}
                                                        ${apt.status === 'cancelled' ? 'bg-red-50 text-red-700 line-through opacity-60' : ''}
                                                    `}
                                                >
                                                    <p className="font-bold mb-0.5">{apt.time}</p>
                                                    <p className="truncate">{apt.patient}</p>
                                                </div>
                                            )
                                        })}
                                        {day.appointments.length > 3 && (
                                            <p className="text-xs text-center text-gray-400 font-medium">
                                                +{day.appointments.length - 3} mais
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Day View Detail */
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center shadow-sm">
                                <span className="text-xs text-gray-500 font-medium uppercase">{weekDays[new Date(2026, 1, selectedDay).getDay()].substring(0, 3)}</span>
                                <span className="text-xl font-bold text-gray-900">{selectedDay}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Compromissos do Dia
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {getDayAppointments().length} agendamento{getDayAppointments().length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        {getDayAppointments().length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <CalendarIcon className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Dia Livre!</h3>
                                <p className="text-gray-500 mb-6 max-w-sm">
                                    Você não tem nenhum agendamento marcado para este dia. Aproveite para descansar ou adiantar outras tarefas.
                                </p>
                                <button className="btn bg-purple-600 text-white hover:bg-purple-700 rounded-xl px-6 py-2.5">
                                    Agendar Compromisso
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {getDayAppointments().map((apt) => {
                                    const status = statusConfig[apt.status as keyof typeof statusConfig]
                                    const StatusIcon = status.icon

                                    return (
                                        <div
                                            key={apt.id}
                                            className={`
                                                relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border transition-all
                                                ${apt.status === 'cancelled'
                                                    ? 'bg-gray-50 border-gray-200 opacity-70'
                                                    : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            {/* Time Column */}
                                            <div className="flex sm:flex-col items-center sm:items-start gap-2 min-w-[100px] border-b sm:border-b-0 sm:border-r border-gray-100 pb-3 sm:pb-0 sm:pr-6">
                                                <p className="text-2xl font-bold text-gray-900">{apt.time}</p>
                                                <p className="text-sm text-gray-500 font-medium">{apt.duration} min</p>
                                            </div>

                                            {/* Details Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900">{apt.patient}</h3>
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.bg} ${status.text} ${status.border}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <div className="grid sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        {apt.type}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        Consultório 1
                                                    </div>
                                                    <div className="flex items-start gap-2 sm:col-span-2">
                                                        <div className="mt-0.5"><Clock className="w-4 h-4 text-gray-400" /></div>
                                                        <span className="italic">Nota: {apt.notes}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col items-center justify-end gap-2 mt-4 sm:mt-0 sm:pl-4">
                                                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
