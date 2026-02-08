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
    ChevronDown,
    ChevronUp,
    CheckCircle2,
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

            // Fetch patients - usando o Supabase diretamente
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

        // Inicializar entries de progresso
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

            // Insert session
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

            // Insert progress entries
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

            // Reset form
            setShowNewSession(false);
            setSelectedPatient('');
            setNotes('');
            setProgressEntries([]);
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
                        <h1 className="text-2xl font-semibold">Sessões ABA</h1>
                        <p className="text-muted text-sm mt-1">
                            Registre sessões e acompanhe o progresso dos pacientes
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewSession(!showNewSession)}
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Sessão
                    </button>
                </div>

                {/* New Session Form */}
                {showNewSession && (
                    <div className="card space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Registrar Nova Sessão
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Paciente */}
                            <div>
                                <label className="label">Paciente</label>
                                <select
                                    className="input-field select-field"
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
                            </div>

                            {/* Data */}
                            <div>
                                <label className="label">Data</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                />
                            </div>

                            {/* Duração */}
                            <div>
                                <label className="label">Duração (min)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    min={15}
                                    max={180}
                                    step={15}
                                />
                            </div>

                            {/* Tipo */}
                            <div>
                                <label className="label">Tipo de Sessão</label>
                                <select
                                    className="input-field select-field"
                                    value={sessionType}
                                    onChange={(e) => setSessionType(e.target.value)}
                                >
                                    {SESSION_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Goals & Progress */}
                        {selectedPatient && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Target className="w-4 h-4 text-primary" />
                                        Metas do Paciente
                                    </h3>
                                    <button
                                        onClick={() => setShowNewGoal(!showNewGoal)}
                                        className="btn btn-sm btn-outline"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Nova Meta
                                    </button>
                                </div>

                                {/* Add new goal form */}
                                {showNewGoal && (
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Nome da meta"
                                                value={newGoalName}
                                                onChange={(e) => setNewGoalName(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Categoria (ex: Comunicação)"
                                                value={newGoalCategory}
                                                onChange={(e) => setNewGoalCategory(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    placeholder="Meta %"
                                                    value={newGoalTarget}
                                                    onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                                                    min={1}
                                                    max={100}
                                                />
                                                <button
                                                    onClick={handleSaveGoal}
                                                    className="btn btn-primary btn-sm"
                                                    disabled={!newGoalName}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Goals list */}
                                {goals.length === 0 ? (
                                    <p className="text-muted text-sm py-4 text-center">
                                        Nenhuma meta cadastrada para este paciente.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {goals.map((goal) => {
                                            const entry = progressEntries.find((e) => e.goal_id === goal.id);
                                            const percentage = entry && entry.trials > 0
                                                ? ((entry.correct / entry.trials) * 100).toFixed(0)
                                                : '-';

                                            return (
                                                <div
                                                    key={goal.id}
                                                    className="p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors"
                                                >
                                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">{goal.name}</p>
                                                            <p className="text-xs text-muted">
                                                                {goal.category} • Meta: {goal.target_percentage}%
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-xs text-muted whitespace-nowrap">Tentativas:</label>
                                                                <input
                                                                    type="number"
                                                                    className="input-field w-16 text-center py-2"
                                                                    min={0}
                                                                    value={entry?.trials || 0}
                                                                    onChange={(e) => updateProgressEntry(goal.id, 'trials', Number(e.target.value))}
                                                                />
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <label className="text-xs text-muted whitespace-nowrap">Acertos:</label>
                                                                <input
                                                                    type="number"
                                                                    className="input-field w-16 text-center py-2"
                                                                    min={0}
                                                                    max={entry?.trials || 0}
                                                                    value={entry?.correct || 0}
                                                                    onChange={(e) => updateProgressEntry(goal.id, 'correct', Number(e.target.value))}
                                                                />
                                                            </div>

                                                            <select
                                                                className="input-field select-field py-2 text-sm"
                                                                value={entry?.prompt_level || 'independent'}
                                                                onChange={(e) => updateProgressEntry(goal.id, 'prompt_level', e.target.value)}
                                                            >
                                                                {PROMPT_LEVELS.map((level) => (
                                                                    <option key={level.value} value={level.value}>
                                                                        {level.label}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <div className={`badge ${percentage !== '-' && Number(percentage) >= goal.target_percentage
                                                                ? 'badge-success'
                                                                : 'badge-neutral'
                                                                }`}>
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
                        <div>
                            <label className="label">Observações</label>
                            <textarea
                                className="input-field textarea-field"
                                placeholder="Anotações sobre a sessão..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowNewSession(false)}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveSession}
                                className="btn btn-primary"
                                disabled={!selectedPatient || saving}
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Salvando...' : 'Salvar Sessão'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Sessions List */}
                <div className="card">
                    <h2 className="text-lg font-semibold mb-4">Sessões Recentes</h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-muted">Nenhuma sessão registrada ainda</p>
                            <p className="text-xs text-muted mt-1">
                                Clique em &quot;Nova Sessão&quot; para começar
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center">
                                                <User className="w-5 h-5 text-lavender-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {session.patient?.full_name || 'Paciente'}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {formatDate(session.session_date)} • {session.duration_minutes} min •
                                                    {SESSION_TYPES.find((t) => t.value === session.session_type)?.label}
                                                </p>
                                            </div>
                                        </div>
                                        {session.notes && (
                                            <p className="text-sm text-muted max-w-xs truncate hidden md:block">
                                                {session.notes}
                                            </p>
                                        )}
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
