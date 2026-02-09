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
    Save,
    ArrowLeft,
    Clock,
    Tag,
    Share2,
    MoreVertical
} from 'lucide-react'

// Mock data
const mockPatientNotes = [
    {
        id: 1,
        patient: { id: 1, name: 'Maria Silva', image: null },
        sessions: [
            { id: 1, date: '07/02/2026', time: '14:00', duration: '50min', notes: 'Paciente demonstrou melhora significativa no controle da ansiedade. Relatou estar dormindo melhor e conseguindo aplicar técnicas de respiração aprendidas na semana anterior. Discutimos novos gatilhos identificados no ambiente de trabalho.', themes: ['Ansiedade', 'Sono', 'Trabalho'] },
            { id: 2, date: '31/01/2026', time: '14:00', duration: '50min', notes: 'Trabalhamos técnicas de relaxamento e mindfulness. Paciente apresentou resistência inicial mas se engajou ao longo da sessão. Dever de casa: praticar respiração diafragmática 5min por dia.', themes: ['Mindfulness', 'Relaxamento'] },
            { id: 3, date: '24/01/2026', time: '14:00', duration: '60min', notes: 'Primeira sessão. Anamnese realizada. Paciente busca tratamento por quadro de ansiedade generalizada. Histórico familiar de depressão.', themes: ['Anamnese', 'Ansiedade'] },
        ]
    },
    {
        id: 2,
        patient: { id: 2, name: 'João Santos', image: null },
        sessions: [
            { id: 4, date: '06/02/2026', time: '10:00', duration: '50min', notes: 'Discussão sobre relacionamentos interpessoais no trabalho. Paciente relatou conflitos com chefe imediato. Trabalhamos assertividade.', themes: ['Trabalho', 'Relacionamentos'] },
            { id: 5, date: '30/01/2026', time: '10:00', duration: '50min', notes: 'Exploramos padrões de comportamento em situações de estresse. Identificação de crenças limitantes sobre competência profissional.', themes: ['Estresse', 'Padrões'] },
        ]
    },
    {
        id: 3,
        patient: { id: 3, name: 'Carlos Lima', image: null },
        sessions: [
            { id: 6, date: '05/02/2026', time: '16:00', duration: '50min', notes: 'Sessão focada em elaboração do luto. Paciente conseguiu expressar emoções represadas. Chorou durante grande parte da sessão, o que foi terapêutico.', themes: ['Luto', 'Emoções'] },
        ]
    },
]

export default function ProntuarioPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPatient, setSelectedPatient] = useState<typeof mockPatientNotes[0] | null>(null)
    const [selectedSession, setSelectedSession] = useState<typeof mockPatientNotes[0]['sessions'][0] | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedNotes, setEditedNotes] = useState('')

    // Mobile navigation state
    const [mobileView, setMobileView] = useState<'patients' | 'sessions' | 'notes'>('patients')

    const filteredPatients = mockPatientNotes.filter(p =>
        p.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectPatient = (patient: typeof mockPatientNotes[0]) => {
        setSelectedPatient(patient)
        setSelectedSession(null)
        setIsEditing(false)
        setMobileView('sessions')
    }

    const handleSelectSession = (session: typeof mockPatientNotes[0]['sessions'][0]) => {
        setSelectedSession(session)
        setEditedNotes(session.notes)
        setIsEditing(false)
        setMobileView('notes')
    }

    const handleBack = () => {
        if (mobileView === 'notes') {
            setMobileView('sessions')
            setSelectedSession(null)
        } else if (mobileView === 'sessions') {
            setMobileView('patients')
            setSelectedPatient(null)
        }
    }

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-100px)] flex flex-col">
                {/* Page Header */}
                <div className="mb-6 flex-shrink-0">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Prontuário Eletrônico</h1>
                    <p className="text-gray-500 mt-1">Gestão segura de registros clínicos</p>
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                    {/* Column 1: Patient List */}
                    <div className={`
                        lg:col-span-3 flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
                        ${mobileView !== 'patients' ? 'hidden lg:flex' : 'flex'}
                    `}>
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar paciente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-200 focus:ring-2 focus:ring-purple-50 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredPatients.map((patientData) => (
                                <button
                                    key={patientData.id}
                                    onClick={() => handleSelectPatient(patientData)}
                                    className={`
                                        w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border border-transparent
                                        ${selectedPatient?.id === patientData.id
                                            ? 'bg-purple-50 border-purple-100 text-purple-900'
                                            : 'hover:bg-gray-50 hover:border-gray-200 text-gray-700'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                                        ${selectedPatient?.id === patientData.id ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}
                                    `}>
                                        {patientData.patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{patientData.patient.name}</p>
                                        <p className="text-xs opacity-70">{patientData.sessions.length} registros</p>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 ${selectedPatient?.id === patientData.id ? 'text-purple-400' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Sessions List */}
                    <div className={`
                        lg:col-span-3 flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
                        ${mobileView !== 'sessions' ? 'hidden lg:flex' : 'flex'}
                    `}>
                        {selectedPatient ? (
                            <>
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <div className="flex items-center gap-2">
                                        <button onClick={handleBack} className="lg:hidden p-1.5 hover:bg-gray-200 rounded-lg">
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <h3 className="font-bold text-gray-900">Histórico</h3>
                                    </div>
                                    <button className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors" title="Nova Sessão">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {selectedPatient.sessions.map((session) => (
                                        <button
                                            key={session.id}
                                            onClick={() => handleSelectSession(session)}
                                            className={`
                                                w-full text-left p-4 rounded-xl border transition-all relative group
                                                ${selectedSession?.id === session.id
                                                    ? 'bg-white border-purple-200 shadow-sm ring-1 ring-purple-50'
                                                    : 'bg-white border-gray-100 hover:border-purple-100 hover:shadow-sm'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {session.date}
                                                </div>
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                    {session.time}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                                                {session.notes}
                                            </p>
                                            <div className="flex gap-1 flex-wrap">
                                                {session.themes.slice(0, 2).map(theme => (
                                                    <span key={theme} className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">
                                                        #{theme}
                                                    </span>
                                                ))}
                                                {session.themes.length > 2 && (
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded">
                                                        +{session.themes.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="font-medium">Selecione um paciente</p>
                                <p className="text-sm mt-1">Para visualizar o histórico</p>
                            </div>
                        )}
                    </div>

                    {/* Column 3: Editor/Viewer */}
                    <div className={`
                        lg:col-span-6 flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
                        ${mobileView !== 'notes' ? 'hidden lg:flex' : 'flex'}
                    `}>
                        {selectedSession ? (
                            <>
                                {/* Header */}
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                    <div className="flex items-center gap-3">
                                        <button onClick={handleBack} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg">
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <div>
                                            <h2 className="font-bold text-gray-900">{selectedPatient?.patient.name}</h2>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {selectedSession.date}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedSession.duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                    Cancelar
                                                </button>
                                                <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5">
                                                    <Save className="w-3.5 h-3.5" /> Salvar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                                    Editar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                                    {isEditing ? (
                                        <textarea
                                            value={editedNotes}
                                            onChange={(e) => setEditedNotes(e.target.value)}
                                            className="w-full h-full p-6 bg-transparent border-none outline-none resize-none text-gray-800 leading-relaxed text-base font-serif"
                                            placeholder="Comece a escrever..."
                                            autoFocus
                                        />
                                    ) : (
                                        <div className="p-6">
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {selectedSession.themes.map((theme, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                                                        <Tag className="w-3 h-3" /> {theme}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="prose prose-purple max-w-none">
                                                <p className="text-gray-800 leading-7 whitespace-pre-wrap font-serif">
                                                    {selectedSession.notes}
                                                </p>
                                            </div>

                                            <div className="mt-12 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-4">
                                                <Lock className="w-3 h-3" />
                                                Prontuário assinado digitalmente e criptografado.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <FileText className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Visualizador de Prontuário</h3>
                                <p className="max-w-xs mx-auto">Selecione uma sessão ao lado para ler as anotações clínicas ou iniciar uma edição.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
