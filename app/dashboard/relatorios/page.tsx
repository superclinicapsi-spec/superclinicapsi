'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    ProgressChart,
    GoalsChart,
    PromptDistributionChart,
} from '@/components/reports';
import {
    BarChart3,
    Calendar,
    TrendingUp,
    Target,
    Users,
    Download,
    Filter,
    ChevronsUp
} from 'lucide-react';

interface Patient {
    id: string;
    full_name: string;
}

interface Session {
    id: string;
    session_date: string;
    duration_minutes: number;
}

interface Goal {
    id: string;
    name: string;
    category: string;
    target_percentage: number;
}

interface Progress {
    id: string;
    session_id: string;
    goal_id: string;
    trials: number;
    correct: number;
    prompt_level: string;
    session: {
        session_date: string;
    };
}

const PERIODS = [
    { value: '7', label: 'Últimos 7 dias' },
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 90 dias' },
    { value: 'all', label: 'Todo o período' },
];

export default function RelatoriosPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [period, setPeriod] = useState('30');
    const [loading, setLoading] = useState(true);

    const [sessions, setSessions] = useState<Session[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [progress, setProgress] = useState<Progress[]>([]);

    const supabase = createClient();

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            fetchReportData();
        }
    }, [selectedPatient, period]);

    async function fetchPatients() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('patients')
            .select('id, full_name')
            .eq('psychologist_id', user.id)
            .order('full_name');

        setPatients(data || []);
        if (data && data.length > 0) {
            // setSelectedPatient(data[0].id); // Optional auto-select
        }
        setLoading(false);
    }

    async function fetchReportData() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Calculate date range
            const endDate = new Date();
            let startDate: Date | null = null;

            if (period !== 'all') {
                startDate = new Date();
                startDate.setDate(startDate.getDate() - parseInt(period));
            }

            // Fetch goals for patient
            const { data: goalsData } = await supabase
                .from('aba_goals')
                .select('*')
                .eq('patient_id', selectedPatient)
                .eq('psychologist_id', user.id);

            setGoals(goalsData || []);

            // Fetch sessions with date filter
            let sessionsQuery = supabase
                .from('aba_sessions')
                .select('id, session_date, duration_minutes')
                .eq('patient_id', selectedPatient)
                .eq('psychologist_id', user.id)
                .order('session_date', { ascending: true });

            if (startDate) {
                sessionsQuery = sessionsQuery.gte('session_date', startDate.toISOString().split('T')[0]);
            }

            const { data: sessionsData } = await sessionsQuery;
            setSessions(sessionsData || []);

            // Fetch progress with session info
            if (sessionsData && sessionsData.length > 0) {
                const sessionIds = sessionsData.map((s) => s.id);

                const { data: progressData } = await supabase
                    .from('aba_progress')
                    .select(`
                        id,
                        session_id,
                        goal_id,
                        trials,
                        correct,
                        prompt_level,
                        session:aba_sessions(session_date)
                    `)
                    .in('session_id', sessionIds);

                setProgress((progressData as unknown as Progress[]) || []);
            } else {
                setProgress([]);
            }
        } catch (error) {
            console.error('Erro ao carregar relatório:', error);
        } finally {
            setLoading(false);
        }
    }

    // Calculate stats
    const stats = useMemo(() => {
        const totalSessions = sessions.length;
        const totalHours = sessions.reduce((acc, s) => acc + s.duration_minutes, 0) / 60;

        const avgProgress = progress.length > 0
            ? progress.reduce((acc, p) => {
                if (p.trials > 0) {
                    return acc + (p.correct / p.trials) * 100;
                }
                return acc;
            }, 0) / progress.filter((p) => p.trials > 0).length
            : 0;

        const goalsAchieved = goals.filter((goal) => {
            const goalProgress = progress.filter((p) => p.goal_id === goal.id);
            if (goalProgress.length === 0) return false;
            const latestProgress = goalProgress[goalProgress.length - 1];
            return latestProgress.trials > 0 &&
                (latestProgress.correct / latestProgress.trials) * 100 >= goal.target_percentage;
        }).length;

        return { totalSessions, totalHours, avgProgress, goalsAchieved };
    }, [sessions, progress, goals]);

    // Prepare chart data
    const progressChartData = useMemo(() => {
        const groupedByDate: Record<string, { total: number; count: number }> = {};

        progress.forEach((p) => {
            if (p.trials > 0 && p.session?.session_date) {
                const date = p.session.session_date;
                if (!groupedByDate[date]) {
                    groupedByDate[date] = { total: 0, count: 0 };
                }
                groupedByDate[date].total += (p.correct / p.trials) * 100;
                groupedByDate[date].count += 1;
            }
        });

        return Object.entries(groupedByDate)
            .map(([date, data]) => ({
                date: new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                percentage: data.total / data.count,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [progress]);

    const goalsChartData = useMemo(() => {
        return goals.map((goal) => {
            const goalProgress = progress.filter((p) => p.goal_id === goal.id);
            const avgPercentage = goalProgress.length > 0
                ? goalProgress.reduce((acc, p) => {
                    if (p.trials > 0) return acc + (p.correct / p.trials) * 100;
                    return acc;
                }, 0) / goalProgress.filter((p) => p.trials > 0).length || 0
                : 0;

            return {
                name: goal.name.length > 20 ? goal.name.substring(0, 20) + '...' : goal.name,
                percentage: avgPercentage,
                target: goal.target_percentage,
            };
        });
    }, [goals, progress]);

    const promptChartData = useMemo(() => {
        const counts: Record<string, number> = {
            'Independente': 0,
            'Gestual': 0,
            'Verbal': 0,
            'Parcial': 0,
            'Total': 0,
        };

        const labelMap: Record<string, string> = {
            'independent': 'Independente',
            'gestural': 'Gestual',
            'verbal': 'Verbal',
            'partial': 'Parcial',
            'full': 'Total',
        };

        progress.forEach((p) => {
            const label = labelMap[p.prompt_level] || p.prompt_level;
            if (counts[label] !== undefined) {
                counts[label] += 1;
            }
        });

        return Object.entries(counts)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    }, [progress]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Relatórios</h1>
                        <p className="text-gray-500 mt-1">
                            Análise detalhada de evolução e métricas clínicas
                        </p>
                    </div>
                    {selectedPatient && (
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition-all">
                            <Download className="w-4 h-4" />
                            Exportar PDF
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 w-full md:w-auto">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Paciente</label>
                            <div className="relative">
                                <select
                                    className="w-full h-11 pl-4 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all appearance-none font-medium"
                                    value={selectedPatient}
                                    onChange={(e) => setSelectedPatient(e.target.value)}
                                >
                                    <option value="">Selecione um paciente...</option>
                                    {patients.map((patient) => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.full_name}
                                        </option>
                                    ))}
                                </select>
                                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="w-full md:w-64">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Período de Análise</label>
                            <div className="relative">
                                <select
                                    className="w-full h-11 pl-4 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all appearance-none font-medium"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                >
                                    {PERIODS.map((p) => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {!selectedPatient ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <BarChart3 className="w-10 h-10 text-purple-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Selecione um Paciente</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Escolha um paciente acima para visualizar os gráficos de progresso, metas atingidas e estatísticas detalhadas.
                        </p>
                    </div>
                ) : loading ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-32 bg-gray-100 rounded-xl" />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="h-80 bg-gray-100 rounded-xl" />
                            <div className="h-80 bg-gray-100 rounded-xl" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 uppercase">Sessões</span>
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalSessions}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{stats.totalHours.toFixed(1)}h totais</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 uppercase">Progresso Médio</span>
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.avgProgress.toFixed(0)}%</h3>
                                    <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                                        <ChevronsUp className="w-3 h-3" /> Alta performance
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 uppercase">Metas Atingidas</span>
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-3xl font-bold text-gray-900">{stats.goalsAchieved} <span className="text-lg text-gray-400 font-normal">/ {goals.length}</span></h3>
                                    <p className="text-sm text-gray-500 font-medium">Objetivos concluídos</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts Flow */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Evolution Chart */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Evolução de Desempenho</h3>
                                        <p className="text-sm text-gray-500">Média de acertos por sessão</p>
                                    </div>
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-purple-600" />
                                    </div>
                                </div>
                                <div className="w-full overflow-hidden">
                                    <ProgressChart data={progressChartData} height={300} />
                                </div>
                            </div>

                            {/* Goals Comparison */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Atingimento de Metas</h3>
                                        <p className="text-sm text-gray-500">Progresso atual vs Alvo terapêutico</p>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Target className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="w-full overflow-hidden">
                                    <GoalsChart data={goalsChartData} height={300} />
                                </div>
                            </div>

                            {/* Prompt Distribution - Full Width */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Níveis de Ajuda (Prompt)</h3>
                                        <p className="text-sm text-gray-500">Distribuição do tipo de suporte necessário nas tentativas</p>
                                    </div>
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <BarChart3 className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>
                                <div className="w-full max-w-2xl mx-auto">
                                    <PromptDistributionChart data={promptChartData} height={350} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
