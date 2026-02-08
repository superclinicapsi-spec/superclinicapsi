'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/ui/Card'
import { useState } from 'react'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Filter,
    Download,
    Plus,
    CheckCircle,
    Clock,
    AlertTriangle
} from 'lucide-react'

// Mock data
const mockStats = {
    totalRevenue: 12500,
    pendingPayments: 2250,
    paidSessions: 48,
    avgSessionValue: 260
}

const mockTransactions = [
    { id: 1, patient: 'Maria Silva', date: '07/02/2026', amount: 250, status: 'paid', type: 'Sessão Individual' },
    { id: 2, patient: 'João Santos', date: '06/02/2026', amount: 250, status: 'paid', type: 'Sessão Individual' },
    { id: 3, patient: 'Ana Costa', date: '07/02/2026', amount: 300, status: 'pending', type: 'Primeira Consulta' },
    { id: 4, patient: 'Carlos Lima', date: '05/02/2026', amount: 250, status: 'paid', type: 'Sessão Individual' },
    { id: 5, patient: 'Paula Souza', date: '05/02/2026', amount: 400, status: 'pending', type: 'Terapia de Casal' },
    { id: 6, patient: 'Roberto Mendes', date: '04/02/2026', amount: 250, status: 'overdue', type: 'Sessão Individual' },
    { id: 7, patient: 'Lucia Ferreira', date: '03/02/2026', amount: 250, status: 'paid', type: 'Sessão Individual' },
]

export default function FinanceiroPage() {
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPeriod, setFilterPeriod] = useState('month')

    const filteredTransactions = mockTransactions.filter(t =>
        filterStatus === 'all' || t.status === filterStatus
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Pago</span>
            case 'pending':
                return <span className="badge badge-warning"><Clock className="w-3 h-3" /> Pendente</span>
            case 'overdue':
                return <span className="badge badge-error"><AlertTriangle className="w-3 h-3" /> Atrasado</span>
            default:
                return null
        }
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="page-title">Financeiro</h1>
                    <p className="page-subtitle">
                        Controle de receitas e pagamentos
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-secondary">
                        <Download className="w-4 h-4" />
                        Exportar
                    </button>
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Nova Transação
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Receita do Mês"
                    value={`R$ ${mockStats.totalRevenue.toLocaleString('pt-BR')}`}
                    icon={<TrendingUp className="w-5 h-5 text-[var(--success)]" />}
                    trend={{ value: 15, isPositive: true }}
                />
                <StatCard
                    title="Pagamentos Pendentes"
                    value={`R$ ${mockStats.pendingPayments.toLocaleString('pt-BR')}`}
                    icon={<Clock className="w-5 h-5 text-[var(--warning)]" />}
                />
                <StatCard
                    title="Sessões Pagas"
                    value={mockStats.paidSessions}
                    icon={<CheckCircle className="w-5 h-5 text-[var(--success)]" />}
                />
                <StatCard
                    title="Valor Médio/Sessão"
                    value={`R$ ${mockStats.avgSessionValue}`}
                    icon={<DollarSign className="w-5 h-5 text-[var(--primary)]" />}
                />
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-muted" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input-field select-field w-auto"
                        >
                            <option value="all">Todos os status</option>
                            <option value="paid">Pagos</option>
                            <option value="pending">Pendentes</option>
                            <option value="overdue">Atrasados</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-muted" />
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="input-field select-field w-auto"
                        >
                            <option value="week">Última semana</option>
                            <option value="month">Este mês</option>
                            <option value="quarter">Trimestre</option>
                            <option value="year">Este ano</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="card">
                <h3 className="font-semibold mb-4">Transações</h3>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>Tipo</th>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar avatar-sm">
                                                {transaction.patient.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <span className="font-medium">{transaction.patient}</span>
                                        </div>
                                    </td>
                                    <td>{transaction.type}</td>
                                    <td>{transaction.date}</td>
                                    <td className="font-semibold">
                                        R$ {transaction.amount.toLocaleString('pt-BR')}
                                    </td>
                                    <td>{getStatusBadge(transaction.status)}</td>
                                    <td>
                                        {transaction.status === 'pending' || transaction.status === 'overdue' ? (
                                            <button className="btn btn-primary btn-sm">
                                                Marcar Pago
                                            </button>
                                        ) : (
                                            <button className="btn btn-ghost btn-sm">
                                                Recibo
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-6">
                            <div>
                                <p className="text-sm text-muted">Total Recebido</p>
                                <p className="text-xl font-bold text-[var(--success)]">
                                    R$ {filteredTransactions
                                        .filter(t => t.status === 'paid')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                        .toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted">A Receber</p>
                                <p className="text-xl font-bold text-[var(--warning)]">
                                    R$ {filteredTransactions
                                        .filter(t => t.status === 'pending' || t.status === 'overdue')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                        .toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
