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
    X,
    Bell,
    ClipboardList,
    BarChart3,
} from 'lucide-react'
import { useState } from 'react'
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

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="sidebar-brand-text">Gabriela</span>
                        <p className="text-xs text-muted">Psicóloga</p>
                    </div>
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
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="nav-item-icon" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div className="pt-4 border-t border-[var(--border)]">
                    <button
                        onClick={handleLogout}
                        className="nav-item w-full text-left text-[var(--error)] hover:bg-[var(--error-light)]"
                    >
                        <LogOut className="nav-item-icon" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-[280px]">
                {/* Top Bar */}
                <header className="h-16 border-b border-[var(--border)] bg-[var(--card)] px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden btn btn-ghost btn-icon"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Page Title (mobile) */}
                    <div className="lg:hidden font-semibold">
                        {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block" />

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="btn btn-ghost btn-icon relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--primary)] rounded-full" />
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-3">
                            <div className="avatar avatar-md">
                                GFL
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium">Gabriela</p>
                                <p className="text-xs text-muted">Psicóloga</p>
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
