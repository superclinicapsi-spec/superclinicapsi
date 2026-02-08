'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = createClient();

                // Check for error in URL params
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (errorParam) {
                    console.error('OAuth error:', errorParam, errorDescription);
                    setError(errorDescription || errorParam);
                    setTimeout(() => router.push('/login'), 3000);
                    return;
                }

                // Get current session (Supabase handles the code exchange automatically)
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    setError('Erro ao obter sessão');
                    setTimeout(() => router.push('/login'), 3000);
                    return;
                }

                if (!session) {
                    console.error('No session found');
                    setError('Nenhuma sessão encontrada');
                    setTimeout(() => router.push('/login'), 3000);
                    return;
                }

                console.log('Session obtained:', session.user.email);

                // Check if user has completed onboarding
                const { data: profile, error: profileError } = await supabase
                    .from('users_profile')
                    .select('crp, specialties, locations')
                    .eq('id', session.user.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    console.error('Profile error:', profileError);
                }

                // Redirect based on profile completion
                if (!profile || !profile.crp) {
                    console.log('Redirecting to onboarding');
                    router.push('/onboarding');
                } else {
                    console.log('Redirecting to dashboard');
                    router.push('/dashboard');
                }

            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
                console.error('Callback error:', err);
                setError(errorMessage);
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="text-center max-w-md">
                {error ? (
                    <>
                        <div className="text-red-600 mb-4">
                            <span className="material-symbols-outlined text-5xl">error</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Erro na autenticação</h2>
                        <p className="text-slate-600 mb-4">{error}</p>
                        <p className="text-sm text-slate-500">Redirecionando para login...</p>
                    </>
                ) : (
                    <>
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                        <p className="text-slate-600">Autenticando...</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                    <p className="text-slate-600">Carregando...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
