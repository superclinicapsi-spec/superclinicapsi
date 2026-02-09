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
    Search
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
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
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

    return (
        <div className="min-h-screen bg-[#F5F6F8] flex">
            {/* Mobile Overlay */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Fixed Full Height */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out
                    flex flex-col w-[280px]
                    ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
                `}
            >
                {/* Profile Header */}
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                            {/* Placeholder if no image */}
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h2 className="font-bold text-gray-900 text-[15px] leading-tight truncate">Gabriela Fernandes</h2>
                            <p className="text-sm text-gray-500 font-medium">CRP 06/123456</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-2">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => isMobile && setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-purple-100/80 text-gray-900 font-bold'
                                            : 'text-gray-600 hover:text-purple-600'
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`
                                            w-[22px] h-[22px]
                                            ${isActive ? 'text-purple-700' : 'text-gray-500 group-hover:text-purple-600'}
                                        `}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className="text-[15px]">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="p-6 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl w-full text-gray-600 hover:text-red-600 transition-colors group"
                    >
                        <LogOut className="w-[22px] h-[22px] text-gray-500 group-hover:text-red-500" />
                        <span className="font-medium text-[15px]">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex flex-col
                    ${isMobile ? 'ml-0' : 'ml-[280px]'}
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
                    </div>
                </header>

                {/* Desktop Header (Without Profile/Search to match minimalist look if desired, or keep search)
                    The user's reference image for the sidebar implies a change to the sidebar primarily.
                    I will keep a minimal header for context but remove the duplicate profile info.
                 */}
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
