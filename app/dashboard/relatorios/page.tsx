'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    ReportCard,
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
    { value: '7', label: '7 dias' },
    { value: '30', label: '30 dias' },
    { value: '90', label: '90 dias' },
    { value: 'all', label: 'Todo período' },
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
                        <h1 className="text-2xl font-semibold">Relatórios</h1>
                        <p className="text-muted text-sm mt-1">
                            Visualize a evolução e progresso dos pacientes
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="label">Paciente</label>
                            <select
                                className="input-field select-field"
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
                        </div>
                        <div className="sm:w-48">
                            <label className="label">Período</label>
                            <select
                                className="input-field select-field"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                            >
                                {PERIODS.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {!selectedPatient ? (
                    <div className="card text-center py-16">
                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-muted text-lg">Selecione um paciente para ver os relatórios</p>
                    </div>
                ) : loading ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                        <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ReportCard
                                title="Total de Sessões"
                                value={stats.totalSessions}
                                subtitle={`${stats.totalHours.toFixed(1)}h no período`}
                                icon={Calendar}
                                color="primary"
                            />
                            <ReportCard
                                title="Média de Progresso"
                                value={`${stats.avgProgress.toFixed(1)}%`}
                                icon={TrendingUp}
                                color="success"
                            />
                            <ReportCard
                                title="Metas Atingidas"
                                value={`${stats.goalsAchieved}/${goals.length}`}
                                icon={Target}
                                color="info"
                            />
                            <ReportCard
                                title="Total de Metas"
                                value={goals.length}
                                subtitle="objetivos ativos"
                                icon={Users}
                                color="warning"
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Progress over time */}
                            <div className="card">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Evolução do Progresso
                                </h3>
                                <ProgressChart data={progressChartData} height={280} />
                            </div>

                            {/* Goals comparison */}
                            <div className="card">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    Comparativo de Metas
                                </h3>
                                <GoalsChart data={goalsChartData} height={280} />
                            </div>

                            {/* Prompt distribution */}
                            <div className="card lg:col-span-2">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    Distribuição de Níveis de Prompt
                                </h3>
                                <div className="max-w-md mx-auto">
                                    <PromptDistributionChart data={promptChartData} height={300} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
