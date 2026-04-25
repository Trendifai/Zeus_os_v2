import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const LOG_DIR = join(process.cwd(), 'src/wiki/log');
const LOG_FILE = join(LOG_DIR, 'maintenance.md');

export interface LogEntry {
  timestamp?: string;
  action: string;
  status: 'success' | 'error' | 'info';
  details?: string;
  url?: string;
}

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
  if (!existsSync(LOG_FILE)) {
    appendFileSync(LOG_FILE, `# ZEUS Wiki Maintenance Log\n\n`);
  }
}

export function logAction(entry: LogEntry) {
  ensureLogDir();
  
  const timestamp = entry.timestamp || new Date().toISOString();
  const statusIcon = entry.status === 'success' ? '[OK]' : entry.status === 'error' ? '[ERR]' : '[INFO]';
  
  let line = `\n| ${timestamp} | ${statusIcon} ${entry.action}`;
  if (entry.url) line += ` | ${entry.url}`;
  if (entry.details) line += ` | ${entry.details}`;
  
  appendFileSync(LOG_FILE, line + '\n');
}

export function logScraping(url: string, success: boolean, error?: string, title?: string) {
  logAction({
    action: success ? 'SCRAPE' : 'SCRAPE_FAILED',
    status: success ? 'success' : 'error',
    url,
    details: error || title || 'OK'
  });
}

export function logCompilation(documents: number, tokens: number) {
  logAction({
    action: 'COMPILE',
    status: 'success',
    details: `${documents} docs, ~${tokens} tokens`
  });
}

export function logLint(filesChecked: number, errors: number, warnings: number) {
  logAction({
    action: 'LINT',
    status: errors > 0 ? 'error' : 'success',
    details: `${filesChecked} files, ${errors} errors, ${warnings} warnings`
  });
}

export function logProposal(goalId: string, filename: string) {
  logAction({
    action: 'PROPOSAL_CREATED',
    status: 'info',
    details: `Goal: ${goalId}, File: ${filename}`
  });
}

export function logGoalUpdate(goalId: string, status: string) {
  logAction({
    action: 'GOAL_UPDATED',
    status: 'info',
    details: `${goalId} → ${status}`
  });
}