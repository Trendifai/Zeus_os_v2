import { executeMarketingTask } from './skills/marketing';

export type SkillType = 'marketing' | 'coding' | 'research' | 'general';

export interface SkillResult {
  skill: SkillType;
  output: string;
  confidence: number;
}

const SKILL_KEYWORDS: Record<SkillType, string[]> = {
  marketing: ['marketing', 'content', 'social', 'brand', 'campaign', 'strategy', 'seo', 'copy', 'ad'],
  coding: ['code', 'bug', 'refactor', 'test', 'function', 'api', 'debug', 'implement'],
  research: ['research', 'search', 'find', 'analyze', 'data', 'report', 'investigate'],
  general: [],
};

function detectSkill(prompt: string): SkillType {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS) as [SkillType, string[]][]) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        return skill;
      }
    }
  }
  
  return 'general';
}

function calculateConfidence(prompt: string, skill: SkillType): number {
  if (skill === 'general') return 0.5;
  
  const keywords = SKILL_KEYWORDS[skill];
  const lowerPrompt = prompt.toLowerCase();
  let matches = 0;
  
  for (const keyword of keywords) {
    if (lowerPrompt.includes(keyword)) {
      matches++;
    }
  }
  
  return Math.min(0.95, 0.5 + (matches * 0.15));
}

export async function analyzeAndRoute(prompt: string): Promise<SkillResult> {
  const skill = detectSkill(prompt);
  const confidence = calculateConfidence(prompt, skill);
  
  let output: string;
  
  switch (skill) {
    case 'marketing':
      output = await executeMarketingTask(prompt);
      break;
    default:
      output = `[GENERAL] Prompt ricevuto: "${prompt.substring(0, 50)}..." Skill non specializzato.`;
  }
  
  return {
    skill,
    output,
    confidence,
  };
}