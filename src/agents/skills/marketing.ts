export interface MarketingOutput {
  strategy?: string;
  content?: string;
  channels?: string[];
  metrics?: Record<string, string>;
}

export async function executeMarketingTask(prompt: string): Promise<string> {
  console.log('MARKETING SKILL: Ricevuto prompt:', prompt);
  
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('MARKETING SKILL: API KEY presente:', !!apiKey);
    
    if (!apiKey) {
      return '[MARKETING ERROR] API key non configurata';
    }
    
    const systemPrompt = `Sei un assistente marketing strategico specializzato in:
- Strategia di contenuti
- Copywriting persuasivo
- Analisi brand
- Campagne advertising
- SEO e content marketing

Rispondi in modo professionale e strategico.`;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'ZEUS AGENTIA',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });
    
    console.log('MARKETING SKILL: Risposta HTTP:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('MARKETING SKILL: Errore API:', errorText);
      return `[MARKETING ERROR] HTTP ${response.status}: ${errorText}`;
    }
    
    const data = await response.json();
    const message = data.choices?.[0]?.message?.content;
    
    if (!message) {
      return '[MARKETING ERROR] Nessuna risposta valida';
    }
    
    return `[MARKETING OUTPUT]\n${message}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    console.log('MARKETING SKILL: Errore:', errorMessage);
    return `[MARKETING ERROR] ${errorMessage}`;
  }
}