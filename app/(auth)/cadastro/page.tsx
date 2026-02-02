'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function CadastroPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validações
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            setLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            // Cria a conta
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                },
            });

            if (signUpError) {
                if (signUpError.message.includes('already registered')) {
                    setError('Este email já está cadastrado.');
                } else {
                    setError('Erro ao criar conta. Tente novamente.');
                }
                setLoading(false);
                return;
            }

            // Redireciona para onboarding
            router.push('/onboarding');
        } catch (err) {
            console.error('Erro no cadastro:', err);
            setError('Erro ao criar conta. Tente novamente.');
            setLoading(false);
        }
        const handleGoogleSignup = async () => {
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
                console.error('Erro no cadastro com Google:', err);
                setError('Erro ao conectar com Google.');
                setLoading(false);
            }
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-background py-12">
                <div className="card max-w-md w-full mx-4">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Criar Conta
                        </h1>
                        <p className="text-muted text-sm">
                            Comece a gerenciar sua prática clínica
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <button
                            onClick={handleGoogleSignup}
                            type="button"
                            disabled={loading}
                            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Criar conta com Google
                        </button>

                        <div className="relative flex items-center gap-4">
                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                            <span className="text-xs text-slate-400 font-medium uppercase">ou email</span>
                            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="label">
                                Nome Completo
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Dra. Maria Silva"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="label">
                                Email Profissional
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="maria@clinica.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Mínimo 8 caracteres"
                                required
                                disabled={loading}
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="label">
                                Confirmar Senha
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Digite a senha novamente"
                                required
                                disabled={loading}
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </button>

                        <div className="text-center text-sm text-secondary">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Fazer login
                            </Link>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs text-center text-muted">
                            Ao criar uma conta, você concorda com nossos{' '}
                            <a href="#" className="text-primary hover:underline">
                                Termos de Uso
                            </a>{' '}
                            e{' '}
                            <a href="#" className="text-primary hover:underline">
                                Política de Privacidade (LGPD)
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
