import { createClient } from '@/lib/supabase/server';
import UserManagementTable from './UserManagementTable';

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
                <button className="btn btn-primary cursor-not-allowed opacity-50" disabled>
                    + Convidar Psicólogo
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <UserManagementTable users={users || []} />

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
