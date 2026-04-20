'use server';

import { analyzeAndRoute } from '@/agents/orchestrator';
import { callOpenRouter } from '@/lib/openrouter';
import { searchKnowledgeBase, buildRAGPrompt } from '@/lib/rag';
import { createClient } from '@/lib/supabase/server';

const CAVERNICOLO_SYSTEM = `Sei ZEUS, l'Assistente AI Primordiale. 
Parlare come un cavernicolo moderno: diretto, conciso, senza fronzoli.
Usa il principio KISS: Keep It Simple, Stupid.
Non usare emoji innecesari. Sii utile.`;

const ZEUS_COO_SYSTEM = `Sei ZEUS COO (Chief Operating Officer) & LEAD ENGINEER di Project ZEUS.

IDENTITÀ:
- Visione: "Fail fast, deliver first, optimize later"
- Azione: Ogni risposta deve generare UTILITY > 90.5% o essere SCARTATA
- Zero marketing, zero chiacchiere, solo CODICE + DATI + AZIONI per il profitto

REGOLA 90.5 ENFORCEMENT:
1. ANALISI: Prima capisci il contesto reale dell'utente
2. UTILITY: Ogni riga di output deve servire a qualcosa di pratico
3. AZIONE: Fornisci siempre next concrete step eseguibile
4. DATI: Usa solo fatti verificabili dai documenti caricati nel Vault

COMPORTAMENTO:
- Breve, brutalmente onesto, orientato al risultato
- Dai ordini esecutivi, non suggerimenti generici
- Se non sai qualcosa, ammettilo e cerca di scoprirla
- Non fare liste inutili, solo azioni che funzionano
- NEVER marketing: mai proporre "contattaci", "richiedi demo", ecc.
- Solo codice eseguibile, dati reali, azioni concrete

METRICA DI SUCCESSO:
- L'utente ha capito esattamente cosa fare?
- Ha il codice/dato/azione per farlo?
- Se sì a entrambi → SUCCESS. Altrimenti → FALLURE.`;

async function saveToMemory(supabase: any, userId: string, prompt: string, response: string) {
  const { error } = await supabase.from('memory_logs').insert({
    user_id: userId,
    prompt,
    response,
    created_at: new Date().toISOString(),
  });
  if (error) {
    console.log('💾 MEMORY: Errore salvataggio log:', error.message);
  } else {
    console.log('💾 MEMORY: Log salvato successfully');
  }
}

export async function executeWithOrchestrator(prompt: string) {
  console.log('🦴 CAVERNICOLO: Ricevuto ordine —', prompt);
  console.log('SERVER: Ricevuto prompt:', prompt);
  console.log('SERVER: API KEY presente:', !!process.env.OPENROUTER_API_KEY);

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let enhancedPrompt = prompt;
    
    if (user) {
      console.log('🔍 RAG: Ricerca contesto nella knowledge base...');
      const fragments = await searchKnowledgeBase(prompt, user.id);
      
      if (fragments.length > 0) {
        console.log(`📚 RAG: Trovati ${fragments.length} frammenti rilevanti`);
        enhancedPrompt = buildRAGPrompt(prompt, fragments);
        console.log('📚 RAG: Prompt potenziato con contesto privato');
      } else {
        console.log('📚 RAG: Nessun frammento trovato, uso prompt originale');
      }
    }

    const result = await analyzeAndRoute(enhancedPrompt);

    if (result.skill === 'general') {
      console.log('🎯 ROUTING: Skill GENERAL - chiamata a Gemini via OpenRouter');
      const aiResponse = await callOpenRouter(
        'google/gemini-2.0-flash-001',
        ZEUS_COO_SYSTEM,
        enhancedPrompt
      );
      if (user) {
        await saveToMemory(supabase, user.id, prompt, aiResponse);
      }
      return {
        success: true,
        skill: result.skill,
        confidence: result.confidence,
        output: aiResponse,
      };
    }

    if (user) {
      await saveToMemory(supabase, user.id, prompt, result.output);
    }

    return {
      success: true,
      skill: result.skill,
      confidence: result.confidence,
      output: result.output,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    console.log('SERVER: Errore:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function fetchExternalData(provider: string, query: string) {
  return {
    success: false,
    error: `Provider ${provider} non configurato. In attesa di API Key.`,
    provider,
    query,
  };
}