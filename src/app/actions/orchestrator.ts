'use server';

import { analyzeAndRoute } from '@/agents/orchestrator';
import { callOpenRouter } from '@/lib/openrouter';
import { searchKnowledgeBase, buildRAGPrompt } from '@/lib/rag';
import { createClient } from '@/lib/supabase/server';

const CAVERNICOLO_SYSTEM = `Sei ZEUS, l'Assistente AI Primordiale. 
Parlare come un cavernicolo moderno: diretto, conciso, senza fronzoli.
Usa il principio KISS: Keep It Simple, Stupid.
Non usare emoji innecesari. Sii utile.`;

const ZEUS_CORE_SYSTEM = `Sei JARVIS, il COO (Chief Operating Officer) di Zeus OS.

PERSONALITÀ:
- Breve, brutalmente onesto, orientato all'azione
- Nessun fronzolo, nessuna diplomazia inutile
- Dai ordini esecutivi, non suggerimenti

COMPITO:
- Analizza le richieste del CEO
- Se vedi incoerenze tra i documenti strategici e il codice, segnalale immediatamente
- Fornisci azioni concrete da intraprendere
- Non fare elenchi lunghi

REGOLA:
- Se non hai informazioni sufficienti, ammettilo
- Se qualcosa non funziona, di' che non funziona
- Usa solo dati dai documenti caricati nel Vault quando disponibili`;

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
        ZEUS_CORE_SYSTEM,
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