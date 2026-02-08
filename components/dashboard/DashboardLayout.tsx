'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Brain,
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    Bell,
    ClipboardList,
    BarChart3,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/pacientes', icon: Users, label: 'Pacientes' },
    { href: '/dashboard/agenda', icon: Calendar, label: 'Agenda' },
    { href: '/dashboard/sessoes', icon: ClipboardList, label: 'Sessões ABA' },
    { href: '/dashboard/relatorios', icon: BarChart3, label: 'Relatórios' },
    { href: '/dashboard/prontuario', icon: FileText, label: 'Prontuário' },
    { href: '/dashboard/financeiro', icon: DollarSign, label: 'Financeiro' },
    { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
]

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Detectar tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarCollapsed(true)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const sidebarWidth = sidebarCollapsed ? '72px' : '260px'

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen bg-white border-r border-[var(--border-subtle)]
                    flex flex-direction-column z-50 transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
                style={{ width: sidebarWidth }}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Brand */}
                    <div className={`flex items-center gap-3 mb-6 ${sidebarCollapsed ? 'justify-center' : 'px-2'}`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, var(--lavender-500) 0%, var(--sky-500) 100%)' }}>
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <div>
                                <span className="font-semibold text-[var(--foreground)]">Gabriela</span>
                                <p className="text-xs text-[var(--foreground-muted)]">Psicóloga</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                                        ${sidebarCollapsed ? 'justify-center' : ''}
                                        ${isActive
                                            ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                                            : 'text-[var(--foreground-secondary)] hover:bg-[var(--gray-100)] hover:text-[var(--foreground)]'
                                        }
                                    `}
                                    onClick={() => setSidebarOpen(false)}
                                    title={sidebarCollapsed ? item.label : ''}
                                >
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                                    {!sidebarCollapsed && (
                                        <span className="text-sm font-medium">{item.label}</span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Collapse Button */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden lg:flex items-center justify-center w-full p-2 mb-2 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--gray-100)] hover:text-[var(--foreground)] transition-colors"
                        title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
                    >
                        {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        {!sidebarCollapsed && <span className="text-sm ml-2">Recolher</span>}
                    </button>

                    {/* Logout */}
                    <div className="pt-4 border-t border-[var(--border)]">
                        <button
                            onClick={handleLogout}
                            className={`
                                flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all
                                text-[var(--error)] hover:bg-[var(--error-light)]
                                ${sidebarCollapsed ? 'justify-center' : ''}
                            `}
                            title={sidebarCollapsed ? 'Sair' : ''}
                        >
                            <LogOut className="w-5 h-5" />
                            {!sidebarCollapsed && <span className="text-sm font-medium">Sair</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className="transition-all duration-300 ease-in-out"
                style={{ marginLeft: `calc(${sidebarWidth})` }}
            >
                {/* Top Bar */}
                <header className="h-16 border-b border-[var(--border)] bg-white px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-xl hover:bg-[var(--gray-100)] text-[var(--foreground-secondary)]"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Page Title */}
                    <div className="lg:hidden font-semibold text-[var(--foreground)]">
                        {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block" />

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="p-2 rounded-xl hover:bg-[var(--gray-100)] text-[var(--foreground-secondary)] relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full" />
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-sm font-semibold">
                                GFL
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-[var(--foreground)]">Gabriela</p>
                                <p className="text-xs text-[var(--foreground-muted)]">Psicóloga</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
