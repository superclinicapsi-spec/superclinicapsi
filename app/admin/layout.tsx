import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('users_profile')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'platform_admin') {
        redirect('/dashboard'); // Kick non-admins back to user dashboard
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl">
                            admin_panel_settings
                        </span>
                        <span className="font-bold text-lg text-slate-800 dark:text-white">
                            Master Admin
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        Visão Geral
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">group</span>
                        Usuários
                    </Link>
                    <Link
                        href="/admin/subscriptions"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">payments</span>
                        Assinaturas
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        Configurações
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Voltar ao App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
