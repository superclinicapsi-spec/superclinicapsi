'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    Plus,
    Calendar,
    Clock,
    User,
    Target,
    Save,
    Trash2,
    CheckCircle2,
    CalendarDays,
    ArrowRight,
    Brain,
    FileText,
    Percent
} from 'lucide-react';

interface Patient {
    id: string;
    full_name: string;
}

interface Goal {
    id: string;
    name: string;
    category: string;
    target_percentage: number;
    status: string;
}

interface Session {
    id: string;
    session_date: string;
    duration_minutes: number;
    session_type: string;
    notes: string;
    patient: Patient;
}

interface ProgressEntry {
    goal_id: string;
    trials: number;
    correct: number;
    prompt_level: string;
}

const SESSION_TYPES = [
    { value: 'individual', label: 'Individual' },
    { value: 'group', label: 'Grupo' },
    { value: 'parent_training', label: 'Treinamento Parental' },
    { value: 'supervision', label: 'Supervisão' },
];

const PROMPT_LEVELS = [
    { value: 'independent', label: 'Independente' },
    { value: 'gestural', label: 'Gestual' },
    { value: 'verbal', label: 'Verbal' },
    { value: 'partial', label: 'Parcial' },
    { value: 'full', label: 'Total' },
];

export default function SessoesPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showNewSession, setShowNewSession] = useState(false);
    const [showNewGoal, setShowNewGoal] = useState(false);

    // Form state
    const [selectedPatient, setSelectedPatient] = useState('');
    const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState(60);
    const [sessionType, setSessionType] = useState('individual');
    const [notes, setNotes] = useState('');
    const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);

    // New goal form
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalCategory, setNewGoalCategory] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState(80);

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            fetchGoalsForPatient(selectedPatient);
        } else {
            setGoals([]);
            setProgressEntries([]);
        }
    }, [selectedPatient]);

    async function fetchData() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch patients
            const { data: patientsData } = await supabase
                .from('patients')
                .select('id, full_name')
                .eq('psychologist_id', user.id)
                .order('full_name');

            setPatients(patientsData || []);

            // Fetch recent sessions
            const { data: sessionsData } = await supabase
                .from('aba_sessions')
                .select(`
                    id,
                    session_date,
                    duration_minutes,
                    session_type,
                    notes,
                    patient:patients(id, full_name)
                `)
                .eq('psychologist_id', user.id)
                .order('session_date', { ascending: false })
                .limit(10);

            setSessions((sessionsData as unknown as Session[]) || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchGoalsForPatient(patientId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: goalsData } = await supabase
            .from('aba_goals')
            .select('*')
            .eq('patient_id', patientId)
            .eq('psychologist_id', user.id)
            .eq('status', 'active')
            .order('category', { ascending: true });

        setGoals(goalsData || []);

        setProgressEntries(
            (goalsData || []).map((goal) => ({
                goal_id: goal.id,
                trials: 0,
                correct: 0,
                prompt_level: 'independent',
            }))
        );
    }

    async function handleSaveSession() {
        if (!selectedPatient) return;

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: session, error: sessionError } = await supabase
                .from('aba_sessions')
                .insert({
                    patient_id: selectedPatient,
                    psychologist_id: user.id,
                    session_date: sessionDate,
                    duration_minutes: duration,
                    session_type: sessionType,
                    notes,
                })
                .select()
                .single();

            if (sessionError) throw sessionError;

            const progressData = progressEntries
                .filter((entry) => entry.trials > 0)
                .map((entry) => ({
                    session_id: session.id,
                    goal_id: entry.goal_id,
                    trials: entry.trials,
                    correct: entry.correct,
                    prompt_level: entry.prompt_level,
                }));

            if (progressData.length > 0) {
                const { error: progressError } = await supabase
                    .from('aba_progress')
                    .insert(progressData);
                if (progressError) throw progressError;
            }

            setShowNewSession(false);
            setSelectedPatient('');
            setNotes('');
            setProgressEntries([]);
            setSessionDate(new Date().toISOString().split('T')[0]);
            fetchData();
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveGoal() {
        if (!selectedPatient || !newGoalName) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('aba_goals')
                .insert({
                    patient_id: selectedPatient,
                    psychologist_id: user.id,
                    name: newGoalName,
                    category: newGoalCategory,
                    target_percentage: newGoalTarget,
                });

            if (error) throw error;

            setShowNewGoal(false);
            setNewGoalName('');
            setNewGoalCategory('');
            setNewGoalTarget(80);
            fetchGoalsForPatient(selectedPatient);
        } catch (error) {
            console.error('Erro ao salvar meta:', error);
        }
    }

    function updateProgressEntry(goalId: string, field: keyof ProgressEntry, value: number | string) {
        setProgressEntries((prev) =>
            prev.map((entry) =>
                entry.goal_id === goalId ? { ...entry, [field]: value } : entry
            )
        );
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Sessões ABA</h1>
                        <p className="text-gray-500 mt-1">
                            Acompanhamento terapêutico e registro de progresso
                        </p>
                    </div>
                    {!showNewSession && (
                        <button
                            onClick={() => setShowNewSession(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" />
                            Nova Sessão
                        </button>
                    )}
                </div>

                {/* New Session Form */}
                {showNewSession && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg animate-in slide-in-from-top-4 duration-300">
                        {/* Form Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 text-left">Registrar Sessão</h2>
                                    <p className="text-sm text-gray-500">Preencha os dados e registre o desempenho</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowNewSession(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Main Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Paciente</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all appearance-none"
                                            value={selectedPatient}
                                            onChange={(e) => setSelectedPatient(e.target.value)}
                                        >
                                            <option value="">Selecione...</option>
                                            {patients.map((patient) => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.full_name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Data</label>
                                    <input
                                        type="date"
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all"
                                        value={sessionDate}
                                        onChange={(e) => setSessionDate(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Duração (min)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all"
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            min={15}
                                            max={180}
                                            step={15}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs font-medium">
                                            min
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Tipo de Sessão</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all appearance-none"
                                            value={sessionType}
                                            onChange={(e) => setSessionType(e.target.value)}
                                        >
                                            {SESSION_TYPES.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Goals Section */}
                            {selectedPatient && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-purple-600" />
                                            Metas e Progresso
                                        </h3>
                                        <button
                                            onClick={() => setShowNewGoal(!showNewGoal)}
                                            className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${showNewGoal
                                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {showNewGoal ? 'Cancelar Meta' : '+ Adicionar Meta'}
                                        </button>
                                    </div>

                                    {/* New Goal Form */}
                                    {showNewGoal && (
                                        <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl animate-in slide-in-from-top-2">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                                <div className="md:col-span-2 space-y-1">
                                                    <label className="text-xs font-medium text-gray-500">Nome da Meta</label>
                                                    <input
                                                        type="text"
                                                        className="w-full h-10 px-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                                        placeholder="Ex: Contato visual"
                                                        value={newGoalName}
                                                        onChange={(e) => setNewGoalName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-gray-500">Categoria</label>
                                                    <input
                                                        type="text"
                                                        className="w-full h-10 px-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                                        placeholder="Ex: Social"
                                                        value={newGoalCategory}
                                                        onChange={(e) => setNewGoalCategory(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="space-y-1 flex-1">
                                                        <label className="text-xs font-medium text-gray-500">Alvo %</label>
                                                        <input
                                                            type="number"
                                                            className="w-full h-10 px-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                                            value={newGoalTarget}
                                                            onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                                                            min={1} max={100}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleSaveGoal}
                                                        disabled={!newGoalName}
                                                        className="h-10 px-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        Salvar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Goals List */}
                                    {goals.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                                            <p className="text-gray-500 text-sm">Nenhuma meta cadastrada para este paciente.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {goals.map((goal) => {
                                                const entry = progressEntries.find((e) => e.goal_id === goal.id);
                                                const percentage = entry && entry.trials > 0
                                                    ? ((entry.correct / entry.trials) * 100).toFixed(0)
                                                    : '-';

                                                const isSuccess = percentage !== '-' && Number(percentage) >= goal.target_percentage;

                                                return (
                                                    <div
                                                        key={goal.id}
                                                        className="p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all group"
                                                    >
                                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                                        {goal.category || 'Geral'}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">Meta: {goal.target_percentage}%</span>
                                                                </div>
                                                                <p className="font-semibold text-gray-900 truncate">{goal.name}</p>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 pt-4 lg:pt-0 lg:border-l lg:border-gray-100 lg:pl-6">
                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-xs font-medium text-gray-500 uppercase">Tentativas</label>
                                                                    <input
                                                                        type="number"
                                                                        className="w-16 h-9 px-2 text-center rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium"
                                                                        min={0}
                                                                        value={entry?.trials || 0}
                                                                        onChange={(e) => updateProgressEntry(goal.id, 'trials', Number(e.target.value))}
                                                                    />
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-xs font-medium text-gray-500 uppercase">Acertos</label>
                                                                    <input
                                                                        type="number"
                                                                        className="w-16 h-9 px-2 text-center rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium text-green-600"
                                                                        min={0}
                                                                        max={entry?.trials || 0}
                                                                        value={entry?.correct || 0}
                                                                        onChange={(e) => updateProgressEntry(goal.id, 'correct', Number(e.target.value))}
                                                                    />
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-xs font-medium text-gray-500 uppercase lg:hidden">Nível</label>
                                                                    <select
                                                                        className="h-9 px-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                                                        value={entry?.prompt_level || 'independent'}
                                                                        onChange={(e) => updateProgressEntry(goal.id, 'prompt_level', e.target.value)}
                                                                    >
                                                                        {PROMPT_LEVELS.map((level) => (
                                                                            <option key={level.value} value={level.value}>
                                                                                {level.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className={`
                                                                    w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border-2
                                                                    ${percentage !== '-'
                                                                        ? isSuccess
                                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                                                        : 'bg-gray-50 text-gray-400 border-gray-200'
                                                                    }
                                                                `}>
                                                                    {percentage}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notes */}
                            <div className="space-y-1.5 pt-4 border-t border-gray-100">
                                <label className="text-sm font-medium text-gray-700">Observações Clínicas</label>
                                <textarea
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all min-h-[100px]"
                                    placeholder="Descreva detalhes importantes sobre o comportamento do paciente..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowNewSession(false)}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-white hover:border-gray-300 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveSession}
                                disabled={!selectedPatient || saving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {saving ? (
                                    <>Salvando...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Salvar Sessão
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Sessions List */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Histórico Recente</h2>
                    </div>

                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CalendarDays className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhuma sessão registrada</h3>
                            <p className="text-gray-500 mb-6">Comece registrando a primeira sessão de terapia.</p>
                            <button
                                onClick={() => setShowNewSession(true)}
                                className="btn bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-xl px-6 py-2.5 font-medium transition-colors"
                            >
                                Registrar Agora
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="p-5 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                {formatDate(session.session_date).split('/')[0]}
                                                <span className="text-[10px] ml-0.5 text-purple-400 -mb-2 absolute"></span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{session.patient?.full_name || 'Paciente'}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <span>{formatDate(session.session_date)}</span>
                                                    <span>•</span>
                                                    <span>{session.duration_minutes} min</span>
                                                    <span>•</span>
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
                                                        {SESSION_TYPES.find((t) => t.value === session.session_type)?.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {session.notes && (
                                            <div className="flex-1 md:max-w-md bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic border border-gray-100 md:mx-4">
                                                "{session.notes}"
                                            </div>
                                        )}

                                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
