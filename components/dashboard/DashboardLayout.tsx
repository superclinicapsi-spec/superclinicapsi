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
    X,
    PanelLeftClose,
    PanelLeft,
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
    const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile drawer
    const [sidebarExpanded, setSidebarExpanded] = useState(true) // Desktop toggle
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            if (mobile) {
                setSidebarExpanded(false)
            }
        }
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

    // No mobile: drawer (0 ou 260px overlay)
    // No desktop: toggle (0 ou 260px com margin)
    const sidebarWidth = sidebarExpanded ? 260 : 0

    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            {/* Mobile Overlay */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    width: isMobile ? 260 : sidebarWidth,
                    transform: isMobile
                        ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
                        : 'translateX(0)',
                }}
                className={`
                    fixed top-0 left-0 h-screen bg-white z-50
                    border-r border-gray-200
                    flex flex-col
                    transition-all duration-300 ease-out
                    ${!sidebarExpanded && !isMobile ? 'overflow-hidden' : ''}
                `}
            >
                {/* Close button mobile */}
                {isMobile && sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Brand */}
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #9c6de0 0%, #38a3f8 100%)' }}
                        >
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div className="overflow-hidden">
                            <span className="font-semibold text-gray-900 whitespace-nowrap">SuperClínica</span>
                            <p className="text-xs text-gray-500 whitespace-nowrap">Psicologia Clínica</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden">
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
                                        text-sm font-medium transition-all duration-200 whitespace-nowrap
                                        ${isActive
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* Profile & Logout */}
                <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gray-50 overflow-hidden">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #e4d4fb 0%, #bae0ff 100%)', color: '#7a3fc0' }}
                        >
                            GFL
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">Gabriela Fernandes</p>
                            <p className="text-xs text-gray-500 truncate">CRP 06/123456</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div
                style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
                className="min-h-screen transition-all duration-300 ease-out"
            >
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-6">
                    <div className="flex items-center justify-between h-full max-w-[1400px] mx-auto">
                        {/* Left Side */}
                        <div className="flex items-center gap-3">
                            {/* Mobile Menu Button */}
                            {isMobile && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            )}

                            {/* Desktop Toggle Button */}
                            {!isMobile && (
                                <button
                                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                                    className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600"
                                    title={sidebarExpanded ? 'Fechar menu' : 'Abrir menu'}
                                >
                                    {sidebarExpanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
                                </button>
                            )}

                            {/* Page Title */}
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">
                                    {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
                                </span>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-white" />
                            </button>

                            {/* Profile */}
                            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                                    style={{ background: 'linear-gradient(135deg, #e4d4fb 0%, #bae0ff 100%)', color: '#7a3fc0' }}
                                >
                                    GFL
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">Gabriela</p>
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
