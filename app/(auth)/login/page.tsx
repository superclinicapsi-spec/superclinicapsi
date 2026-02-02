'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError('Email ou senha incorretos.');
                setLoading(false);
                return;
            }

            // Verifica se usuário completou onboarding
            const { data: profile } = await supabase
                .from('users_profile')
                .select('crp, specialties, locations')
                .eq('id', data.user.id)
                .single();

            if (!profile || !profile.crp) {
                // Redireciona para onboarding se não completou
                router.push('/onboarding');
            } else {
                // Redireciona para dashboard
                router.push('/dashboard');
            }
            router.refresh();
        } catch (err: any) {
            console.error('Erro no login:', err);
            setError(err.message || 'Erro ao fazer login. Tente novamente.');
            setLoading(false);
        }
        const handleGoogleLogin = async () => {
            setLoading(true);
            try {
                const supabase = createClient();
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;
            } catch (err: any) {
                console.error('Erro no login com Google:', err);
                setError('Erro ao conectar com Google.');
                setLoading(false);
            }
        };

        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm bg-white dark:bg-[#1a2632] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex flex-col items-center mb-8 bg-blue-500">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-primary font-bold">
                                psychology
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            Bem-vindo de volta
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Faça login para acessar o sistema
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            disabled={loading}
                            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Entrar com Google
                        </button>

                        <div className="relative flex items-center gap-4 my-6">
                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                            <span className="text-xs text-slate-400 font-medium uppercase">ou email</span>
                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    Lembrar-me
                                </span>
                            </label>
                            <Link
                                href="/recuperar-senha"
                                className="text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                            >
                                Esqueceu a senha?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 mt-2 flex items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-xl">
                                    progress_activity
                                </span>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Não tem conta?{" "}
                            <Link
                                href="/cadastro"
                                className="font-bold text-primary hover:text-primary-hover transition-colors"
                            >
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center opacity-60">
                    <p className="text-xs font-medium text-slate-400">
                        Clinical PWA v2.0 • HIPAA Compliant
                    </p>
                </div>
            </div>
        );
    }
