import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminUsersPage() {
    const supabase = await createClient();

    const { data: users, error } = await supabase
        .from('users_profile')
        .select(`
      *,
      subscriptions (
        status,
        plan_type,
        ends_at
      )
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Gerenciar Usuários
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Lista de todos os psicólogos cadastrados
                    </p>
                </div>
                <button className="btn btn-primary">
                    + Convidar Psicólogo
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Usuário / CRP</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Plano</th>
                                <th className="px-6 py-4 font-semibold">Data Cadastro</th>
                                <th className="px-6 py-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {users?.map((user) => {
                                // @ts-ignore - Supabase type inference limitation with joins sometimes
                                const subscription = user.subscriptions?.[0];
                                const status = subscription?.status || 'no_sub';

                                return (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {user.id.substring(0, 8)}...
                                            </div>
                                            <div className="text-slate-500 text-xs">
                                                CRP: {user.crp || 'Não informado'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${status === 'trial' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                        ${status === 'past_due' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${status === 'no_sub' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400' : ''}
                      `}>
                                                {status === 'active' && 'Ativo'}
                                                {status === 'trial' && 'Em Teste'}
                                                {status === 'past_due' && 'Vencido'}
                                                {status === 'no_sub' && 'Sem Assinatura'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {subscription?.plan_type === 'monthly' ? 'Mensal' :
                                                subscription?.plan_type === 'yearly' ? 'Anual' : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {(!users || users.length === 0) && (
                        <div className="p-8 text-center text-slate-500">
                            Nenhum usuário encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
