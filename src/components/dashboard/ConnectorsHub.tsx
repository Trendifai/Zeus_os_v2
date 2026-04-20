'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RefreshCw, CheckCircle, Mail, CreditCard, Hash, Network, GitBranch, FileText, HardDrive, Send, GitPullRequest, GraduationCap } from 'lucide-react';
import ScientificPapersConnector from './ScientificPapersConnector';
import { discoverCapabilities, type RepoDiscoveryResult } from '@/lib/repo-mapper';

interface ConnectorStatus {
  id: string;
  connected: boolean;
}

const CONNECTORS = [
  { id: 'google', name: 'Google', services: 'Drive / Gmail', icon: Mail },
  { id: 'microsoft', name: 'Microsoft', services: '365 / Teams', icon: HardDrive },
  { id: 'github', name: 'GitHub', services: 'Code / Actions', icon: GitBranch },
  { id: 'arxiv', name: 'Scientific Papers', services: 'ArXiv / Open Source', icon: GraduationCap, description: 'Archivio Scientifico. Connetti ArXiv e database open-source per far studiare a Jarvis le ultime ricerche e paper accademici.' },
  { id: 'x', name: 'X (Twitter)', services: 'Social', icon: Send },
  { id: 'notion', name: 'Notion', services: 'Workspace', icon: FileText },
  { id: 'linkedin', name: 'LinkedIn', services: 'Professional', icon: Network },
  { id: 'meta', name: 'Meta', services: 'Instagram / FB', icon: Hash },
  { id: 'stripe', name: 'Stripe', services: 'Sales', icon: CreditCard },
];

// Inner component that reads searchParams — must be wrapped in Suspense
function ConnectorsHubInner() {
  const searchParams = useSearchParams();
  const successParam = searchParams.get('success');

  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);
  const [modalConnector, setModalConnector] = useState<string | null>(null);
  const [repoDiscovery, setRepoDiscovery] = useState<RepoDiscoveryResult | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (successParam) {
      setConnectors(prev => {
        const exists = prev.find(c => c.id === successParam);
        if (exists) {
          return prev.map(c => c.id === successParam ? { ...c, connected: true } : c);
        }
        return [...prev, { id: successParam, connected: true }];
      });
    }
  }, [successParam]);

  const handleGitHubScan = async () => {
    setScanning(true);
    try {
      const discovery = await discoverCapabilities('ZEUS_AGENTIA_V2');
      setRepoDiscovery(discovery);
      setConnectors(prev => {
        const exists = prev.find(c => c.id === 'github');
        if (exists) return prev;
        return [...prev, { id: 'github', connected: true }];
      });
      alert(`🚀 REPO SCAN COMPLETATA!\n\n🎯 Skills/Agents: ${discovery.total_skills}\n⚙️ Configs: ${discovery.total_configs}\n📚 Docs: ${discovery.total_docs}\n\nTotale capacità: ${discovery.capabilities.length}`);
    } catch (err) {
      console.error('Scan error:', err);
      alert('Errore durante la scansione');
    } finally {
      setScanning(false);
    }
  };

  const handleRescan = async () => {
    setScanning(true);
    try {
      const discovery = await discoverCapabilities('ZEUS_AGENTIA_V2');
      setRepoDiscovery(discovery);
      alert(`🔄 RESCAN COMPLETATO!\n\n🎯 Skills/Agents: ${discovery.total_skills}\n⚙️ Configs: ${discovery.total_configs}\n📚 Docs: ${discovery.total_docs}`);
    } catch (err) {
      console.error('Rescan error:', err);
    } finally {
      setScanning(false);
    }
  };

  const isGitHubConnected = connectors.find(c => c.id === 'github')?.connected;

  return (
    <>
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-amber-400">Connectors</h3>
          <button className="p-2 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CONNECTORS.map((connector) => {
            if (connector.id === 'arxiv') {
              return null;
            }
            
            const status = connectors.find((c) => c.id === connector.id);
            const Icon = connector.icon;
            const isConnected = status?.connected;

            return (
              <div
                key={connector.id}
                className={`p-4 rounded-lg border transition-all ${isConnected
                  ? 'border-green-500/50 bg-green-500/5 text-green-400'
                  : 'border-amber-400/30 bg-amber-400/5 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/50'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{connector.name}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-2">{connector.services}</p>
                {connector.description && (
                  <p className="text-xs text-zinc-500 mb-3 leading-tight">{connector.description}</p>
                )}
                {isConnected ? (
                  <a
                    href={`/api/connectors/${connector.id}/disconnect`}
                    className="flex items-center justify-center gap-1 w-full py-1.5 text-xs border border-red-400/30 rounded text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Scollega
                  </a>
                ) : connector.id === 'github' ? (
                  isGitHubConnected ? (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={handleRescan}
                        disabled={scanning}
                        className="flex items-center justify-center gap-1 w-full py-1.5 text-xs border border-green-400/30 rounded text-green-400 hover:bg-green-400/10 transition-colors"
                      >
                        <RefreshCw className={`w-3 h-3 ${scanning ? 'animate-spin' : ''}`} />
                        {scanning ? 'Scanning...' : 'Rescan'}
                      </button>
                      {repoDiscovery && (
                        <div className="text-xs text-zinc-500 text-center">
                          {repoDiscovery.repo_name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleGitHubScan}
                      disabled={scanning}
                      className="flex items-center justify-center gap-1 w-full py-1.5 text-xs border border-green-400/30 rounded text-green-400 hover:bg-green-400/10 transition-colors"
                    >
                      <GitPullRequest className="w-3 h-3" />
                      {scanning ? 'Scanning...' : 'Scansiona Repo'}
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => alert(`🗺️ ROADMAP ${connector.name.toUpperCase()}:\n\nAttualmente in fase di analisi.\nrichiede: API Key + OAuth Setup.\n\nJarvis: "Attiva OAuth prima di procedere."`)}
                    className="w-full py-1.5 text-xs border border-amber-400/30 rounded text-amber-400 hover:bg-amber-400/10 transition-colors"
                  >
                    In Sviluppo...
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {modalConnector && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setModalConnector(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-zinc-100 mb-2">
              Connessione {CONNECTORS.find(c => c.id === modalConnector)?.name}
            </h3>
            <p className="text-zinc-400 text-sm mb-4">In attesa di configurazione API Key</p>
            <button
              onClick={() => setModalConnector(null)}
              className="w-full py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Exported wrapper with Suspense boundary — required by Next.js for useSearchParams
export default function ConnectorsHub() {
  return (
    <Suspense fallback={
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-amber-400">Connectors</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CONNECTORS.map(c => (
            <div key={c.id} className="p-4 rounded-lg border border-amber-400/20 bg-amber-400/5 animate-pulse h-24" />
          ))}
        </div>
      </div>
    }>
      <ConnectorsHubInner />
    </Suspense>
  );
}