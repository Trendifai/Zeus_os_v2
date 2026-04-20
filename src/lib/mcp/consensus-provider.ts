export interface ScientificPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  published_date: string;
  journal: string;
  url: string;
  citation_count: number;
}

export interface SearchResult {
  papers: ScientificPaper[];
  total_results: number;
  query: string;
}

const SIMULATED_PAPERS: ScientificPaper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    abstract: 'We propose a new network architecture based on the attention mechanism.',
    authors: ['Vaswani', 'Shazeer', 'Parmar'],
    published_date: '2017-06-12',
    journal: 'arXiv',
    url: 'https://arxiv.org/abs/1706.03762',
    citation_count: 95000,
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    abstract: 'We introduce a new language representation model called BERT.',
    authors: ['Devlin', 'Chang', 'Lee'],
    published_date: '2018-10-11',
    journal: 'arXiv',
    url: 'https://arxiv.org/abs/1810.04805',
    citation_count: 80000,
  },
  {
    id: '3',
    title: 'GPT-3: Language Models are Few-Shot Learners',
    abstract: 'We demonstrate that scaling up language models greatly improves task-agnostic performance.',
    authors: ['Brown', 'Mann', 'Ryder'],
    published_date: '2020-05-28',
    journal: 'arXiv',
    url: 'https://arxiv.org/abs/2005.14165',
    citation_count: 15000,
  },
  {
    id: '4',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    abstract: 'We present retrieval-augmented generation (RAG) models for knowledge-intensive tasks.',
    authors: ['Lewis', 'Perez', 'Piktus'],
    published_date: '2020-05-22',
    journal: 'arXiv',
    url: 'https://arxiv.org/abs/2005.11401',
    citation_count: 5000,
  },
  {
    id: '5',
    title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    abstract: 'We explore how chain-of-thought prompting improves reasoning capabilities.',
    authors: ['Wei', 'Wang', 'Schuurmans'],
    published_date: '2022-01-28',
    journal: 'arXiv',
    url: 'https://arxiv.org/abs/2201.11903',
    citation_count: 8000,
  },
];

export async function searchScientificKnowledge(query: string): Promise<SearchResult> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const normalizedQuery = query.toLowerCase();
  const papers = SIMULATED_PAPERS.filter(paper => 
    paper.title.toLowerCase().includes(normalizedQuery) ||
    paper.abstract.toLowerCase().includes(normalizedQuery) ||
    paper.authors.some(author => author.toLowerCase().includes(normalizedQuery))
  );

  return {
    papers: papers.length > 0 ? papers : SIMULATED_PAPERS.slice(0, 3),
    total_results: papers.length || 3,
    query,
  };
}

export async function getPaperById(id: string): Promise<ScientificPaper | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return SIMULATED_PAPERS.find(p => p.id === id) || null;
}