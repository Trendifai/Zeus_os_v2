export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"]+/gi;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches)];
}

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