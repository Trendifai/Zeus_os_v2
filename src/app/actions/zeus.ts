'use server';

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { callOpenRouter } from '@/lib/openrouter';

const RAW_DIR = join(process.cwd(), 'src/wiki/raw');

interface ScrapeResult {
  success: boolean;
  content?: string;
  title?: string;
  error?: string;
}

async function scrapeUrl(url: string): Promise<ScrapeResult> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ZEUS-OS/1.0 (Web Scraper Bot)'
      }
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : url;

    const cleaned = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s+|\s+$/gm, '')
      .trim();

    return {
      success: true,
      content: cleaned.slice(0, 2000),
      title
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

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
  const match = text.match(/https?:\/\/[^\s<>"]+/gi);
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
      prompt.toLowerCase().includes('scrape')
    );

    let enhancedPrompt = prompt;
    let scraped = false;

    if (isScraping) {
      const result = await scrapeUrl(url!);
      
      if (!result.success) {
        return {
          success: false,
          output: '',
          error: 'Sito irraggiungibile o errore di connessione. Riprovo, CEO?'
        };
      }

      enhancedPrompt = `SITO SCRAPATO: ${result.title || url}\n\nCONTENUTO (primi 2000 caratteri):\n${result.content}\n\nDOMANDA UTENTE:\n${prompt}`;
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
    
    if (msg.includes('fetch') || msg.includes('network')) {
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