'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Filter,
    Download,
    Plus,
    CheckCircle,
    Clock,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Wallet,
    Receipt
} from 'lucide-react'

// Mock data
const mockStats = {
    totalRevenue: 12500,
    pendingPayments: 2250,
    paidSessions: 48,
    avgSessionValue: 260
}

const mockTransactions = [
    { id: 1, patient: 'Maria Silva', date: '07 fev 2026', amount: 250, status: 'paid', type: 'Sessão Individual', method: 'Pix' },
    { id: 2, patient: 'João Santos', date: '06 fev 2026', amount: 250, status: 'paid', type: 'Sessão Individual', method: 'Cartão' },
    { id: 3, patient: 'Ana Costa', date: '07 fev 2026', amount: 300, status: 'pending', type: 'Primeira Consulta', method: 'Pendente' },
    { id: 4, patient: 'Carlos Lima', date: '05 fev 2026', amount: 250, status: 'paid', type: 'Sessão Individual', method: 'Pix' },
    { id: 5, patient: 'Paula Souza', date: '05 fev 2026', amount: 400, status: 'pending', type: 'Terapia de Casal', method: 'Pendente' },
    { id: 6, patient: 'Roberto Mendes', date: '04 fev 2026', amount: 250, status: 'overdue', type: 'Sessão Individual', method: 'Boleto' },
    { id: 7, patient: 'Lucia Ferreira', date: '03 fev 2026', amount: 250, status: 'paid', type: 'Sessão Individual', method: 'Transferência' },
]

export default function FinanceiroPage() {
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPeriod, setFilterPeriod] = useState('month')
    const [searchTerm, setSearchTerm] = useState('')

    const filteredTransactions = mockTransactions.filter(t =>
        (filterStatus === 'all' || t.status === filterStatus) &&
        t.patient.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'paid':
                return { label: 'Pago', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle }
            case 'pending':
                return { label: 'Pendente', bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock }
            case 'overdue':
                return { label: 'Atrasado', bg: 'bg-red-50', text: 'text-red-700', icon: AlertTriangle }
            default:
                return { label: status, bg: 'bg-gray-50', text: 'text-gray-700', icon: Clock }
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Financeiro</h1>
                        <p className="text-gray-500 mt-1">
                            Gestão de faturamento e recebimentos
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            Relatório
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            Novo Lançamento
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                +15% <ArrowUpRight className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">R$ {mockStats.totalRevenue.toLocaleString('pt-BR')}</p>
                            <p className="text-sm text-gray-500 font-medium mt-1">Receita Confirmada</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                8 faturas
                            </span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">R$ {mockStats.pendingPayments.toLocaleString('pt-BR')}</p>
                            <p className="text-sm text-gray-500 font-medium mt-1">A Receber</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{mockStats.paidSessions}</p>
                            <p className="text-sm text-gray-500 font-medium mt-1">Sessões Pagas</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                +5% <ArrowUpRight className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">R$ {mockStats.avgSessionValue}</p>
                            <p className="text-sm text-gray-500 font-medium mt-1">Ticket Médio</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1 md:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar transação..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-200 focus:ring-2 focus:ring-purple-50 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="h-8 w-px bg-gray-200 hidden md:block" />
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer hover:text-purple-600 transition-colors"
                                >
                                    <option value="all">Todos os Status</option>
                                    <option value="paid">Pagos</option>
                                    <option value="pending">Pendentes</option>
                                    <option value="overdue">Atrasados</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <select
                                value={filterPeriod}
                                onChange={(e) => setFilterPeriod(e.target.value)}
                                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer hover:text-purple-600 transition-colors"
                            >
                                <option value="week">Esta Semana</option>
                                <option value="month">Este Mês</option>
                                <option value="quarter">Últimos 3 Meses</option>
                                <option value="year">Este Ano</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente / Descrição</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTransactions.map((transaction) => {
                                    const status = getStatusConfig(transaction.status)
                                    const StatusIcon = status.icon

                                    return (
                                        <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                                        {transaction.patient.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{transaction.patient}</p>
                                                        <p className="text-xs text-gray-500">{transaction.type}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-600">{transaction.date}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-600">{transaction.method}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <p className="text-sm font-bold text-gray-900">
                                                    R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                    <Receipt className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-end gap-8">
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Pendente</p>
                                <p className="text-xl font-bold text-amber-600">
                                    R$ {filteredTransactions
                                        .filter(t => t.status === 'pending' || t.status === 'overdue')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Total Recebido</p>
                                <p className="text-xl font-bold text-emerald-600">
                                    R$ {filteredTransactions
                                        .filter(t => t.status === 'paid')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
