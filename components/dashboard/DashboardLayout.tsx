'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardList,
    BarChart3,
    FileText,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    Bell,
    ChevronLeft,
    ChevronRight,
    Search,
    User
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
    const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile drawer state
    const [sidebarExpanded, setSidebarExpanded] = useState(true) // Desktop expand/collapse
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            if (mobile) {
                setSidebarExpanded(true) // Always expanded inside drawer
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

    // Dynamic width for desktop
    const sidebarWidth = sidebarExpanded ? 280 : 88

    return (
        <div className="min-h-screen bg-[#F2F4F8] flex">
            {/* Mobile Overlay */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed z-50 bg-white shadow-xl transition-all duration-300 ease-in-out
                    flex flex-col justify-between border-r border-gray-100/50
                    ${isMobile
                        ? 'inset-y-0 left-0 w-[280px]'
                        : `top-4 bottom-4 left-4 rounded-[2.5rem] border-r-0 ${sidebarExpanded ? 'w-[280px]' : 'w-[88px]'}`
                    }
                    ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
                `}
            >
                {/* Profile Header (Top) */}
                <div className={`
                    flex flex-col items-center pt-8 pb-6 px-4 transition-all duration-300
                    ${!sidebarExpanded && !isMobile ? 'px-2' : ''}
                `}>
                    <div className="relative mb-4 group cursor-pointer">
                        <div className={`
                            relative rounded-full p-1 bg-gradient-to-tr from-purple-500 to-blue-500
                            ${!sidebarExpanded && !isMobile ? 'w-12 h-12' : 'w-20 h-20'}
                            transition-all duration-300
                        `}>
                            <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                                    {/* Placeholder for user image */}
                                    <span className={!sidebarExpanded && !isMobile ? 'text-sm' : 'text-2xl'}>GF</span>
                                </div>
                            </div>
                        </div>
                        {/* Status Indicator */}
                        <div className={`
                            absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full
                            ${!sidebarExpanded && !isMobile ? 'scale-75 bottom-0 right-0' : ''}
                        `}></div>
                    </div>

                    {/* Text Info - Only visible when expanded */}
                    <div className={`
                        text-center transition-all duration-300 overflow-hidden
                        ${!sidebarExpanded && !isMobile ? 'h-0 opacity-0' : 'h-auto opacity-100'}
                    `}>
                        <h2 className="font-bold text-gray-900 text-lg leading-tight truncate px-2">Gabriela Fernandes</h2>
                        <p className="text-sm text-purple-600 font-medium">Psicóloga Clínica</p>
                    </div>
                </div>

                {/* Navigation Links (Middle) */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4 space-y-2">
                    {/* Collapse Toggle (Desktop only, positioned relative to nav) */}
                    {!isMobile && (
                        <div className="absolute top-8 -right-3 z-50">
                            <button
                                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                                className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                        </div>
                    )}

                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => isMobile && setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                        : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
                                    }
                                    ${!sidebarExpanded && !isMobile ? 'justify-center px-0 w-12 h-12 mx-auto' : ''}
                                `}
                                title={!sidebarExpanded ? item.label : ''}
                            >
                                <item.icon
                                    className={`
                                        w-[22px] h-[22px] transition-transform duration-200
                                        ${!sidebarExpanded && !isMobile ? '' : 'group-hover:scale-110'}
                                        ${isActive ? 'text-white' : ''}
                                    `}
                                />

                                <span className={`
                                    font-medium whitespace-nowrap transition-all duration-300 origin-left
                                    ${!sidebarExpanded && !isMobile ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
                                `}>
                                    {item.label}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {!sidebarExpanded && !isMobile && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                        {item.label}
                                        {/* Little triangles for tooltip could go here */}
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout Button (Bottom) */}
                <div className="p-4 border-t border-gray-100/50">
                    <button
                        onClick={handleLogout}
                        className={`
                            flex items-center gap-4 px-4 py-3.5 rounded-2xl w-full transition-all duration-200
                            text-gray-400 hover:bg-red-50 hover:text-red-600
                            ${!sidebarExpanded && !isMobile ? 'justify-center px-0 w-12 h-12 mx-auto' : ''}
                        `}
                        title="Sair"
                    >
                        <LogOut className={`w-[22px] h-[22px] ${!sidebarExpanded && !isMobile ? '' : ''}`} />
                        <span className={`
                            font-medium whitespace-nowrap transition-all duration-300
                            ${!sidebarExpanded && !isMobile ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
                        `}>
                            Sair da conta
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex flex-col
                    ${isMobile ? 'ml-0' : ''}
                    ${!isMobile && sidebarExpanded ? 'ml-[312px]' : ''}
                    ${!isMobile && !sidebarExpanded ? 'ml-[120px]' : ''}
                `}
            >
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-gray-900 text-lg">
                            SuperClínica
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                            GF
                        </div>
                    </div>
                </header>

                {/* Desktop Header (Minimalist) */}
                <header className={`
                    hidden lg:flex items-center justify-between h-20 px-8 py-4 mb-2
                `}>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
                        </h1>
                        <p className="text-sm text-gray-400 font-medium">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="pl-10 pr-4 py-2.5 bg-white border-none rounded-2xl shadow-sm w-64 text-sm focus:ring-2 focus:ring-purple-100 outline-none placeholder:text-gray-400"
                            />
                        </div>
                        <button className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 px-4 lg:px-8 pb-8 max-w-[1600px] w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
