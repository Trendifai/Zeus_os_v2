'use server';

export interface ScrapeResult {
  success: boolean;
  content?: string;
  title?: string;
  url?: string;
  error?: string;
  scraped_at?: string;
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Block localhost and internal IPs
    const blocked = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      '10.',
      '192.168.',
      '172.16.',
      '172.17.',
      '172.18.',
      '172.19.',
      '172.20.',
      '172.21.',
      '172.22.',
      '172.23.',
      '172.24.',
      '172.25.',
      '172.26.',
      '172.27.',
      '172.28.',
      '172.29.',
      '172.30.',
      '172.31.'
    ];
    
    const hostname = parsed.hostname.toLowerCase();
    
    for (const block of blocked) {
      if (hostname.startsWith(block)) {
        return false;
      }
    }
    
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function cleanHtml(html: string): string {
  let cleaned = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#[0-9]+;/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    .trim();
  
  return cleaned;
}

export async function scrapeUrl(
  url: string, 
  options?: {
    maxLength?: number;
    timeout?: number;
    logToFile?: boolean;
  }
): Promise<ScrapeResult> {
  const maxLength = options?.maxLength || 2000;
  const timeout = options?.timeout || 10000;
  
  // Validate URL
  if (!isValidUrl(url)) {
    return {
      success: false,
      error: 'URL non valido o interno. Usa solo URL pubblici.',
      url
    };
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ZEUS-OS/1.0 (Web Scraper Bot - zeus.ai@manipura.shop)'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        url
      };
    }
    
    const html = await response.text();
    
    // Check content type
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('html') && !contentType.includes('text')) {
      return {
        success: false,
        error: 'Il contenuto non è HTML. URL non processabile.',
        url
      };
    }
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;
    
    // Clean HTML
    let markdown = cleanHtml(html);
    
    // Truncate if needed
    if (markdown.length > maxLength * 2) {
      markdown = markdown.slice(0, maxLength * 2) + '\n\n... [contenuto troncato]';
    }
    
    return {
      success: true,
      content: markdown,
      title,
      url,
      scraped_at: new Date().toISOString()
    };
    
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    
    if (error.includes('abort')) {
      return {
        success: false,
        error: `Timeout raggiunto (${timeout}ms). Il sito non risponde.`,
        url
      };
    }
    
    if (error.includes('fetch') || error.includes('network')) {
      return {
        success: false,
        error: 'Sito irraggiungibile o errore di connessione.',
        url
      };
    }
    
    return {
      success: false,
      error,
      url
    };
  }
}

// Utility: Extract URLs from text
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"]+/gi;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches)];
}

// Utility: Generate filename from URL
export function urlToFilename(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '').replace(/[^a-zA-Z0-9]/g, '-');
    const path = parsed.pathname.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    return path ? `${hostname}-${path}` : hostname;
  } catch {
    return 'scraped-content';
  }
}