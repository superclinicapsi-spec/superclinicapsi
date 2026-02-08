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
    X,
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
    const [isMobile, setIsMobile] = useState(false)

    // Detectar mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-[var(--gray-50)]">
            {/* Mobile Overlay */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop e Mobile */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen bg-white z-50
                    border-r border-[var(--gray-200)]
                    w-[260px] flex flex-col
                    transition-transform duration-300 ease-out
                    ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                {/* Close button mobile */}
                {isMobile && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-500)] lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Brand */}
                <div className="p-5 border-b border-[var(--gray-100)]">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, var(--lavender-500) 0%, var(--sky-400) 100%)' }}
                        >
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-semibold text-[var(--gray-900)]">SuperClínica</span>
                            <p className="text-xs text-[var(--gray-500)]">Psicologia Clínica</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 overflow-y-auto">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? 'bg-[var(--lavender-100)] text-[var(--lavender-700)]'
                                            : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--lavender-600)]' : 'text-[var(--gray-400)]'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* Profile & Logout */}
                <div className="p-3 border-t border-[var(--gray-100)]">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-[var(--gray-50)]">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                            style={{ background: 'linear-gradient(135deg, var(--lavender-200) 0%, var(--sky-200) 100%)', color: 'var(--lavender-700)' }}>
                            GFL
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--gray-900)] truncate">Gabriela Fernandes</p>
                            <p className="text-xs text-[var(--gray-500)] truncate">CRP 06/123456</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--gray-500)] hover:bg-[var(--error-light)] hover:text-[var(--error)] transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-[260px] min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-[var(--gray-200)] px-4 lg:px-6">
                    <div className="flex items-center justify-between h-full max-w-[1400px] mx-auto">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-[var(--gray-100)] text-[var(--gray-600)]"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Breadcrumb / Page Title */}
                            <div className="hidden sm:flex items-center gap-2 text-sm">
                                <Link href="/dashboard" className="text-[var(--gray-500)] hover:text-[var(--gray-700)]">
                                    Dashboard
                                </Link>
                                {pathname !== '/dashboard' && (
                                    <>
                                        <ChevronLeft className="w-4 h-4 text-[var(--gray-400)] rotate-180" />
                                        <span className="text-[var(--gray-900)] font-medium">
                                            {navItems.find(item => pathname.startsWith(item.href) && item.href !== '/dashboard')?.label || 'Página'}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Mobile Title */}
                            <span className="sm:hidden text-sm font-semibold text-[var(--gray-900)]">
                                {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
                            </span>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl hover:bg-[var(--gray-100)] text-[var(--gray-600)]">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--lavender-500)] rounded-full ring-2 ring-white" />
                            </button>

                            {/* Profile (desktop only) */}
                            <div className="hidden lg:flex items-center gap-2 ml-2 pl-2 border-l border-[var(--gray-200)]">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                                    style={{ background: 'linear-gradient(135deg, var(--lavender-200) 0%, var(--sky-200) 100%)', color: 'var(--lavender-700)' }}>
                                    GFL
                                </div>
                                <div className="hidden xl:block">
                                    <p className="text-sm font-medium text-[var(--gray-900)]">Gabriela</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6 max-w-[1400px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
