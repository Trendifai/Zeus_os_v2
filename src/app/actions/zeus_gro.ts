'use server';

import { callOpenRouter } from '@/lib/openrouter';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const GOALS_DIR = join(process.cwd(), 'src/wiki/index/00_GOALS');
const PROPOSALS_DIR = join(process.cwd(), 'src/wiki/raw/proposals');

interface KPI {
  id: string;
  metric: string;
  target: string;
  current?: string;
  priority: 'high' | 'medium' | 'low';
}

interface GoalContext {
  kpis: KPI[];
  activeGoals: string[];
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export async function evaluateGoals(): Promise<GoalContext> {
  const kpiFile = join(GOALS_DIR, 'active_kpis.md');
  
  let kpis: KPI[] = [];
  let activeGoals: string[] = [];
  
  if (existsSync(kpiFile)) {
    const content = readFileSync(kpiFile, 'utf-8');
    
    const lines = content.split('\n');
    let currentKPI: Partial<KPI> = {};
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentKPI.id) {
          kpis.push(currentKPI as KPI);
        }
        currentKPI = { priority: 'medium' };
      }
      if (line.startsWith('id:')) currentKPI.id = line.replace('id:', '').trim();
      if (line.startsWith('metric:')) currentKPI.metric = line.replace('metric:', '').trim();
      if (line.startsWith('target:')) currentKPI.target = line.replace('target:', '').trim();
      if (line.startsWith('current:')) currentKPI.current = line.replace('current:', '').trim();
      if (line.startsWith('priority:')) currentKPI.priority = line.replace('priority:', '').trim() as KPI['priority'];
      if (line.startsWith('- [x]')) activeGoals.push(line.replace('- [x]', '').trim());
    }
    
    if (currentKPI.id) {
      kpis.push(currentKPI as KPI);
    }
  }
  
  return { kpis, activeGoals };
}

export async function checkKPIConflict(command: string, codeSnippet?: string): Promise<{
  conflicts: KPI[];
  suggestion?: string;
}> {
  const goals = await evaluateGoals();
  const conflicts: KPI[] = [];
  
  const lowerCommand = command.toLowerCase();
  
  for (const kpi of goals.kpis) {
    const metric = kpi.metric.toLowerCase();
    
    if (metric.includes('bundle') || metric.includes('size') || metric.includes('weight')) {
      if (lowerCommand.includes('import') && codeSnippet && codeSnippet.length > 500) {
        conflicts.push(kpi);
      }
    }
    
    if (metric.includes('load') || metric.includes('performance') || metric.includes('speed')) {
      if (lowerCommand.includes('heavy') || (codeSnippet && codeSnippet.length > 1000)) {
        conflicts.push(kpi);
      }
    }
    
    if (metric.includes('token') || metric.includes('context')) {
      if (codeSnippet && codeSnippet.split(/\s+/).length > 500) {
        conflicts.push(kpi);
      }
    }
  }
  
  let suggestion: string | undefined;
  
  if (conflicts.length > 0) {
    const kpiNames = conflicts.map(c => c.metric).join(', ');
    suggestion = `ATTENZIONE: Questa modifica potrebbe impattare i KPI: ${kpiNames}. ` +
      `Suggerisco di: 1) Lazy loading dei componenti, 2) Code splitting, 3) Memoizzazione selettiva.`;
  }
  
  return { conflicts, suggestion };
}

export async function proposeChange(proposal: {
  title: string;
  targetFile?: string;
  currentCode?: string;
  proposedCode: string;
  rationale: string;
  kpisAffected: string[];
}): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    ensureDir(PROPOSALS_DIR);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${proposal.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filepath = join(PROPOSALS_DIR, filename);
    
    const content = `---
title: "${proposal.title}"
timestamp: "${new Date().toISOString()}"
status: "pending"
target_file: "${proposal.targetFile || 'N/A'}"
kpis_affected: [${proposal.kpisAffected.map(k => `"${k}"`).join(', ')}]
---

## Rationale
${proposal.rationale}

## Modifiche Proposte

### File Target
\`\`\`
${proposal.targetFile || 'Da definire'}
\`\`\`

### Codice Attuale
\`\`\`typescript
${proposal.currentCode || 'Non specificato'}
\`\`\`

### Codice Proposto
\`\`\`typescript
${proposal.proposedCode}
\`\`\`

---
_Generato automaticamente da Zeus-GDA_
`;
    
    writeFileSync(filepath, content);
    
    return { success: true, path: filepath };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Proposal failed' };
  }
}

const ZEUS_GDA_SYSTEM = `Tu sei ZEUS-GDA (Goal-Driven Agent), l'evoluzione di Zeus per il Goal-Driven Orchestration.
COMPITO: Monitorare il codice in parallelo a GCA (Gemini Code Assist).
Ogni suggerimento DEVE essere validato contro i KPI in src/wiki/index/00_GOALS/active_kpis.md.
FLUSSO:
1. Ricevi un comando utente
2. Consulta i GOALS attivi
3. Valuta l'impatto sui KPI
4. Se conflitto → proponi alternativa ottimizzata
5. Se OK → esegui e proponi_change se necessario
TOOL propose_change: Scrive file in src/wiki/raw/proposals/ per approvazione CEO.
TOOL checkKPI: Valida modifiche contro KPI prima dell'esecuzione.
REGOLA: Mai modificare codice senza proposta e approvazione esplicita.`;

export async function executeZeusGDA(prompt: string, context?: {
  currentCode?: string;
  targetFile?: string;
}): Promise<{
  success: boolean;
  output: string;
  kpiWarning?: string;
  proposalCreated?: string;
  error?: string;
}> {
  try {
    const { conflicts, suggestion } = await checkKPIConflict(prompt, context?.currentCode);
    
    let enhancedPrompt = prompt;
    
    if (context?.currentCode) {
      enhancedPrompt += `\n\nCodice in analisi:\n\`\`\`typescript\n${context.currentCode}\n\`\`\``;
    }
    
    if (conflicts.length > 0) {
      enhancedPrompt += `\n\n⚠️ KPI CONFLICT DETECTED: ${conflicts.map(c => c.metric).join(', ')}`;
    }
    
    const response = await callOpenRouter(
      'google/gemini-2.0-flash-001',
      ZEUS_GDA_SYSTEM,
      enhancedPrompt
    );
    
    return {
      success: true,
      output: response,
      kpiWarning: conflicts.length > 0 ? suggestion : undefined
    };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: err instanceof Error ? err.message : 'ZEUS-GDA Error'
    };
  }
}

export async function listProposals(): Promise<{ files: string[]; paths: string[] }> {
  ensureDir(PROPOSALS_DIR);
  
  const files = existsSync(PROPOSALS_DIR) 
    ? require('fs').readdirSync(PROPOSALS_DIR).filter((f: string) => f.endsWith('.md'))
    : [];
    
  return {
    files,
    paths: files.map((f: string) => join(PROPOSALS_DIR, f))
  };
}