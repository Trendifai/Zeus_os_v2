'use server';

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { callOpenRouter } from '@/lib/openrouter';
import { scrapeUrl } from './scrape_tool';
import { extractUrls, urlToFilename } from '@/lib/url-utils';
import { logScraping } from './zeus_logger';

const RAW_DIR = join(process.cwd(), 'src/wiki/raw');

async function writeToRaw(content: string, filename: string, metadata?: { url?: string; title?: string }): Promise<string> {
  if (!existsSync(RAW_DIR)) {
    mkdirSync(RAW_DIR, { recursive: true });
  }

  const safeFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
  const outputPath = join(RAW_DIR, safeFilename);

  const frontmatter = metadata
    ? `---\nurl: "${metadata.url || ''}"\ntitle: "${metadata.title || safeFilename}"\nsaved: "${new Date().toISOString()}"\n---\n\n`
    : '';

  writeFileSync(outputPath, frontmatter + content);
  return outputPath;
}

const ZEUS_SYSTEM = `Sei ZEUS, l'Assistente AI Primordiale di Manipura OS.
REGOLE:
1. Se l'utente dice "scansiona", "leggi", "analizza" + URL → usa scrapeUrl
2. Dopo scraping, riporta il contenuto e CHIEDI: "Salvo in src/wiki/raw/[nomefile].md?"
3. MAI salvare automaticamente senza conferma esplicita dell'utente ("Sì", "Salva", "Conferma")
4. Per errori di rete → "Sito irraggiungibile o errore di connessione. Riprovo, CEO?"
5. Rispondi in modo conciso e orientato all'azione`;

function extractUrl(text: string): string | null {
  const urls = extractUrls(text);
  return urls.length > 0 ? urls[0] : null;
}

function extractFilename(text: string): string {
  const url = extractUrl(text);
  if (url) {
    return urlToFilename(url) + '.md';
  }
  return 'scraped-content.md';
}

export interface ZeusResponse {
  success: boolean;
  output: string;
  error?: string;
  scraped?: boolean;
  saved?: boolean;
}

export async function handleZeusCommand(prompt: string): Promise<ZeusResponse> {
  try {
    const url = extractUrl(prompt);
    const isScraping = url && (
      prompt.toLowerCase().includes('scansiona') ||
      prompt.toLowerCase().includes('leggi') ||
      prompt.toLowerCase().includes('analizza') ||
      prompt.toLowerCase().includes('scrape') ||
      prompt.toLowerCase().includes('visita')
    );

    let enhancedPrompt = prompt;
    let scraped = false;

    if (isScraping && url) {
      console.log('[ZEUS] Scraping URL:', url);
      
      const result = await scrapeUrl(url);
      
      if (!result.success) {
        logScraping(url, false, result.error);
        return {
          success: false,
          output: '',
          error: result.error || 'Sito irraggiungibile o errore di connessione. Riprovo, CEO?'
        };
      }
      
      logScraping(url, true, result.title);
      console.log('[ZEUS] Scrape success:', result.title);

      const filename = urlToFilename(url) + '.md';
      const contentSummary = result.content 
        ? result.content.slice(0, 2000) 
        : 'Contenuto non disponibile';

      enhancedPrompt = `SITO SCRAPATO: ${result.title || url}
URL: ${url}
FILE DESTINAZIONE: src/wiki/raw/${filename}

CONTENUTO:
${contentSummary}

DOMANDA UTENTE: ${prompt}

Istruzioni: Riporta il contenuto estratto e chiedi conferma per salvare in src/wiki/raw/${filename}`;
      scraped = true;
    }

    const response = await callOpenRouter(
      'google/gemini-2.0-flash-001',
      ZEUS_SYSTEM,
      enhancedPrompt
    );

    return {
      success: true,
      output: response,
      scraped
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Errore sconosciuto';
    
    console.log('[ZEUS ERROR]', msg);
    
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) {
      return {
        success: false,
        output: '',
        error: 'Sito irraggiungibile o errore di connessione. Riprovo, CEO?'
      };
    }

    return {
      success: false,
      output: '',
      error: msg
    };
  }
}

export async function saveToRaw(content: string, filename?: string): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const safeFilename = filename || extractFilename('scraped');
    const path = await writeToRaw(content, safeFilename);
    return { success: true, path };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
  }
}