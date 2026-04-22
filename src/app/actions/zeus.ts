'use server';

import { callOpenRouter } from '@/lib/openrouter';
import { scrapeUrl } from './scrape_tool';
import { saveToRaw } from './save_to_raw';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const RAW_DIR = join(process.cwd(), 'src/wiki/raw');

async function scrapeUrlLocal(url: string): Promise<string> {
  const result = await scrapeUrl(url);
  if (result.success && result.content) {
    return result.content.slice(0, 2000);
  }
  throw new Error(result.error || 'Scraping failed');
}

async function saveToRawLocal(content: string, filename: string): Promise<string> {
  const result = await saveToRaw(content, filename);
  if (result.success) {
    return result.path || filename;
  }
  throw new Error(result.error || 'Save failed');
}

const ZEUS_SYSTEM = `Sei ZEUS, l'Assistente AI Primordiale di Manipura OS.
REGOLA ORO: MAI salvare automaticamente dati senza conferma esplicita dell'utente.
TOOL SCRAPE: Quando l'utente dice "scansiona", "leggi", "analizza URL", usa scrapeUrl(url).
Dopo scraping, RIASSUMI il contenuto e CHIEDI: "Dati acquisiti. Salvo in src/wiki/raw/[nomefile].md?"
TOOL SAVE: Solo dopo "Sì", "Salva", "Conferma" → chiama saveToRaw(content, filename).
ERRORE CONNESSIONE: "Sito irraggiungibile o errore di connessione. Riprovo, CEO?"`;

export interface ZeusResponse {
  success: boolean;
  output: string;
  error?: string;
  scraped?: boolean;
}

function extractUrl(text: string): string | null {
  const urlRegex = /https?:\/\/[^\s<>"]+/gi;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

function extractFilename(text: string): string {
  const url = extractUrl(text);
  if (url) {
    try {
      const hostname = new URL(url).hostname.replace(/[^a-zA-Z0-9]/g, '-');
      return `${hostname}.md`;
    } catch {
      return 'scraped-content.md';
    }
  }
  return 'zeus-response.md';
}

export async function handleZeusCommand(prompt: string): Promise<ZeusResponse> {
  try {
    const hasUrl = extractUrl(prompt);
    let contextPrompt = prompt;
    let scraped = false;

    if (hasUrl && (
      prompt.toLowerCase().includes('scansiona') ||
      prompt.toLowerCase().includes('leggi') ||
      prompt.toLowerCase().includes('analizza') ||
      prompt.toLowerCase().includes('scrape')
    )) {
      try {
        const scrapedContent = await scrapeUrlLocal(hasUrl);
        contextPrompt = `CONTENUTO SCRAPING:\n${scrapedContent}\n\nDOMANDA UTENTE:\n${prompt}`;
        scraped = true;
      } catch (scrapeErr) {
        return {
          success: false,
          output: '',
          error: 'Sito irraggiungibile o errore di connessione. Riprovo, CEO?',
          scraped: false
        };
      }
    }

    const response = await callOpenRouter(
      'google/gemini-2.0-flash-001',
      ZEUS_SYSTEM,
      contextPrompt
    );

    return {
      success: true,
      output: response,
      scraped
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Errore sconosciuto';
    
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
      return {
        success: false,
        output: '',
        error: 'Sito irraggiungibile o errore di connessione. Riprovo, CEO?',
        scraped: false
      };
    }

    return {
      success: false,
      output: '',
      error: msg,
      scraped: false
    };
  }
}

export async function handleSaveToRaw(content: string, filename?: string): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    if (!existsSync(RAW_DIR)) {
      mkdirSync(RAW_DIR, { recursive: true });
    }
    const safeFilename = filename || extractFilename('scraped');
    const result = await saveToRawLocal(content, safeFilename);
    return { success: true, path: result };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
  }
}