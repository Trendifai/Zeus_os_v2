'use server';

const HERMES_ENDPOINT =
    'https://sushi-ravishing-karate.ngrok-free.dev/v1/chat/completions';

const SYSTEM_PROMPT =
    "Sei ZeusClaw, l'intelligenza di Manipura ERP. Estrai dati CRM o rispondi alle richieste dell'utente.";

export async function analyzeTextWithHermes(
    rawText: string
): Promise<{ success: true; content: string; raw: unknown } | { success: false; error: string }> {
    console.log('🚀 Inizio comunicazione con ZeusClaw...');

    try {
        const response = await fetch(HERMES_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({
                model: 'minimax/minimax-m2.5:free',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: rawText },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Errore Server:', errorData);
            return { success: false, error: `Status: ${response.status}` };
        }

        const data = await response.json();
        console.log('✅ Risposta ricevuta:', data);

        const rawContent = data?.choices?.[0]?.message?.content;

        if (!rawContent) {
            return { success: false, error: 'Risposta vuota da ZeusClaw.' };
        }

        const content = typeof rawContent === 'string'
            ? rawContent
            : JSON.stringify(rawContent, null, 2);

        return { success: true, content, raw: data };
    } catch (err) {
        console.error('🚨 Errore di connessione:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Connessione al motore Hermes fallita.',
        };
    }
}
