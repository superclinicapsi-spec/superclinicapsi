'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import {
    Search,
    FileText,
    Calendar,
    User,
    Plus,
    ChevronRight,
    Lock,
    Save
} from 'lucide-react'

// Mock data
const mockPatientNotes = [
    {
        id: 1,
        patient: { id: 1, name: 'Maria Silva' },
        sessions: [
            { id: 1, date: '07/02/2026', notes: 'Paciente demonstrou melhora significativa no controle da ansiedade. Relatou estar dormindo melhor e conseguindo aplicar técnicas de respiração.', themes: ['Ansiedade', 'Sono'] },
            { id: 2, date: '31/01/2026', notes: 'Trabalhamos técnicas de relaxamento e mindfulness. Paciente apresentou resistência inicial mas se engajou ao longo da sessão.', themes: ['Mindfulness', 'Relaxamento'] },
            { id: 3, date: '24/01/2026', notes: 'Primeira sessão. Anamnese realizada. Paciente busca tratamento por quadro de ansiedade generalizada.', themes: ['Anamnese', 'Ansiedade'] },
        ]
    },
    {
        id: 2,
        patient: { id: 2, name: 'João Santos' },
        sessions: [
            { id: 4, date: '06/02/2026', notes: 'Discussão sobre relacionamentos interpessoais no trabalho. Paciente relatou conflitos com chefe imediato.', themes: ['Trabalho', 'Relacionamentos'] },
            { id: 5, date: '30/01/2026', notes: 'Exploramos padrões de comportamento em situações de estresse.', themes: ['Estresse', 'Padrões'] },
        ]
    },
    {
        id: 3,
        patient: { id: 3, name: 'Carlos Lima' },
        sessions: [
            { id: 6, date: '05/02/2026', notes: 'Sessão focada em elaboração do luto. Paciente conseguiu expressar emoções represadas.', themes: ['Luto', 'Emoções'] },
        ]
    },
]

export default function ProntuarioPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPatient, setSelectedPatient] = useState<typeof mockPatientNotes[0] | null>(null)
    const [selectedSession, setSelectedSession] = useState<typeof mockPatientNotes[0]['sessions'][0] | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedNotes, setEditedNotes] = useState('')

    const filteredPatients = mockPatientNotes.filter(p =>
        p.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectPatient = (patient: typeof mockPatientNotes[0]) => {
        setSelectedPatient(patient)
        setSelectedSession(null)
        setIsEditing(false)
    }

    const handleSelectSession = (session: typeof mockPatientNotes[0]['sessions'][0]) => {
        setSelectedSession(session)
        setEditedNotes(session.notes)
        setIsEditing(false)
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Prontuário</h1>
                <p className="page-subtitle">
                    Notas e registros das sessões
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Patient List */}
                <div className="lg:col-span-3">
                    <div className="card">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    placeholder="Buscar paciente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-field pl-10 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {filteredPatients.map((patientData) => (
                                <button
                                    key={patientData.id}
                                    onClick={() => handleSelectPatient(patientData)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedPatient?.id === patientData.id
                                            ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                                            : 'hover:bg-[var(--lavender-50)]'
                                        }`}
                                >
                                    <div className="avatar avatar-sm">
                                        {patientData.patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{patientData.patient.name}</p>
                                        <p className="text-xs text-muted">{patientData.sessions.length} sessões</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sessions List */}
                <div className="lg:col-span-3">
                    <div className="card h-full">
                        {selectedPatient ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Sessões</h3>
                                    <button className="btn btn-primary btn-sm">
                                        <Plus className="w-4 h-4" />
                                        Nova
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {selectedPatient.sessions.map((session) => (
                                        <button
                                            key={session.id}
                                            onClick={() => handleSelectSession(session)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedSession?.id === session.id
                                                    ? 'bg-[var(--primary-light)]'
                                                    : 'hover:bg-[var(--lavender-50)]'
                                                }`}
                                        >
                                            <Calendar className="w-4 h-4 text-muted" />
                                            <div className="flex-1">
                                                <p className="font-medium">{session.date}</p>
                                                <p className="text-xs text-muted truncate">
                                                    {session.notes.substring(0, 50)}...
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="empty-state h-full flex items-center justify-center">
                                <div>
                                    <User className="empty-state-icon" />
                                    <p>Selecione um paciente</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Session Notes */}
                <div className="lg:col-span-6">
                    <div className="card h-full">
                        {selectedSession ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold">{selectedPatient?.patient.name}</h3>
                                        <p className="text-sm text-muted flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {selectedSession.date}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Salvar notas
                                                        setIsEditing(false)
                                                    }}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Salvar
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Editar
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedSession.themes.map((theme, i) => (
                                        <span key={i} className="badge badge-primary">
                                            {theme}
                                        </span>
                                    ))}
                                </div>

                                {/* Notes Content */}
                                {isEditing ? (
                                    <textarea
                                        value={editedNotes}
                                        onChange={(e) => setEditedNotes(e.target.value)}
                                        className="input-field textarea-field min-h-[300px]"
                                        placeholder="Escreva suas notas da sessão..."
                                    />
                                ) : (
                                    <div className="p-4 rounded-lg bg-[var(--lavender-50)] dark:bg-[var(--primary-light)]">
                                        <p className="leading-relaxed whitespace-pre-wrap">
                                            {selectedSession.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Encryption Notice */}
                                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                                    <Lock className="w-3 h-3" />
                                    <span>Dados criptografados e protegidos conforme LGPD</span>
                                </div>
                            </>
                        ) : (
                            <div className="empty-state h-full flex items-center justify-center">
                                <div>
                                    <FileText className="empty-state-icon" />
                                    <p className="font-medium mb-1">Selecione uma sessão</p>
                                    <p className="text-sm">Escolha uma sessão para visualizar ou editar as notas</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
