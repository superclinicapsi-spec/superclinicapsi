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
    Camera,
    Shield,
    Smartphone,
    Monitor,
    Moon,
    Sun,
    CreditCard
} from 'lucide-react'

export default function ConfiguracoesPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [saving, setSaving] = useState(false)

    const [profile, setProfile] = useState({
        name: 'Gabriela Fernandes Lacerda',
        email: 'gabriela@email.com',
        phone: '(11) 99999-0000',
        crp: 'CRP 06/123456',
        bio: 'Psicóloga clínica especializada em terapia cognitivo-comportamental com foco em TDAH e autismo.',
    })

    const handleSave = async () => {
        setSaving(true)
        // Simulate save
        await new Promise(r => setTimeout(r, 1000))
        setSaving(false)
    }

    const tabs = [
        { id: 'profile', label: 'Meu Perfil', icon: User, description: 'Gerencie suas informações pessoais' },
        { id: 'notifications', label: 'Notificações', icon: Bell, description: 'Escolha como você quer ser notificado' },
        { id: 'security', label: 'Segurança', icon: Shield, description: 'Proteja sua conta e dados' },
        { id: 'billing', label: 'Assinatura', icon: CreditCard, description: 'Gerencie seu plano e pagamentos' },
        { id: 'appearance', label: 'Aparência', icon: Palette, description: 'Personalize a interface' },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Configurações</h1>
                        <p className="text-gray-500 mt-1">
                            Gerencie sua conta e preferências do sistema
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Salvar Alterações
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-start">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <nav className="p-2 space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                                ? 'bg-purple-50 text-purple-700 font-medium ring-1 ring-purple-100'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'}`} />
                                        </div>
                                        <div className="hidden lg:block md:hidden sm:block">
                                            <span className="block text-sm">{tab.label}</span>
                                        </div>
                                        <span className="lg:hidden md:block sm:hidden block text-sm">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9 space-y-6">
                        {activeTab === 'profile' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-2xl font-bold text-purple-600 ring-4 ring-white shadow-lg">
                                            GFL
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                                        <p className="text-gray-500">{profile.crp}</p>
                                        <button className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                                            Alterar foto
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Profissional</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Registro Profissional (CRP)</label>
                                            <input
                                                type="text"
                                                value={profile.crp}
                                                onChange={(e) => setProfile({ ...profile, crp: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all bg-gray-50 text-gray-500 cursor-not-allowed"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Biografia Profissional</label>
                                        <textarea
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all resize-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Essa descrição aparecerá no seu perfil público para pacientes.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Preferências de Notificação</h3>
                                <div className="space-y-6">
                                    {[
                                        { id: 'email_appointments', title: 'Lembretes de Consulta', desc: 'Receba alertas por e-mail 24h antes das sessões agendadas.' },
                                        { id: 'email_payments', title: 'Atualizações Financeiras', desc: 'Notificações sobre pagamentos recebidos, pendentes ou atrasados.' },
                                        { id: 'security_alerts', title: 'Alertas de Segurança', desc: 'Avisos sobre tentativas de login suspeitas ou novos dispositivos.' },
                                        { id: 'marketing_emails', title: 'Novidades da Plataforma', desc: 'Receba atualizações sobre novas funcionalidades e melhorias.' },
                                    ].map((item, index) => (
                                        <div key={item.id} className="flex items-start justify-between pb-6 last:pb-0 last:border-0 border-b border-gray-100">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                                            </div>
                                            <div className="relative inline-block w-12 h-6 rounded-full cursor-pointer">
                                                <input id={item.id} type="checkbox" className="absolute w-full h-full opacity-0 cursor-pointer peer" defaultChecked={index < 3} />
                                                <label htmlFor={item.id} className="block w-full h-full bg-gray-200 rounded-full peer-checked:bg-purple-600 transition-colors duration-300 ease-in-out"></label>
                                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Segurança e Login</h3>

                                <div className="space-y-6">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-blue-900">Autenticação de Dois Fatores (2FA)</h4>
                                            <p className="text-sm text-blue-700 mt-1">Recomendamos ativar a 2FA para aumentar a segurança dos dados dos seus pacientes.</p>
                                            <button className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-800 underline">Ativar agora</button>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6">
                                        <h4 className="font-medium text-gray-900 mb-4">Alterar Senha</h4>
                                        <div className="grid gap-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Personalização</h3>

                                <div className="grid grid-cols-3 gap-4">
                                    <button className="group relative p-4 rounded-xl border-2 border-purple-600 bg-gray-50 hover:bg-white transition-all text-center">
                                        <div className="absolute top-3 right-3 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        </div>
                                        <div className="w-full aspect-video bg-white rounded-lg border border-gray-200 shadow-sm mb-3 group-hover:scale-105 transition-transform flex items-center justify-center">
                                            <Sun className="w-8 h-8 text-amber-500" />
                                        </div>
                                        <span className="font-medium text-gray-900">Modo Claro</span>
                                    </button>

                                    <button className="group p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 bg-gray-50 hover:bg-white transition-all text-center">
                                        <div className="w-full aspect-video bg-gray-900 rounded-lg border border-gray-700 shadow-sm mb-3 group-hover:scale-105 transition-transform flex items-center justify-center">
                                            <Moon className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <span className="font-medium text-gray-900">Modo Escuro</span>
                                    </button>

                                    <button className="group p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 bg-gray-50 hover:bg-white transition-all text-center">
                                        <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-900 rounded-lg border border-gray-200 shadow-sm mb-3 group-hover:scale-105 transition-transform flex items-center justify-center">
                                            <Monitor className="w-8 h-8 text-gray-500" />
                                        </div>
                                        <span className="font-medium text-gray-900">Sistema</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Plano e Pagamento</h3>
                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-purple-200 font-medium mb-1">Seu Plano Atual</p>
                                            <h2 className="text-3xl font-bold">Profissional</h2>
                                            <p className="mt-2 text-sm text-purple-100 opacity-90">Próxima renovação em 15/03/2026</p>
                                        </div>
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold border border-white/20">
                                            Ativo
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Histórico de Faturas</h4>
                                    {[
                                        { date: '15/02/2026', amount: 'R$ 89,90', status: 'Pago' },
                                        { date: '15/01/2026', amount: 'R$ 89,90', status: 'Pago' },
                                        { date: '15/12/2025', amount: 'R$ 89,90', status: 'Pago' },
                                    ].map((invoice, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Mensalidade - Plano Profissional</p>
                                                    <p className="text-xs text-gray-500">{invoice.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{invoice.amount}</p>
                                                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">{invoice.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
