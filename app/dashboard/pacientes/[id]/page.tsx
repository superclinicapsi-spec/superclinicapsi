'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import CreateFamilyAccessModal from '@/components/patients/CreateFamilyAccessModal';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    ArrowLeft,
    Calendar,
    Mail,
    Phone,
    User,
    UserPlus,
    FileText,
    Clock,
    Trash2,
    Shield,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface FamilyAccess {
    id: string;
    family_name: string;
    family_email: string;
    created_at: string;
    last_access_at: string | null;
    must_change_password: boolean;
}

// Mock patient data - será substituído por dados reais
const getMockPatient = (id: string) => ({
    id,
    full_name: 'João Pedro Silva',
    date_of_birth: '2018-03-15',
    diagnosis: ['TEA - Nível 1', 'TDAH'],
    guardians: [
        { name: 'Maria Silva', relation: 'Mãe', phone: '(64) 99999-1111', email: 'maria@email.com' },
        { name: 'Carlos Silva', relation: 'Pai', phone: '(64) 99999-2222', email: 'carlos@email.com' }
    ],
    sessions: 24,
    lastSession: '05/02/2026',
    nextSession: '12/02/2026',
    status: 'active'
});

export default function PatientDetailsPage() {
    const params = useParams();
    const patientId = params.id as string;

    const [patient] = useState(getMockPatient(patientId));
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [familyAccesses, setFamilyAccesses] = useState<FamilyAccess[]>([]);
    const [loadingAccesses, setLoadingAccesses] = useState(true);
    const [psychologistId, setPsychologistId] = useState<string>('');

    // Buscar ID do psicólogo logado
    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setPsychologistId(user.id);
            }
        };
        fetchUser();
    }, []);

    // Buscar acessos de família
    const fetchFamilyAccesses = async () => {
        setLoadingAccesses(true);
        try {
            const response = await fetch(`/api/family/create-access?patientId=${patientId}`);
            const data = await response.json();
            if (data.accesses) {
                setFamilyAccesses(data.accesses);
            }
        } catch (error) {
            console.error('Erro ao buscar acessos:', error);
        } finally {
            setLoadingAccesses(false);
        }
    };

    useEffect(() => {
        if (patientId) {
            fetchFamilyAccesses();
        }
    }, [patientId]);

    // Revogar acesso
    const handleRevokeAccess = async (accessId: string) => {
        if (!confirm('Tem certeza que deseja revogar este acesso?')) return;

        try {
            const response = await fetch(`/api/family/create-access?accessId=${accessId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchFamilyAccesses();
            }
        } catch (error) {
            console.error('Erro ao revogar acesso:', error);
        }
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <Link
                    href="/dashboard/pacientes"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#64748b',
                        textDecoration: 'none',
                        fontSize: '14px',
                        marginBottom: '16px'
                    }}
                >
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Voltar para Pacientes
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 700
                        }}>
                            {patient.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                {patient.full_name}
                            </h1>
                            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '16px' }}>
                                {calculateAge(patient.date_of_birth)} anos • {patient.diagnosis.join(', ')}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link
                            href={`/dashboard/prontuario?paciente=${patientId}`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                fontWeight: 600,
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontSize: '14px'
                            }}
                        >
                            <FileText style={{ width: '18px', height: '18px' }} />
                            Ver Prontuário
                        </Link>
                        <Link
                            href={`/dashboard/agenda?paciente=${patientId}`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                boxShadow: '0 4px 14px rgba(168,85,247,0.3)'
                            }}
                        >
                            <Calendar style={{ width: '18px', height: '18px' }} />
                            Agendar Sessão
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Responsáveis */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User style={{ width: '20px', height: '20px', color: '#a855f7' }} />
                        Responsáveis
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {patient.guardians.map((guardian, index) => (
                            <div key={index} style={{
                                padding: '16px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <p style={{ fontWeight: 600, color: '#1e293b', margin: 0 }}>{guardian.name}</p>
                                    <span style={{
                                        padding: '2px 8px',
                                        backgroundColor: '#f3e8ff',
                                        color: '#7c3aed',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 500
                                    }}>
                                        {guardian.relation}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#64748b' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Phone style={{ width: '14px', height: '14px' }} />
                                        {guardian.phone}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Mail style={{ width: '14px', height: '14px' }} />
                                        {guardian.email}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Estatísticas */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock style={{ width: '20px', height: '20px', color: '#a855f7' }} />
                        Atendimentos
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#faf5ff',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '32px', fontWeight: 700, color: '#a855f7', margin: 0 }}>{patient.sessions}</p>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>Sessões</p>
                        </div>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>{patient.lastSession}</p>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>Última</p>
                        </div>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#d1fae5',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#10b981', margin: 0 }}>{patient.nextSession}</p>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>Próxima</p>
                        </div>
                    </div>
                </div>

                {/* Portal Família - Ocupa as duas colunas */}
                <div style={{
                    gridColumn: '1 / -1',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Shield style={{ width: '20px', height: '20px', color: '#a855f7' }} />
                            Acesso Portal Família
                        </h2>
                        <button
                            onClick={() => setShowAccessModal(true)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '14px',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(168,85,247,0.3)'
                            }}
                        >
                            <UserPlus style={{ width: '16px', height: '16px' }} />
                            Criar Acesso
                        </button>
                    </div>

                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                        Crie logins para que a família acompanhe o desenvolvimento do paciente pelo portal.
                    </p>

                    {loadingAccesses ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                            Carregando acessos...
                        </div>
                    ) : familyAccesses.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 0',
                            backgroundColor: '#f8fafc',
                            borderRadius: '12px'
                        }}>
                            <UserPlus style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 12px' }} />
                            <p style={{ color: '#64748b', margin: 0 }}>
                                Nenhum acesso criado ainda
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0' }}>
                                Clique em "Criar Acesso" para permitir que a família acompanhe o paciente
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {familyAccesses.map((access) => (
                                <div
                                    key={access.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: 600, color: '#1e293b', margin: 0 }}>
                                            {access.family_name}
                                        </p>
                                        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>
                                            {access.family_email}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        {access.must_change_password && (
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 10px',
                                                backgroundColor: '#fef3c7',
                                                color: '#b45309',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 500
                                            }}>
                                                <AlertCircle style={{ width: '12px', height: '12px' }} />
                                                Aguardando primeiro acesso
                                            </span>
                                        )}
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                            Criado em {new Date(access.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                        <button
                                            onClick={() => handleRevokeAccess(access.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '36px',
                                                height: '36px',
                                                backgroundColor: '#fee2e2',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                color: '#ef4444'
                                            }}
                                            title="Revogar acesso"
                                        >
                                            <Trash2 style={{ width: '16px', height: '16px' }} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <CreateFamilyAccessModal
                isOpen={showAccessModal}
                onClose={() => setShowAccessModal(false)}
                patientId={patientId}
                patientName={patient.full_name}
                psychologistId={psychologistId}
                onSuccess={fetchFamilyAccesses}
            />
        </DashboardLayout>
    );
}
