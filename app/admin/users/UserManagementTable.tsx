'use client';

import { updateUserSubscription } from '../actions';
import { useTransition } from 'react';

type User = {
    id: string;
    crp: string | null;
    created_at: string;
    subscriptions: {
        status: string;
        plan_type: string;
    }[];
};

export default function UserManagementTable({ users }: { users: any[] }) {
    const [isPending, startTransition] = useTransition();

    return (
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
                    // @ts-ignore
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
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                  ${status === 'trial' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                  ${status === 'past_due' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                  ${status === 'canceled' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' : ''}
                  ${status === 'no_sub' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400' : ''}
                `}
                                >
                                    {status === 'active' && 'Ativo'}
                                    {status === 'trial' && 'Em Teste'}
                                    {status === 'past_due' && 'Vencido'}
                                    {status === 'canceled' && 'Cancelado'}
                                    {status === 'no_sub' && 'Sem Assinatura'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                {subscription?.plan_type === 'monthly'
                                    ? 'Mensal'
                                    : subscription?.plan_type === 'yearly'
                                        ? 'Anual'
                                        : '-'}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <form
                                        action={async (formData) => {
                                            const result = await updateUserSubscription(formData);
                                            if (result?.error) {
                                                alert(result.error);
                                            }
                                        }}
                                    >
                                        <input type="hidden" name="userId" value={user.id} />
                                        {status !== 'active' ? (
                                            <button
                                                type="submit"
                                                name="action"
                                                value="activate"
                                                disabled={isPending}
                                                className="text-green-600 hover:text-green-700 font-medium text-xs px-3 py-1 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                                            >
                                                Ativar
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                name="action"
                                                value="deactivate"
                                                disabled={isPending}
                                                className="text-red-600 hover:text-red-700 font-medium text-xs px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Bloquear
                                            </button>
                                        )}
                                    </form>

                                    {status === 'no_sub' && (
                                        <form
                                            action={async (formData) => {
                                                const result = await updateUserSubscription(formData);
                                                if (result?.error) {
                                                    alert(result.error);
                                                }
                                            }}
                                        >
                                            <input type="hidden" name="userId" value={user.id} />
                                            <button
                                                type="submit"
                                                name="action"
                                                value="trial"
                                                disabled={isPending}
                                                className="text-purple-600 hover:text-purple-700 font-medium text-xs px-3 py-1 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                                            >
                                                Dar Trial
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
