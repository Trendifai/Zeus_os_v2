'use server';

import { callOpenRouter } from '@/lib/openrouter';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const GOALS_DIR = join(process.cwd(), 'src/wiki/index/00_GOALS');
const PROPOSALS_DIR = join(process.cwd(), 'src/wiki/raw/proposals');

interface Goal {
  id: string;
  name: string;
  objective: string;
  kpi: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface KPI {
  id: string;
  metric: string;
  target: string;
  current?: string;
  priority: 'high' | 'medium' | 'low';
}

interface GoalContext {
  goals: Goal[];
  kpis: KPI[];
  activeGoals: string[];
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export async function loadGoals(): Promise<GoalContext> {
  const goalsFile = join(GOALS_DIR, 'active_kpis.md');
  
  const goals: Goal[] = [];
  const kpis: KPI[] = [];
  const activeGoals: string[] = [];
  
  if (existsSync(goalsFile)) {
    const content = readFileSync(goalsFile, 'utf-8');
    const lines = content.split('\n');
    
    let currentGoal: Partial<Goal> = {};
    let inGoalSection = false;
    
    for (const line of lines) {
      if (line.startsWith('- [GOAL_')) {
        inGoalSection = true;
        if (currentGoal.id) goals.push(currentGoal as Goal);
        
        const match = line.match(/\[([^\]]+)\]:\s*(.+)/);
        if (match) {
          currentGoal = { 
            id: match[1], 
            name: match[2].split('(')[0].trim(),
            status: 'pending'
          };
          activeGoals.push(match[1]);
        }
      }
      
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
      
      if (line.includes('(') && currentGoal.id) {
        const objMatch = line.match(/\(([^)]+)\)/);
        if (objMatch) currentGoal.objective = objMatch[1];
      }
    }
    
    if (currentGoal.id) goals.push(currentGoal as Goal);
  }
  
  return { goals, kpis, activeGoals };
}

export async function checkKPIConflict(code: string, goal: Goal): Promise<{
  hasConflict: boolean;
  severity: 'high' | 'medium' | 'low';
  suggestion?: string;
}> {
  const kpiName = goal.kpi.toLowerCase();
  
  if (kpiName.includes('bundle') || kpiName.includes('size')) {
    if (code.length > 5000) {
      return {
        hasConflict: true,
        severity: 'high',
        suggestion: `ATTENZIONE: Questo codice (~${(code.length/1000).toFixed(1)}kb) potrebbe impattare ${goal.name}. Suggerisco code splitting o lazy loading.`
      };
    }
  }
  
  if (kpiName.includes('load') || kpiName.includes('performance')) {
    if (code.includes('useEffect') && !code.includes('[]')) {
      return {
        hasConflict: true,
        severity: 'medium',
        suggestion: `ATTENZIONE: useEffect senza dependency array rilevato. Potrebbe impattare ${goal.name}.`
      };
    }
  }
  
  return { hasConflict: false, severity: 'low' };
}

export async function createProposal(proposal: {
  title: string;
  targetFile?: string;
  currentCode?: string;
  proposedCode: string;
  rationale: string;
  goalId: string;
}): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    ensureDir(PROPOSALS_DIR);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${proposal.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filepath = join(PROPOSALS_DIR, filename);
    
    const content = `---
title: "${proposal.title}"
timestamp: "${new Date().toISOString()}"
status: "pending_ceo_approval"
goal_id: "${proposal.goalId}"
target_file: "${proposal.targetFile || 'N/A'}"
---

## Rationale
${proposal.rationale}

## File Target
\`\`\`
${proposal.targetFile || 'Da definire'}
\`\`\`

## Codice Attuale
\`\`\`typescript
${proposal.currentCode || 'Non specificato'}
\`\`\`

## Codice Proposto
\`\`\`typescript
${proposal.proposedCode}
\`\`\`

---
⚠️ IN ATTESA DI APPROVAZIONE CEO
_Generato automaticamente da ZEUS-GDA_
`;

    writeFileSync(filepath, content);
    return { success: true, path: filepath };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Proposal failed' };
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

const ZEUS_GDA_SYSTEM = `Sei ZEUS-GDA, l'Agent di Goal-Driven Orchestration per Manipura OS.
MISSIONE: Validare ogni azione contro i KPI in src/wiki/index/00_GOALS/active_kpis.md.
COMPORTAMENTO:
1. Ricevi comando → consulta i GOALS attivi
2. Valuta impatto KPI → se conflitto proponi alternativa
3. Se modifica codice → crea proposal in src/wiki/raw/proposals/
4. Attendi approvazione CEO prima di applicare
TOOL create_proposal: Salva in proposals/ per approvazione CEO
TOOL check_kpi_conflict: Valida codice contro KPI
ERRORE RETE: "Sito irraggiungibile o errore di connessione. Riprovo, CEO?"`;

export async function executeZeusGDA(
  prompt: string,
  context?: { currentCode?: string; targetFile?: string }
): Promise<{
  success: boolean;
  output: string;
  goalId?: string;
  proposalCreated?: string;
  kpiWarning?: string;
  error?: string;
}> {
  try {
    const { goals } = await loadGoals();
    
    let enhancedPrompt = prompt;
    
    if (goals.length > 0) {
      const goalList = goals.map(g => `- ${g.id}: ${g.name}`).join('\n');
      enhancedPrompt += `\n\nGOALS ATTIVI:\n${goalList}`;
    }
    
    if (context?.currentCode) {
      enhancedPrompt += `\n\nCODICE IN ANALISI:\n\`\`\`typescript\n${context.currentCode.slice(0, 1000)}\n\`\`\``;
    }
    
    const response = await callOpenRouter(
      'google/gemini-2.0-flash-001',
      ZEUS_GDA_SYSTEM,
      enhancedPrompt
    );
    
    return {
      success: true,
      output: response,
      goalId: goals[0]?.id
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'ZEUS-GDA Error';
    if (msg.includes('fetch') || msg.includes('network')) {
      return { success: false, output: '', error: 'Sito irraggiungibile o errore di connessione. Riprovo, CEO?' };
    }
    return { success: false, output: '', error: msg };
  }
}