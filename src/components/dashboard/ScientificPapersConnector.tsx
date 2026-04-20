'use client';

import { useState } from 'react';
import { GraduationCap, Search, Loader2, ExternalLink, FileText, X } from 'lucide-react';
import { searchScientificKnowledge, type SearchResult, type ScientificPaper } from '@/lib/mcp/consensus-provider';

export default function ScientificPapersConnector() {
  const [isConnected, setIsConnected] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ScientificPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResult: SearchResult = await searchScientificKnowledge(query);
      setResults(searchResult.papers);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 rounded-lg border border-amber-400/30 bg-amber-400/5 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/50 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5" />
          <span className="font-medium text-sm">Scientific Papers</span>
        </div>
        <p className="text-xs text-zinc-400 mb-2">ArXiv / Open Source</p>
        <p className="text-xs text-zinc-500 mb-3 leading-tight">
          Archivio Scientifico. Connetti ArXiv e database open-source per far studiare a Jarvis le ultime ricerche e paper accademici.
        </p>
        <button
          onClick={handleConnect}
          className="w-full py-1.5 text-xs border border-amber-400/30 rounded text-amber-400 hover:bg-amber-400/10 transition-colors"
        >
          Connetti Open-Source
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border border-green-500/50 bg-green-500/5 text-green-400">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          <span className="font-medium text-sm">Scientific Papers</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="p-1 hover:bg-red-500/20 rounded transition-colors"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      </div>

      <form onSubmit={handleSearch} className="relative mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chiedi alla Scienza..."
          className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400/50 focus:outline-none"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-amber-400 hover:bg-amber-400/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </form>

      {showResults && results.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {results.map((paper) => (
            <div
              key={paper.id}
              className="p-2 bg-zinc-900/50 rounded border border-zinc-800"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-zinc-100 font-medium line-clamp-1">{paper.title}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2">{paper.abstract}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-600">{paper.authors.slice(0, 2).join(', ')}</span>
                    <span className="text-xs text-zinc-600">•</span>
                    <span className="text-xs text-zinc-600">{paper.published_date}</span>
                  </div>
                </div>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1 text-amber-400 hover:bg-amber-400/10 rounded"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && (
        <p className="text-xs text-zinc-500 text-center py-2">Nessun risultato trovato</p>
      )}
    </div>
  );
}