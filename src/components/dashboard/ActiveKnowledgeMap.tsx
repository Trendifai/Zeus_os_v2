'use client';

import { useState, useEffect } from 'react';
import { GitBranch, Database, Brain, Zap } from 'lucide-react';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

interface ConnectorStats {
  id: string;
  name: string;
  icon: typeof GitBranch;
  stats: string;
}

export default function ActiveKnowledgeMap() {
  const [knowledgeMap, setKnowledgeMap] = useState<ConnectorStats[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const map: ConnectorStats[] = [
      {
        id: 'vault',
        name: 'Vault',
        icon: Database,
        stats: 'Memory + RAG',
      },
      {
        id: 'rag',
        name: 'RAG Engine',
        icon: Brain,
        stats: 'Contesto Privato',
      },
      {
        id: 'orchestrator',
        name: 'Orchestrator',
        icon: Zap,
        stats: 'COO Mode',
      },
    ];

    setKnowledgeMap(map);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-zinc-900/50 border border-amber-400/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-medium text-zinc-100">Active Knowledge Map</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {knowledgeMap.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 hover:border-amber-400/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-zinc-300">{item.name}</span>
            </div>
            <p className="text-xs text-zinc-500">{item.stats}</p>
          </div>
        ))}
      </div>
    </div>
  );
}