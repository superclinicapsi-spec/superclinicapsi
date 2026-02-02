'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type OnboardingStep = 'crp' | 'specialties' | 'locations';

const SPECIALTIES_OPTIONS = [
    'Análise do Comportamento Aplicada (ABA)',
    'Terapia Cognitivo-Comportamental',
    'Intervenção Precoce',
    'Treinamento Parental',
    'Transtorno do Espectro Autista (TEA)',
    'TDAH',
    'Ansiedade',
    'Outro',
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('crp');
    const [loading, setLoading] = useState(false);

    // Dados do formulário
    const [crp, setCrp] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [locations, setLocations] = useState([
        { name: '', address: '', type: 'clinic' as 'clinic' | 'home' },
    ]);

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
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // Salva o perfil no banco
            const { error } = await supabase
                .from('users_profile')
                .upsert({
                    id: user.id,
                    crp,
                    specialties: selectedSpecialties,
                    locations,
                    role: 'psychologist',
                    updated_at: new Date().toISOString(),
                });

            if (error) {
                console.error('Erro ao salvar perfil:', error);
                alert('Erro ao salvar dados. Tente novamente.');
                setLoading(false);
                return;
            }

            // Redireciona para dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error('Erro no onboarding:', err);
            alert('Erro ao finalizar configuração.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12">
            <div className="card max-w-2xl w-full mx-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Configuração Inicial
                    </h1>
                    <p className="text-muted text-sm">
                        Configure seu perfil profissional para começar
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8">
                    <div className={`flex items-center ${currentStep === 'crp' ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'crp' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                            1
                        </div>
                        <span className="ml-2 text-sm font-medium">CRP</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                    <div className={`flex items-center ${currentStep === 'specialties' ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'specialties' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                            2
                        </div>
                        <span className="ml-2 text-sm font-medium">Especialidades</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                    <div className={`flex items-center ${currentStep === 'locations' ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'locations' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                            3
                        </div>
                        <span className="ml-2 text-sm font-medium">Locais</span>
                    </div>
                </div>

                {/* Step 1: CRP */}
                {currentStep === 'crp' && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="crp" className="label">
                                Número do CRP (Conselho Regional de Psicologia)
                            </label>
                            <input
                                id="crp"
                                type="text"
                                value={crp}
                                onChange={(e) => setCrp(e.target.value)}
                                className="input-field"
                                placeholder="Ex: 06/123456"
                                required
                            />
                            <p className="text-xs text-muted mt-1">
                                Formato: UF/Número (ex: 06/123456)
                            </p>
                        </div>

                        <button
                            onClick={() => setCurrentStep('specialties')}
                            disabled={!crp}
                            className="btn btn-primary w-full"
                        >
                            Próximo
                        </button>
                    </div>
                )}

                {/* Step 2: Specialties */}
                {currentStep === 'specialties' && (
                    <div className="space-y-6">
                        <div>
                            <label className="label mb-3 block">
                                Selecione suas especialidades
                            </label>
                            <div className="space-y-2">
                                {SPECIALTIES_OPTIONS.map((specialty) => (
                                    <label
                                        key={specialty}
                                        className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecialties.includes(specialty)}
                                            onChange={() => handleSpecialtyToggle(specialty)}
                                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="ml-3 text-sm text-foreground">{specialty}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentStep('crp')}
                                className="btn btn-secondary flex-1"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={() => setCurrentStep('locations')}
                                disabled={selectedSpecialties.length === 0}
                                className="btn btn-primary flex-1"
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Locations */}
                {currentStep === 'locations' && (
                    <div className="space-y-6">
                        <div>
                            <label className="label mb-3 block">
                                Locais de Atendimento
                            </label>

                            {locations.map((location, index) => (
                                <div key={index} className="p-4 border border-border rounded-lg mb-3">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-medium text-foreground">
                                            Local {index + 1}
                                        </span>
                                        {locations.length > 1 && (
                                            <button
                                                onClick={() => removeLocation(index)}
                                                className="text-error text-sm hover:underline"
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                value={location.name}
                                                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                                className="input-field"
                                                placeholder="Nome do local (ex: Clínica ABC)"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="text"
                                                value={location.address}
                                                onChange={(e) => updateLocation(index, 'address', e.target.value)}
                                                className="input-field"
                                                placeholder="Endereço completo"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <label className="flex items-center flex-1 p-2 border border-border rounded cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    checked={location.type === 'clinic'}
                                                    onChange={() => updateLocation(index, 'type', 'clinic')}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Clínica</span>
                                            </label>
                                            <label className="flex items-center flex-1 p-2 border border-border rounded cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    checked={location.type === 'home'}
                                                    onChange={() => updateLocation(index, 'type', 'home')}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Domicílio</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={addLocation}
                                className="btn btn-secondary w-full"
                            >
                                + Adicionar Local
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentStep('specialties')}
                                className="btn btn-secondary flex-1"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleFinish}
                                disabled={loading || locations.some(l => !l.name)}
                                className="btn btn-success flex-1"
                            >
                                {loading ? 'Finalizando...' : 'Finalizar Configuração'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
