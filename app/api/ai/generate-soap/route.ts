import { NextRequest, NextResponse } from 'next/server';
import { generateSOAPNote } from '@/lib/ai/openrouter';

/**
 * API Route para gerar notas SOAP com IA
 * POST /api/ai/generate-soap
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { patientName, sessionDuration, trialsData, behaviorsObserved, notes } = body;

        // Validação básica
        if (!patientName || !sessionDuration) {
            return NextResponse.json(
                { error: 'Dados inválidos. patientName e sessionDuration são obrigatórios.' },
                { status: 400 }
            );
        }

        // Gera a nota SOAP com IA
        const result = await generateSOAPNote({
            patientName,
            sessionDuration,
            trialsData,
            behaviorsObserved,
            notes,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            note: result.note,
        });

    } catch (error) {
        console.error('Erro na API de geração de SOAP:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
