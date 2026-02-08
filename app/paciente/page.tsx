'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
    Brain,
    Calendar,
    Clock,
    User,
    LogOut,
    Bell,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Lock,
    Eye,
    EyeOff,
    Baby
} from 'lucide-react'

export default function PacientePortalPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [mustChangePassword, setMustChangePassword] = useState(false)
    const [patientData, setPatientData] = useState<any>(null)
    const [familyAccess, setFamilyAccess] = useState<any>(null)

    // Password change state
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        const checkAccess = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // Buscar acesso da família
            const { data: access } = await supabase
                .from('family_portal_access')
                .select('*, patients(*)')
                .eq('user_id', user.id)
                .single()

            if (access) {
                setFamilyAccess(access)
                setMustChangePassword(access.must_change_password)

                if (access.patients) {
                    setPatientData(access.patients)
                }
            }

            setLoading(false)
        }

        checkAccess()
    }, [router])

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError('')

        if (newPassword.length < 6) {
            setPasswordError('A senha deve ter no mínimo 6 caracteres')
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('As senhas não conferem')
            return
        }

        setChangingPassword(true)

        try {
            const supabase = createClient()

            // Atualizar senha
            const { error: passwordError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (passwordError) throw passwordError

            // Atualizar flag must_change_password
            await supabase
                .from('family_portal_access')
                .update({ must_change_password: false, last_access_at: new Date().toISOString() })
                .eq('id', familyAccess.id)

            setMustChangePassword(false)
        } catch (err: any) {
            setPasswordError(err.message || 'Erro ao alterar senha')
        } finally {
            setChangingPassword(false)
        }
    }

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    // Loading state
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#faf5ff'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #e9d5ff',
                        borderTopColor: '#a855f7',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <p style={{ color: '#64748b' }}>Carregando...</p>
                </div>
            </div>
        )
    }

    // Change Password Screen
    if (mustChangePassword) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#faf5ff',
                padding: '16px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    padding: '40px',
                    maxWidth: '440px',
                    width: '100%',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <Lock style={{ width: '40px', height: '40px', color: 'white' }} />
                    </div>

                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                        Primeiro Acesso
                    </h1>
                    <p style={{ color: '#64748b', marginBottom: '32px' }}>
                        Por segurança, você precisa criar uma nova senha para continuar.
                    </p>

                    {passwordError && (
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '12px',
                            color: '#dc2626',
                            fontSize: '14px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <AlertCircle style={{ width: '16px', height: '16px' }} />
                            {passwordError}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '18px',
                                height: '18px',
                                color: '#9ca3af'
                            }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nova senha"
                                style={{
                                    width: '100%',
                                    padding: '14px 48px 14px 44px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#9ca3af'
                                }}
                            >
                                {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                            </button>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '18px',
                                height: '18px',
                                color: '#9ca3af'
                            }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmar nova senha"
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={changingPassword}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '16px',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: changingPassword ? 'not-allowed' : 'pointer',
                                opacity: changingPassword ? 0.7 : 1,
                                marginTop: '8px'
                            }}
                        >
                            {changingPassword ? 'Alterando...' : 'Alterar Senha e Continuar'}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    // Main Portal
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '72px'
                }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Brain style={{ width: '24px', height: '24px', color: 'white' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '15px' }}>Gabriela F. Lacerda</p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Portal da Família</p>
                        </div>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: '#f3e8ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: '#7c3aed',
                            fontSize: '14px'
                        }}>
                            {familyAccess?.family_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || 'FA'}
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '10px 16px',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                fontWeight: 600,
                                fontSize: '14px',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            <LogOut style={{ width: '16px', height: '16px' }} />
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Welcome */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>
                        Olá, {familyAccess?.family_name?.split(' ')[0] || 'Família'}! 👋
                    </h1>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>
                        Acompanhe o desenvolvimento de {patientData?.full_name || 'seu filho(a)'}
                    </p>
                </div>

                {/* Patient Info Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Baby style={{ width: '40px', height: '40px', color: 'white' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: '0 0 4px' }}>
                            {patientData?.full_name || 'Paciente'}
                        </h2>
                        {patientData?.diagnosis && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {patientData.diagnosis.map((d: string, i: number) => (
                                    <span key={i} style={{
                                        padding: '4px 10px',
                                        backgroundColor: '#f3e8ff',
                                        color: '#7c3aed',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: 500
                                    }}>
                                        {d}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {/* Próximas Consultas */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar style={{ width: '20px', height: '20px', color: '#a855f7' }} />
                            Próximas Consultas
                        </h3>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#faf5ff',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <Calendar style={{ width: '32px', height: '32px', color: '#a855f7', margin: '0 auto 8px' }} />
                            <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                                Consultas serão exibidas aqui
                            </p>
                        </div>
                    </div>

                    {/* Contato */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User style={{ width: '20px', height: '20px', color: '#a855f7' }} />
                            Contato
                        </h3>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #c084fc, #a855f7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px'
                            }}>
                                <User style={{ width: '32px', height: '32px', color: 'white' }} />
                            </div>
                            <p style={{ fontWeight: 600, color: '#1e293b', margin: '0 0 4px' }}>Gabriela Lacerda</p>
                            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 16px' }}>Psicóloga • CRP 09/19262</p>
                            <a
                                href="https://wa.me/5564999380033"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    padding: '12px',
                                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    borderRadius: '10px',
                                    textDecoration: 'none'
                                }}
                            >
                                Enviar Mensagem
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
