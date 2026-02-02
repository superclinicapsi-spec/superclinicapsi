import { OpenRouter } from "@openrouter/sdk";

// Cliente OpenRouter configurado
const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
});

/**
 * Gera uma nota SOAP profissional a partir dos dados da sessão ABA
 * Usa DeepSeek R1 (modelo gratuito)
 */
export async function generateSOAPNote(sessionData: {
    patientName: string;
    sessionDuration: number; // em minutos
    trialsData?: {
        targetName: string;
        correct: number;
        error: number;
        help: number;
    }[];
    behaviorsObserved?: string[];
    notes?: string;
}) {
    const prompt = `Você é um assistente especializado em psicologia comportamental (ABA - Análise do Comportamento Aplicada).

Gere uma nota clínica no formato SOAP (Subjetivo, Objetivo, Avaliação, Plano) PROFISSIONAL e OBJETIVA, baseada nos seguintes dados da sessão:

INFORMAÇÕES DA SESSÃO:
- Paciente: ${sessionData.patientName}
- Duração: ${sessionData.sessionDuration} minutos
${sessionData.trialsData ? `
DADOS DE TENTATIVAS DISCRETAS (DTT):
${sessionData.trialsData.map(t =>
        `- ${t.targetName}: ${t.correct} acertos, ${t.error} erros, ${t.help} ajudas (Total: ${t.correct + t.error + t.help} tentativas)`
    ).join('\n')}` : ''}
${sessionData.behaviorsObserved?.length ? `
COMPORTAMENTOS OBSERVADOS:
${sessionData.behaviorsObserved.map(b => `- ${b}`).join('\n')}` : ''}
${sessionData.notes ? `
OBSERVAÇÕES DO TERAPEUTA:
${sessionData.notes}` : ''}

IMPORTANTE:
- Use linguagem técnica mas clara
- Seja objetivo e conciso
- Inclua porcentagens de acerto quando aplicável
- Sugira próximos passos no campo "Plano"
- Mantenha tom profissional, adequado para prontuário médico

Formato esperado:

**SUBJETIVO:**
[Relato do paciente/responsável ou observações iniciais]

**OBJETIVO:**
[Dados quantitativos da sessão, porcentagens, frequências]

**AVALIAÇÃO:**
[Interpretação clínica dos dados, progressos, dificuldades]

**PLANO:**
[Próximos passos, ajustes no programa, recomendações]`;

    try {
        const stream = await openrouter.chat.send({
            model: "deepseek/deepseek-r1-0528:free",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            stream: true,
        });

        let fullNote = "";

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                fullNote += content;
            }
        }

        return {
            success: true,
            note: fullNote,
        };
    } catch (error) {
        console.error("Erro ao gerar nota SOAP:", error);
        return {
            success: false,
            error: "Erro ao gerar nota com IA. Tente novamente.",
        };
    }
}

/**
 * Gera sugestões de modificação de programa baseado em estagnação
 */
export async function suggestProgramModification(data: {
    targetName: string;
    lastSessions: {
        date: string;
        percentCorrect: number;
    }[];
    currentStrategy: string;
}) {
    const prompt = `Você é um analista comportamental (BCBA) experiente.

ALVO ESTAGNADO:
- Nome do alvo: ${data.targetName}
- Estratégia atual: ${data.currentStrategy}

DADOS DAS ÚLTIMAS SESSÕES:
${data.lastSessions.map(s => `- ${s.date}: ${s.percentCorrect}% de acerto`).join('\n')}

Baseado nos dados acima, sugira:
1. Possíveis motivos da estagnação (2-3 hipóteses)
2. Modificações concretas no procedimento (3-4 sugestões práticas)
3. Ajustes no nível de prompt ou reforçadores

Seja específico e prático. Use linguagem profissional mas acessível.`;

    try {
        const stream = await openrouter.chat.send({
            model: "deepseek/deepseek-r1-0528:free",
            messages: [{ role: "user", content: prompt }],
            stream: true,
        });

        let suggestion = "";

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                suggestion += content;
            }
        }

        return {
            success: true,
            suggestion,
        };
    } catch (error) {
        console.error("Erro ao gerar sugestão:", error);
        return {
            success: false,
            error: "Erro ao gerar sugestão com IA.",
        };
    }
}
