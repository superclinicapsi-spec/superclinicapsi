'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import {
    User,
    Bell,
    Lock,
    Palette,
    Mail,
    Phone,
    Save,
    Camera
} from 'lucide-react'

export default function ConfiguracoesPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [saving, setSaving] = useState(false)

    const [profile, setProfile] = useState({
        name: 'Gabriela Fernandes Lacerda',
        email: 'gabriela@email.com',
        phone: '(11) 99999-0000',
        crp: 'CRP 00/00000',
        bio: 'Psicóloga clínica especializada em terapia cognitivo-comportamental.',
    })

    const handleSave = async () => {
        setSaving(true)
        // Simular salvamento
        await new Promise(r => setTimeout(r, 1000))
        setSaving(false)
    }

    const tabs = [
        { id: 'profile', label: 'Perfil', icon: User },
        { id: 'notifications', label: 'Notificações', icon: Bell },
        { id: 'security', label: 'Segurança', icon: Lock },
        { id: 'appearance', label: 'Aparência', icon: Palette },
    ]

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Configurações</h1>
                <p className="page-subtitle">
                    Gerencie suas preferências e dados da conta
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <div className="card">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                                            : 'hover:bg-[var(--lavender-50)]'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-9">
                    {activeTab === 'profile' && (
                        <div className="card">
                            <h2 className="text-lg font-semibold mb-6">Informações do Perfil</h2>

                            {/* Avatar */}
                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[var(--border)]">
                                <div className="relative">
                                    <div className="avatar avatar-xl">
                                        GFL
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{profile.name}</h3>
                                    <p className="text-sm text-muted">{profile.crp}</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Nome Completo</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">CRP</label>
                                        <input
                                            type="text"
                                            value={profile.crp}
                                            onChange={(e) => setProfile({ ...profile, crp: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">
                                            <Mail className="w-4 h-4 inline mr-1" />
                                            E-mail
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">
                                            <Phone className="w-4 h-4 inline mr-1" />
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Biografia</label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="input-field textarea-field"
                                        rows={4}
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="btn btn-primary"
                                    >
                                        {saving ? (
                                            <span className="spinner" />
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Salvar Alterações
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="card">
                            <h2 className="text-lg font-semibold mb-6">Preferências de Notificação</h2>

                            <div className="space-y-4">
                                {[
                                    { id: 'email_appointments', label: 'E-mail de lembretes de consulta', description: 'Receber lembretes por e-mail antes das consultas' },
                                    { id: 'email_payments', label: 'E-mail de pagamentos', description: 'Notificações sobre pagamentos recebidos ou pendentes' },
                                    { id: 'push_appointments', label: 'Notificações push', description: 'Notificações em tempo real no navegador' },
                                    { id: 'sms_appointments', label: 'SMS de lembretes', description: 'Enviar SMS para pacientes lembrando das consultas' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-[var(--lavender-50)]">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-sm text-muted">{item.description}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-[var(--slate-200)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-light)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="card">
                            <h2 className="text-lg font-semibold mb-6">Segurança da Conta</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="label">Senha Atual</label>
                                    <input type="password" className="input-field" placeholder="••••••••" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Nova Senha</label>
                                        <input type="password" className="input-field" placeholder="••••••••" />
                                    </div>
                                    <div>
                                        <label className="label">Confirmar Nova Senha</label>
                                        <input type="password" className="input-field" placeholder="••••••••" />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button className="btn btn-primary">
                                        <Lock className="w-4 h-4" />
                                        Atualizar Senha
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="card">
                            <h2 className="text-lg font-semibold mb-6">Aparência</h2>

                            <div>
                                <label className="label mb-4">Tema</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'light', label: 'Claro', color: 'bg-white' },
                                        { id: 'dark', label: 'Escuro', color: 'bg-[#0c0a12]' },
                                        { id: 'system', label: 'Sistema', color: 'bg-gradient-to-r from-white to-[#0c0a12]' },
                                    ].map((theme) => (
                                        <button
                                            key={theme.id}
                                            className="p-4 rounded-lg border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors text-center"
                                        >
                                            <div className={`w-12 h-12 rounded-lg ${theme.color} border border-[var(--border)] mx-auto mb-2`} />
                                            <span className="font-medium">{theme.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
