'use server';

import { headers } from 'next/headers';

export async function executeCavemanTest(prompt: string) {
  try {
    const headersList = await headers();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return 'Errore: OPENROUTER_API_KEY non configurata';
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': headersList.get('origin') || 'http://localhost:3000',
        'X-Title': 'ZEUS AGENTIA',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return `Errore HTTP ${response.status}: ${errorText}`;
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content;

    if (!message) {
      return 'Errore: nessuna risposta valida ricevuta';
    }

    return message;
  } catch (error) {
    if (error instanceof Error) {
      return `Errore: ${error.message}`;
    }
    return 'Errore sconosciuto durante l\'esecuzione';
  }
}