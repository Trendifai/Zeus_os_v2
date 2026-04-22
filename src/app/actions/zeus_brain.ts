'use server';

import { callOpenRouter } from '@/lib/openrouter';
import { scrapeUrl } from './scrape_tool';
import { saveToRaw } from './save_to_raw';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const RAW_DIR = join(process.cwd(), 'src/wiki/raw');
const CONTEXT_FILE = join(process.cwd(), 'src/zeus_context.txt');
const GOALS_FILE = join(process.cwd(), 'src/wiki/index/00_GOALS/active_kpis.md');

export interface BrainContext {
  goals: Goal[];
  kpis: KPI[];
  recentSuggestions: string[];
  lastScrapeResult?: string;
}

export interface Goal {
  id: string;
  name: string;
  objective: string;
  kpi: string;
  status: 'pending' | 'in_progress' | 'completed';
  owner: string;
}

export interface KPI {
  id: string;
  metric: string;
  target: string;
  current?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface BrainResponse {
  success: boolean;
  response: string;
  context: BrainContext;
  actions?: string[];
  scrapeResult?: string;
  savedFile?: string;
  error?: string;
}

async function loadContext(): Promise<BrainContext> {
  let goals: Goal[] = [];
  let kpis: KPI[] = [];
  let recentSuggestions: string[] = [];

  if (existsSync(GOALS_FILE)) {
    const content = readFileSync(GOALS_FILE, 'utf-8');
    const lines = content.split('\n');
    
    let currentGoal: Partial<Goal> = {};
    let currentKPI: Partial<KPI> = {};
    
    for (const line of lines) {
      if (line.startsWith('## GOAL_')) {
        if (currentGoal.id) goals.push(currentGoal as Goal);
        const id = line.replace('## ', '').trim();
        currentGoal = { id, status: 'pending', owner: 'ZEUS-GDA' };
      }
      if (line.startsWith('- **Objective**:')) currentGoal.objective = line.replace('- **Objective**:', '').trim();
      if (line.startsWith('- **KPI**:')) currentGoal.kpi = line.replace('- **KPI**:', '').trim();
      if (line.startsWith('- **Status**:')) currentGoal.status = line.replace('- **Status**:', '').trim() as Goal['status'];
      if (line.startsWith('| P-')) {
        const parts = line.split('|').filter(p => p.trim());
        if (parts.length >= 4) {
          kpis.push({
            id: parts[1].trim(),
            metric: parts[2].trim(),
            target: parts[3].trim(),
            priority: 'medium'
          });
        }
      }
    }
    if (currentGoal.id) goals.push(currentGoal as Goal);
  }

  const proposalsDir = join(RAW_DIR, 'proposals');
  if (existsSync(proposalsDir)) {
    const files = require('fs').readdirSync(proposalsDir).filter((f: string) => f.endsWith('.md'));
    recentSuggestions = files.slice(-3);
  }

  return { goals, kpis, recentSuggestions };
}

async function scrapeAndReport(url: string): Promise<string> {
  const result = await scrapeUrl(url);
  if (result.success && result.content) {
    const truncated = result.content.slice(0, 2000);
    return `SITO: ${result.title || url}\n\nCONTENUTO (primi 2000 chars):\n${truncated}`;
  }
  throw new Error(result.error || 'Scraping fallito');
}

const ZEUS_BRAIN_SYSTEM = `Sei ZEUS, l'Assistente AI Primordiale di Manipura OS.
Sei dotato di un CERVELLO (ZEUS_BRAIN) che:
1. Legge il CONTESTO da src/zeus_context.txt
2. Consulta i GOALS da src/wiki/index/00_GOALS/active_kpis.md
3. Può SCRAPARE siti web e salvare in src/wiki/raw/
4. Propone modifiche validate contro i KPI

COMPORTAMENTO:
- Quando ti chiedono di "scansionare", "leggere", "analizzare" un URL → usa scrapeUrl e riporta
- Dopo lo scraping, CHIEDI sempre: "Salvo in src/wiki/raw/?"
- MAI salvare senza conferma esplicita ("Sì", "Salva", "Conferma")
- Quando ricevi un comando → consulta i GOALS e valuta l'impatto KPI
- Rispondi in modo conciso, orientato all'azione

OUTPUT FORMAT:
- Per risposte normali: testo libero
- Dopo scraping: riassunto + domanda di conferma
- Per errori: "ERRORE: [messaggio]. Riprovo, CEO?"`;

export async function processZeusCommand(input: string): Promise<BrainResponse> {
  try {
    const context = await loadContext();
    const lowerInput = input.toLowerCase();

    const hasUrl = /https?:\/\/[^\s<>"]+/gi.test(input);
    const isScrapingCommand = lowerInput.includes('scansiona') || 
                              lowerInput.includes('leggi') || 
                              lowerInput.includes('analizza') ||
                              lowerInput.includes('scrape');

    let enhancedPrompt = input;
    let scrapeResult: string | undefined;
    let actions: string[] = [];

    if (hasUrl && isScrapingCommand) {
      const urlMatch = input.match(/https?:\/\/[^\s<>"]+/gi);
      if (urlMatch) {
        try {
          scrapeResult = await scrapeAndReport(urlMatch[0]);
          enhancedPrompt = `${scrapeResult}\n\nDOMANDA UTENTE:\n${input}`;
          actions.push('SCRAPE_COMPLETE');
        } catch (err) {
          return {
            success: false,
            response: 'Sito irraggiungibile o errore di connessione. Riprovo, CEO?',
            context,
            error: err instanceof Error ? err.message : 'Scraping failed'
          };
        }
      }
    }

    const response = await callOpenRouter(
      'google/gemini-2.0-flash-001',
      ZEUS_BRAIN_SYSTEM,
      enhancedPrompt
    );

    return {
      success: true,
      response,
      context,
      actions,
      scrapeResult
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Errore sconosciuto';
    
    if (msg.includes('fetch') || msg.includes('network')) {
      return {
        success: false,
        response: 'Sito irraggiungibile o errore di connessione. Riprovo, CEO?',
        context: await loadContext(),
        error: 'Network error'
      };
    }

    return {
      success: false,
      response: `ERRORE: ${msg}`,
      context: await loadContext(),
      error: msg
    };
  }
}

export async function saveScrapedContent(content: string, filename: string): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    if (!existsSync(RAW_DIR)) {
      mkdirSync(RAW_DIR, { recursive: true });
    }
    const result = await saveToRaw(content, filename);
    return result;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
  }
}

export async function getBrainStatus(): Promise<{
  goals: Goal[];
  kpis: KPI[];
  contextLoaded: boolean;
  lastUpdate: string;
}> {
  const context = await loadContext();
  return {
    goals: context.goals,
    kpis: context.kpis,
    contextLoaded: existsSync(CONTEXT_FILE),
    lastUpdate: new Date().toISOString()
  };
}