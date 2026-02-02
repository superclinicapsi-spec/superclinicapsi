import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch Stats
    const { count: userCount } = await supabase
        .from('users_profile')
        .select('*', { count: 'exact', head: true });

    const { count: activeSubs } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    const { count: trialSubs } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'trial');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Controladoria Master
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Visão geral da plataforma SaaS
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Total de Usuários
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {userCount || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Assinaturas Ativas
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {activeSubs || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined">experiment</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Em Período de Teste
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {trialSubs || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <span className="material-symbols-outlined">attach_money</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Receita Mensal (Est.)
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                R$ {((activeSubs || 0) * 149.90).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
