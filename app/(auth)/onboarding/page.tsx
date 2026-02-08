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
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError) {
                console.error('Erro ao obter usuário:', userError);
                alert(`Erro de autenticação: ${userError.message}`);
                setLoading(false);
                return;
            }

            if (!user) {
                console.error('Usuário não autenticado');
                alert('Você precisa estar logado para continuar.');
                router.push('/login');
                return;
            }

            console.log('Salvando perfil para usuário:', user.id);
            console.log('Dados:', { crp, specialties: selectedSpecialties, locations });

            // Salva o perfil no banco
            const { data, error } = await supabase
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
                console.error('Erro detalhado ao salvar perfil:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                alert(`Erro ao salvar dados: ${error.message}\n\nCódigo: ${error.code || 'N/A'}`);
                setLoading(false);
                return;
            }

            console.log('Perfil salvo com sucesso!', data);

            // Redireciona para dashboard
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Erro no onboarding:', err);
            alert(`Erro ao finalizar configuração: ${err.message || 'Erro desconhecido'}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-teal-600 mb-2">
                        Configuração Inicial
                    </h1>
                    <p className="text-slate-600 text-sm">
                        Configure seu perfil profissional para começar
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-10">
                    <div className={`flex items-center ${currentStep === 'crp' ? 'text-teal-600' : 'text-slate-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold ${currentStep === 'crp' ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-slate-400'}`}>
                            1
                        </div>
                        <span className="ml-2 text-sm font-medium hidden sm:inline">CRP</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>
                    <div className={`flex items-center ${currentStep === 'specialties' ? 'text-teal-600' : 'text-slate-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold ${currentStep === 'specialties' ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-slate-400'}`}>
                            2
                        </div>
                        <span className="ml-2 text-sm font-medium hidden sm:inline">Especialidades</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>
                    <div className={`flex items-center ${currentStep === 'locations' ? 'text-teal-600' : 'text-slate-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold ${currentStep === 'locations' ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-slate-400'}`}>
                            3
                        </div>
                        <span className="ml-2 text-sm font-medium hidden sm:inline">Locais</span>
                    </div>
                </div>

                {/* Step 1: CRP */}
                {currentStep === 'crp' && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="crp" className="block text-sm font-medium text-slate-700 mb-2">
                                Número do CRP (Conselho Regional de Psicologia)
                            </label>
                            <input
                                id="crp"
                                type="text"
                                value={crp}
                                onChange={(e) => setCrp(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border-0 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                placeholder="Ex: 06/123456"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Formato: UF/Número (ex: 06/123456)
                            </p>
                        </div>

                        <button
                            onClick={() => setCurrentStep('specialties')}
                            disabled={!crp}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-teal-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                        >
                            Próximo
                        </button>
                    </div>
                )}

                {/* Step 2: Specialties */}
                {currentStep === 'specialties' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-4">
                                Selecione suas especialidades
                            </label>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {SPECIALTIES_OPTIONS.map((specialty) => (
                                    <label
                                        key={specialty}
                                        className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecialties.includes(specialty)}
                                            onChange={() => handleSpecialtyToggle(specialty)}
                                            className="w-5 h-5 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                                        />
                                        <span className="ml-3 text-sm text-slate-700 font-medium">{specialty}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentStep('crp')}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 rounded-full transition-all active:scale-[0.98] uppercase tracking-wide text-sm"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={() => setCurrentStep('locations')}
                                disabled={selectedSpecialties.length === 0}
                                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-teal-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
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
                            <label className="block text-sm font-medium text-slate-700 mb-4">
                                Locais de Atendimento
                            </label>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {locations.map((location, index) => (
                                    <div key={index} className="p-5 border border-slate-200 rounded-lg bg-slate-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm font-bold text-teal-600">
                                                Local {index + 1}
                                            </span>
                                            {locations.length > 1 && (
                                                <button
                                                    onClick={() => removeLocation(index)}
                                                    className="text-red-600 text-sm hover:underline font-medium"
                                                >
                                                    Remover
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={location.name}
                                                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                placeholder="Nome do local (ex: Clínica ABC)"
                                                required
                                            />

                                            <input
                                                type="text"
                                                value={location.address}
                                                onChange={(e) => updateLocation(index, 'address', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                placeholder="Endereço completo"
                                            />

                                            <div className="flex gap-2">
                                                <label className="flex items-center flex-1 p-3 border-2 border-slate-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                                                    <input
                                                        type="radio"
                                                        checked={location.type === 'clinic'}
                                                        onChange={() => updateLocation(index, 'type', 'clinic')}
                                                        className="w-4 h-4 text-teal-600"
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-slate-700">Clínica</span>
                                                </label>
                                                <label className="flex items-center flex-1 p-3 border-2 border-slate-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                                                    <input
                                                        type="radio"
                                                        checked={location.type === 'home'}
                                                        onChange={() => updateLocation(index, 'type', 'home')}
                                                        className="w-4 h-4 text-teal-600"
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-slate-700">Domicílio</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addLocation}
                                className="w-full mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-lg transition-all active:scale-[0.98] text-sm"
                            >
                                + Adicionar Local
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentStep('specialties')}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 rounded-full transition-all active:scale-[0.98] uppercase tracking-wide text-sm"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleFinish}
                                disabled={loading || locations.some(l => !l.name)}
                                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-teal-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                            >
                                {loading ? 'Finalizando...' : 'Finalizar'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
