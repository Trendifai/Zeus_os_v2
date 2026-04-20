import { createClient } from '@/lib/supabase/server';

interface KnowledgeFragment {
  content: string;
  source_file: string;
  relevance_score: number;
}

export async function searchKnowledgeBase(query: string, userId: string): Promise<KnowledgeFragment[]> {
  const supabase = await createClient();
  
  const { data: memoryFiles, error } = await supabase
    .from('memory_files')
    .select('id, file_name, status')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .limit(10);

  if (error || !memoryFiles || memoryFiles.length === 0) {
    return [];
  }

  const { data: files } = await supabase.storage
    .from('vault')
    .list(undefined, { limit: 10 });

  const queryLower = query.toLowerCase();
  const fragments: KnowledgeFragment[] = [];

  if (files) {
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'txt' || ext === 'md') {
        const { data: fileContent } = await supabase.storage
          .from('vault')
          .download(file.name);

        if (fileContent) {
          const text = await fileContent.text();
          const lines = text.split('\n').filter(line => line.trim().length > 20);
          
          for (const line of lines) {
            const lineLower = line.toLowerCase();
            let relevance = 0;
            
            const queryWords = queryLower.split(' ').filter(w => w.length > 2);
            for (const word of queryWords) {
              if (lineLower.includes(word)) relevance += 1;
            }
            
            if (relevance > 0) {
              fragments.push({
                content: line.trim().substring(0, 500),
                source_file: file.name,
                relevance_score: relevance,
              });
            }
          }
        }
      }
    }
  }

  return fragments
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 5);
}

export function buildRAGPrompt(userMessage: string, fragments: KnowledgeFragment[]): string {
  if (fragments.length === 0) {
    return userMessage;
  }

  const contextSection = fragments
    .map((f, i) => `[Contesto ${i + 1}] (Fonte: ${f.source_file})\n${f.content}`)
    .join('\n\n---\n\n');

  return `CONTESTO PRIVATO DEL CEO - Priorità Assoluta:
Sei alimentato dai documenti strategici privati del CEO. Usa le seguenti informazioni per rispondere, cita la fonte quando pertinente.

${contextSection}

---

DOMANDA DEL CEO:
${userMessage}

ISTRUZIONE:
- Rispondi usando优先 il contesto fornito sopra
- Se il contesto contiene informazioni rilevanti, citale esplicitamente
- Formatta la risposta in modo chiaro e strategico
- Se non hai informazioni sufficienti, dillo onestamente`;
}