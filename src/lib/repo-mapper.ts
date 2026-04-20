'use server';

import { createClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

export interface DiscoveredCapability {
  type: 'skill' | 'config' | 'doc' | 'agent' | 'workflow';
  name: string;
  path: string;
  description: string;
  language?: string;
  version?: 'v0' | 'v1' | 'v2';
}

export interface RepoDiscoveryResult {
  repo_name: string;
  total_skills: number;
  total_configs: number;
  total_docs: number;
  capabilities: DiscoveredCapability[];
  scanned_at: string;
}

const SKILL_EXTENSIONS = ['.ts', '.js', '.py', '.md'];
const CONFIG_EXTENSIONS = ['.json', '.yaml', '.yml', '.toml'];
const DOC_EXTENSIONS = ['.md', '.txt'];
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', '.cache'];
const SUPPORTED_EXTENSIONS = [...SKILL_EXTENSIONS, ...CONFIG_EXTENSIONS, ...DOC_EXTENSIONS];

function getLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const langs: Record<string, string> = {
    '.ts': 'typescript',
    '.js': 'javascript',
    '.py': 'python',
    '.md': 'markdown',
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.toml': 'toml',
  };
  return langs[ext] || 'unknown';
}

function getCapabilityType(filePath: string): DiscoveredCapability['type'] {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/agents/')) return 'agent';
  if (normalized.includes('/skills/')) return 'skill';
  if (normalized.includes('/workflows/')) return 'workflow';
  if (normalized.includes('config') || normalized.endsWith('.json')) return 'config';
  return 'doc';
}

function extractDescription(content: string): string {
  const lines = content.split('\n').filter(l => l.trim());
  const firstLine = lines[0]?.replace(/^#+\s*/, '').trim();
  return firstLine || 'Unnamed capability';
}

function scanDirRecursive(dir: string, basePath: string): DiscoveredCapability[] {
  const capabilities: DiscoveredCapability[] = [];
  
  if (!fs.existsSync(dir)) return capabilities;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (IGNORE_DIRS.includes(entry.name)) continue;
      if (entry.name.startsWith('.') && entry.name !== '.agent') continue;

      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        const subCaps = scanDirRecursive(fullPath, basePath);
        capabilities.push(...subCaps);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          const content = ext === '.md' ? fs.readFileSync(fullPath, 'utf-8').slice(0, 500) : '';
          capabilities.push({
            type: getCapabilityType(relativePath),
            name: path.basename(entry.name, ext),
            path: relativePath,
            description: extractDescription(content),
            language: getLanguage(relativePath),
          });
        }
      }
    }
  } catch (error) {
    console.log(`📂 SCAN: Errore scanning ${dir}`);
  }

  return capabilities;
}

export async function discoverCapabilities(repoName?: string): Promise<RepoDiscoveryResult> {
  const basePath = process.cwd();
  let capabilities: DiscoveredCapability[] = [];

  const srcPath = path.join(basePath, 'src');
  if (fs.existsSync(srcPath)) {
    capabilities = scanDirRecursive(srcPath, basePath);
  }

  const agentPath = path.join(basePath, '.agent');
  if (fs.existsSync(agentPath)) {
    const agentCaps = scanDirRecursive(agentPath, basePath);
    capabilities.push(...agentCaps);
  }

  const skills = capabilities.filter(f => f.type === 'skill' || f.type === 'agent' || f.type === 'workflow');
  const configs = capabilities.filter(f => f.type === 'config');
  const docs = capabilities.filter(f => f.type === 'doc');

  return {
    repo_name: repoName || 'ZEUS_AGENTIA_V2',
    total_skills: skills.length,
    total_configs: configs.length,
    total_docs: docs.length,
    capabilities,
    scanned_at: new Date().toISOString(),
  };
}

export async function buildDynamicSystemPrompt(discovery?: RepoDiscoveryResult): Promise<string> {
  if (!discovery) {
    discovery = await discoverCapabilities();
  }

  const skillList = discovery.capabilities
    .filter(c => c.type === 'skill' || c.type === 'agent')
    .slice(0, 20)
    .map(c => `- ${c.name} (${c.path})`)
    .join('\n');

  const configList = discovery.capabilities
    .filter(c => c.type === 'config')
    .slice(0, 10)
    .map(c => `- ${c.name}: ${c.path}`)
    .join('\n');

  return `CONNECTIONE STABILITA CON REPO: ${discovery.repo_name}

Ho scansionato la repository in modo ricorsivo. Trovato:

🎯 SKILLS E AGENTI (${discovery.total_skills}):
${skillList || 'Nessuno trovato'}

⚙️ CONFIGURAZIONI (${discovery.total_configs}):
${configList || 'Nessuna configurazione'}

📚 DOCUMENTI (${discovery.total_docs}):
${discovery.capabilities.filter(c => c.type === 'doc').slice(0, 5).map(c => `- ${c.name}`).join('\n') || 'Nessun documento'}

ISTRUZIONI:
- Usa le skills sopra per rispondere
- Se richiesta è complessa, coordina più skills
- Non inventare capacità inesistenti`;
}