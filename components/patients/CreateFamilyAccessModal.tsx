'use client';

import { useState } from 'react';
import { X, UserPlus, Mail, Lock, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface CreateFamilyAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    patientName: string;
    psychologistId: string;
    onSuccess: () => void;
}

export default function CreateFamilyAccessModal({
    isOpen,
    onClose,
    patientId,
    patientName,
    psychologistId,
    onSuccess
}: CreateFamilyAccessModalProps) {
    const [familyName, setFamilyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validações
        if (!familyName.trim() || !email.trim() || !password) {
            setError('Preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não conferem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/family/create-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    familyName,
                    email,
                    password,
                    psychologistId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar acesso');
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFamilyName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    padding: '24px',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <UserPlus style={{ width: '24px', height: '24px' }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Criar Acesso Portal</h2>
                                <p style={{ fontSize: '14px', opacity: 0.9, margin: '4px 0 0' }}>
                                    Paciente: {patientName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: 'pointer',
                                color: 'white'
                            }}
                        >
                            <X style={{ width: '20px', height: '20px' }} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {success ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '32px 0'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#d1fae5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <CheckCircle style={{ width: '32px', height: '32px', color: '#10b981' }} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>
                                Acesso criado com sucesso!
                            </h3>
                            <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                                A família pode fazer login com o email <strong>{email}</strong>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Info */}
                            <div style={{
                                padding: '12px 16px',
                                backgroundColor: '#faf5ff',
                                borderRadius: '12px',
                                fontSize: '14px',
                                color: '#7c3aed',
                                lineHeight: 1.5
                            }}>
                                💡 No primeiro acesso, a família será solicitada a alterar a senha.
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#fee2e2',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    color: '#dc2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <AlertCircle style={{ width: '16px', height: '16px' }} />
                                    {error}
                                </div>
                            )}

                            {/* Nome do Responsável */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Nome do Responsável
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '18px',
                                        height: '18px',
                                        color: '#9ca3af'
                                    }} />
                                    <input
                                        type="text"
                                        value={familyName}
                                        onChange={(e) => setFamilyName(e.target.value)}
                                        placeholder="Ex: Maria Silva (mãe)"
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 44px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Email da Família
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '18px',
                                        height: '18px',
                                        color: '#9ca3af'
                                    }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="familia@email.com"
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 44px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Senha */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Senha Temporária
                                </label>
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
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 44px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Confirmar Senha
                                </label>
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
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repita a senha"
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 44px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        backgroundColor: '#f1f5f9',
                                        color: '#64748b',
                                        fontWeight: 600,
                                        fontSize: '15px',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '15px',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                                            Criando...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus style={{ width: '18px', height: '18px' }} />
                                            Criar Acesso
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
