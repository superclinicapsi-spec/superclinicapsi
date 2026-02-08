'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Brain, ChevronRight, ChevronLeft, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';

type OnboardingStep = 'crp' | 'specialties' | 'locations';

const SPECIALTIES_OPTIONS = [
    { id: 'aba', label: 'Análise do Comportamento Aplicada (ABA)', icon: '🧩' },
    { id: 'tcc', label: 'Terapia Cognitivo-Comportamental', icon: '🧠' },
    { id: 'early', label: 'Intervenção Precoce', icon: '👶' },
    { id: 'parent', label: 'Treinamento Parental', icon: '👨‍👩‍👧' },
    { id: 'tea', label: 'Transtorno do Espectro Autista (TEA)', icon: '💜' },
    { id: 'tdah', label: 'TDAH', icon: '⚡' },
    { id: 'anxiety', label: 'Ansiedade', icon: '🌿' },
    { id: 'other', label: 'Outro', icon: '✨' },
];

const STEPS = [
    { id: 'crp', label: 'CRP', number: 1 },
    { id: 'specialties', label: 'Especialidades', number: 2 },
    { id: 'locations', label: 'Locais', number: 3 },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('crp');
    const [loading, setLoading] = useState(false);

    // Form data
    const [crp, setCrp] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [locations, setLocations] = useState([
        { name: '', address: '', type: 'clinic' as 'clinic' | 'home' },
    ]);

    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

    const handleSpecialtyToggle = (specialty: string) => {
        if (selectedSpecialties.includes(specialty)) {
            setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
        } else {
            setSelectedSpecialties([...selectedSpecialties, specialty]);
        }
    };

    const addLocation = () => {
        setLocations([...locations, { name: '', address: '', type: 'clinic' }]);
    };

    const removeLocation = (index: number) => {
        setLocations(locations.filter((_, i) => i !== index));
    };

    const updateLocation = (index: number, field: string, value: string) => {
        const updated = [...locations];
        updated[index] = { ...updated[index], [field]: value };
        setLocations(updated);
    };

    const handleFinish = async () => {
        setLoading(true);

        try {
            const supabase = createClient();
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                alert('Você precisa estar logado para continuar.');
                router.push('/login');
                return;
            }

            const { error } = await supabase
                .from('users_profile')
                .upsert({
                    id: user.id,
                    crp,
                    specialties: selectedSpecialties,
                    locations,
                    role: 'psychologist',
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'id'
                });

            if (error) {
                alert(`Erro ao salvar dados: ${error.message}\n\nCódigo: ${error.code || 'N/A'}`);
                setLoading(false);
                return;
            }

            router.push('/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            alert(`Erro ao finalizar configuração: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--lavender-50) 0%, var(--sky-50) 100%)' }}>
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, var(--lavender-500) 0%, var(--sky-400) 100%)' }}>
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                        Configuração Inicial
                    </h1>
                    <p className="text-[var(--foreground-muted)] mt-2">
                        Configure seu perfil profissional para começar
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`
                                    flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all
                                    ${currentStepIndex >= index
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--gray-200)] text-[var(--gray-500)]'
                                    }
                                `}>
                                    {currentStepIndex > index ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <span className={`ml-2 text-sm font-medium hidden sm:inline ${currentStepIndex >= index ? 'text-[var(--primary)]' : 'text-[var(--gray-400)]'
                                    }`}>
                                    {step.label}
                                </span>
                                {index < STEPS.length - 1 && (
                                    <div className={`w-12 h-0.5 mx-3 ${currentStepIndex > index ? 'bg-[var(--primary)]' : 'bg-[var(--gray-200)]'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card */}
                <div className="card-elevated">
                    {/* Step 1: CRP */}
                    {currentStep === 'crp' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Número do CRP</h2>
                                <p className="text-sm text-[var(--foreground-muted)] mb-4">
                                    Informe seu registro no Conselho Regional de Psicologia
                                </p>
                                <input
                                    type="text"
                                    value={crp}
                                    onChange={(e) => setCrp(e.target.value)}
                                    className="input-field"
                                    placeholder="Ex: 06/123456"
                                />
                                <p className="text-xs text-[var(--foreground-muted)] mt-2">
                                    Formato: UF/Número (ex: 06/123456)
                                </p>
                            </div>

                            <button
                                onClick={() => setCurrentStep('specialties')}
                                disabled={!crp}
                                className="btn btn-primary w-full"
                            >
                                Continuar
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Specialties */}
                    {currentStep === 'specialties' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Especialidades</h2>
                                <p className="text-sm text-[var(--foreground-muted)] mb-4">
                                    Selecione suas áreas de atuação
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                                    {SPECIALTIES_OPTIONS.map((specialty) => {
                                        const isSelected = selectedSpecialties.includes(specialty.label);
                                        return (
                                            <button
                                                key={specialty.id}
                                                onClick={() => handleSpecialtyToggle(specialty.label)}
                                                className={`
                                                    flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                                                    ${isSelected
                                                        ? 'border-[var(--primary)] bg-[var(--primary-subtle)]'
                                                        : 'border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--gray-50)]'
                                                    }
                                                `}
                                            >
                                                <span className="text-xl">{specialty.icon}</span>
                                                <span className={`text-sm font-medium ${isSelected ? 'text-[var(--primary)]' : ''}`}>
                                                    {specialty.label}
                                                </span>
                                                {isSelected && (
                                                    <CheckCircle2 className="w-5 h-5 text-[var(--primary)] ml-auto" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentStep('crp')}
                                    className="btn btn-secondary flex-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Voltar
                                </button>
                                <button
                                    onClick={() => setCurrentStep('locations')}
                                    disabled={selectedSpecialties.length === 0}
                                    className="btn btn-primary flex-1"
                                >
                                    Continuar
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Locations */}
                    {currentStep === 'locations' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Locais de Atendimento</h2>
                                <p className="text-sm text-[var(--foreground-muted)] mb-4">
                                    Adicione os locais onde você realiza atendimentos
                                </p>

                                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                                    {locations.map((location, index) => (
                                        <div key={index} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--gray-50)]">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-[var(--primary)]" />
                                                    <span className="text-sm font-medium text-[var(--primary)]">
                                                        Local {index + 1}
                                                    </span>
                                                </div>
                                                {locations.length > 1 && (
                                                    <button
                                                        onClick={() => removeLocation(index)}
                                                        className="p-1 text-[var(--error)] hover:bg-[var(--error-light)] rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={location.name}
                                                    onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                                    className="input-field"
                                                    placeholder="Nome do local (ex: Clínica ABC)"
                                                />

                                                <input
                                                    type="text"
                                                    value={location.address}
                                                    onChange={(e) => updateLocation(index, 'address', e.target.value)}
                                                    className="input-field"
                                                    placeholder="Endereço completo"
                                                />

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateLocation(index, 'type', 'clinic')}
                                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${location.type === 'clinic'
                                                            ? 'bg-[var(--primary)] text-white'
                                                            : 'bg-white border border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--primary)]'
                                                            }`}
                                                    >
                                                        🏥 Clínica
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateLocation(index, 'type', 'home')}
                                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${location.type === 'home'
                                                            ? 'bg-[var(--primary)] text-white'
                                                            : 'bg-white border border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--primary)]'
                                                            }`}
                                                    >
                                                        🏠 Domicílio
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={addLocation}
                                    className="btn btn-outline w-full mt-4"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Local
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCurrentStep('specialties')}
                                    className="btn btn-secondary flex-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Voltar
                                </button>
                                <button
                                    onClick={handleFinish}
                                    disabled={loading || locations.some(l => !l.name)}
                                    className="btn btn-primary flex-1"
                                >
                                    {loading ? 'Salvando...' : 'Finalizar'}
                                    {!loading && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[var(--foreground-muted)] mt-6">
                    Seus dados estão protegidos de acordo com a LGPD
                </p>
            </div>
        </div>
    );
}
