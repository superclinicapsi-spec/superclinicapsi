'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight, Heart, Shield, Puzzle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

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

            // Verifica role do usuário
            const { data: profile } = await supabase
                .from('users_profile')
                .select('role, crp')
                .eq('id', data.user.id)
                .single();

            if (profile?.role === 'family') {
                // Paciente vai para portal do paciente
                router.push('/paciente');
            } else if (!profile || !profile.crp) {
                // Psicóloga sem CRP vai para onboarding
                router.push('/onboarding');
            } else {
                // Psicóloga vai para dashboard
                router.push('/dashboard');
            }
            router.refresh();
        } catch (err: any) {
            console.error('Erro no login:', err);
            setError(err.message || 'Erro ao fazer login. Tente novamente.');
            setLoading(false);
        }
    };

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
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* LEFT SIDE - Decorative Panel */}
            <div style={{
                display: 'none',
                width: '50%',
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)',
                position: 'relative',
                overflow: 'hidden',
                padding: '48px'
            }} className="lg:flex lg:flex-col lg:justify-center lg:items-center">
                {/* Decorative Circles */}
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    left: '80px',
                    width: '256px',
                    height: '256px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '80px',
                    width: '320px',
                    height: '320px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white', maxWidth: '400px' }}>
                    <div style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '24px',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px'
                    }}>
                        <Brain style={{ width: '48px', height: '48px' }} />
                    </div>

                    <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
                        Gabriela Fernandes Lacerda
                    </h1>
                    <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '32px' }}>
                        Psicóloga Clínica • CRP 09/19262
                    </p>

                    <p style={{ fontSize: '18px', opacity: 0.8, lineHeight: 1.7, marginBottom: '48px' }}>
                        Especialista em TEA e Análise do Comportamento Aplicada (ABA) para crianças e adolescentes.
                    </p>

                    {/* Features */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div style={{
                            padding: '20px 16px',
                            borderRadius: '16px',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)'
                        }}>
                            <Heart style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />
                            <p style={{ fontSize: '14px', fontWeight: 500 }}>Acolhimento</p>
                        </div>
                        <div style={{
                            padding: '20px 16px',
                            borderRadius: '16px',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)'
                        }}>
                            <Shield style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />
                            <p style={{ fontSize: '14px', fontWeight: 500 }}>Sigilo Total</p>
                        </div>
                        <div style={{
                            padding: '20px 16px',
                            borderRadius: '16px',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)'
                        }}>
                            <Puzzle style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />
                            <p style={{ fontSize: '14px', fontWeight: 500 }}>Especialista</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                backgroundColor: '#ffffff'
            }} className="lg:w-1/2">
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    {/* Mobile Brand */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }} className="lg:hidden">
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <Brain style={{ width: '32px', height: '32px', color: 'white' }} />
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Gabriela F. Lacerda</h1>
                        <p style={{ color: '#64748b', margin: '4px 0 0' }}>Psicóloga Clínica</p>
                    </div>

                    {/* Form Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                            {isRegister ? 'Criar Conta' : 'Bem-vindo(a) de volta'}
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '16px' }}>
                            {isRegister
                                ? 'Preencha seus dados para criar sua conta'
                                : 'Entre para acessar sua área'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            marginBottom: '24px',
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #ef4444',
                            color: '#dc2626',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '20px',
                                    height: '20px',
                                    color: '#9ca3af'
                                }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="seu@email.com"
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        fontSize: '16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        backgroundColor: '#f9fafb'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                Senha
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '20px',
                                    height: '20px',
                                    color: '#9ca3af'
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '14px 48px 14px 48px',
                                        fontSize: '16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        backgroundColor: '#f9fafb'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#9ca3af'
                                    }}
                                >
                                    {showPassword ? (
                                        <EyeOff style={{ width: '20px', height: '20px' }} />
                                    ) : (
                                        <Eye style={{ width: '20px', height: '20px' }} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        {!isRegister && (
                            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                                <Link
                                    href="/recuperar-senha"
                                    style={{ fontSize: '14px', color: '#a855f7', textDecoration: 'none', fontWeight: 500 }}
                                >
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '16px 24px',
                                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '16px',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                boxShadow: '0 4px 14px rgba(168,85,247,0.35)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {loading ? (
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                            ) : (
                                <>
                                    {isRegister ? 'Criar Conta' : 'Entrar'}
                                    <ArrowRight style={{ width: '20px', height: '20px' }} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>ou continue com</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '14px 24px',
                            backgroundColor: '#ffffff',
                            color: '#374151',
                            fontWeight: 600,
                            fontSize: '16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continuar com Google
                    </button>

                    {/* Toggle Register/Login */}
                    <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#64748b' }}>
                        {isRegister ? (
                            <>
                                Já tem uma conta?{' '}
                                <button
                                    onClick={() => setIsRegister(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#a855f7',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Entrar
                                </button>
                            </>
                        ) : (
                            <>
                                Não tem uma conta?{' '}
                                <button
                                    onClick={() => setIsRegister(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#a855f7',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Criar conta
                                </button>
                            </>
                        )}
                    </p>

                    {/* Back to Home */}
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Link
                            href="/"
                            style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}
                        >
                            ← Voltar para o site
                        </Link>
                    </div>
                </div>
            </div>

            {/* CSS for spinner animation */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
