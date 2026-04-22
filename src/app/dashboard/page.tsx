'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Database, Users, Receipt, Filter, X, TrendingUp,
  CreditCard, Clock, Send, Bolt, History, Settings,
  Columns, ExternalLink, ChevronLeft, ChevronRight, Plus,
  Loader2
} from 'lucide-react';
import { handleZeusCommand } from '@/app/actions/zeus';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSplit, setIsSplit] = useState(true);

  const [p1Tabs, setP1Tabs] = useState(['CRM', 'Clienti']);
  const [p1Active, setP1Active] = useState('CRM');

  const [p2Tabs, setP2Tabs] = useState(['Fatture']);
  const [p2Active, setP2Active] = useState('Fatture');

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [zeusWidth, setZeusWidth] = useState(320);
  const [splitPos, setSplitPos] = useState(50);

  const [zeusInput, setZeusInput] = useState('');
  const [zeusMessages, setZeusMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Pronto, CEO. ZEUS è operativo. Cosa devo fare?' }
  ]);
  const [zeusLoading, setZeusLoading] = useState(false);

  const isResizingS = useRef(false);
  const isResizingZ = useRef(false);
  const isResizingSplit = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizingS.current) {
      const w = e.clientX;
      if (w > 100 && w < 400) setSidebarWidth(w);
    }
    if (isResizingZ.current) {
      const w = window.innerWidth - e.clientX;
      if (w > 200 && w < 500) setZeusWidth(w);
    }
    if (isResizingSplit.current) {
      const start = isSidebarCollapsed ? 64 : sidebarWidth;
      const total = window.innerWidth - start - zeusWidth;
      const pos = ((e.clientX - start) / total) * 100;
      if (pos > 20 && pos < 80) setSplitPos(pos);
    }
  }, [sidebarWidth, zeusWidth, isSidebarCollapsed]);

  useEffect(() => {
    const stop = () => {
      isResizingS.current = isResizingZ.current = isResizingSplit.current = false;
      document.body.style.cursor = 'default';
    };
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stop);
    return () => { window.removeEventListener('mousemove', resize); window.removeEventListener('mouseup', stop); };
  }, [resize]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [zeusMessages]);

  const handleSendMessage = async () => {
    const text = zeusInput.trim();
    if (!text || zeusLoading) return;

    setZeusInput('');
    setZeusLoading(true);
    setZeusMessages(prev => [...prev, { role: 'user', content: text }]);

    try {
      const response = await handleZeusCommand(text);
      
      if (response.success) {
        setZeusMessages(prev => [...prev, { role: 'assistant', content: response.output || 'Nessuna risposta' }]);
      } else {
        setZeusMessages(prev => [...prev, { role: 'assistant', content: response.error || 'Errore sconosciuto' }]);
      }
    } catch (err) {
      setZeusMessages(prev => [...prev, { role: 'assistant', content: 'Connessione fallita. Riprovo, CEO.' }]);
    } finally {
      setZeusLoading(false);
    }
  };

  const handleOpen = (item: string) => {
    if (!p1Tabs.includes(item)) setP1Tabs([...p1Tabs, item]);
    setP1Active(item);
  };

  const handleSplit = (item: string) => {
    setIsSplit(true);
    if (!p2Tabs.includes(item)) setP2Tabs([...p2Tabs, item]);
    setP2Active(item);
  };

  const closeTab = (panel: 1 | 2, tab: string) => {
    if (panel === 1) {
      const next = p1Tabs.filter(t => t !== tab);
      setP1Tabs(next);
      if (p1Active === tab) setP1Active(next[0] || '');
    } else {
      const next = p2Tabs.filter(t => t !== tab);
      setP2Tabs(next);
      if (p2Active === tab) setP2Active(next[0] || '');
      if (next.length === 0) setIsSplit(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#121316] text-[#e2e2e6] overflow-hidden flex items-stretch font-sans">

      <aside
        style={{ width: isSidebarCollapsed ? '64px' : `${sidebarWidth}px` }}
        className="flex-shrink-0 bg-zinc-900/40 border-r border-zinc-800 flex flex-col relative transition-[width] duration-200"
      >
        <div className="p-4 mb-6 flex items-center justify-between overflow-hidden">
          {!isSidebarCollapsed && (
            <div className="min-w-max">
              <h1 className="text-amber-500 font-black text-xl tracking-tighter">WORKSPACE</h1>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Manipura OS</p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-amber-500 transition-colors mx-auto"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {[
            { id: 'CRM', icon: Database },
            { id: 'Clienti', icon: Users },
            { id: 'Fatture', icon: Receipt },
            { id: 'Funnel', icon: Filter },
          ].map((item) => (
            <div
              key={item.id}
              className={`group flex items-center justify-between py-2 px-3 rounded cursor-pointer transition-all ${p1Active === item.id ? 'bg-zinc-800/40 text-amber-500 border-l-2 border-amber-500' : 'text-zinc-500 hover:bg-zinc-800/20 hover:text-zinc-200'
                }`}
            >
              <div className="flex items-center gap-3" onClick={() => handleOpen(item.id)}>
                <item.icon size={18} />
                {!isSidebarCollapsed && <span className="text-sm font-medium">{item.id}</span>}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={14} className="hover:text-amber-400" onClick={() => handleOpen(item.id)} />
                  <Columns size={14} className="hover:text-amber-400" onClick={() => handleSplit(item.id)} />
                </div>
              )}
            </div>
          ))}
        </nav>

        <div
          onMouseDown={() => { isResizingS.current = true; document.body.style.cursor = 'col-resize'; }}
          className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-amber-500/50 z-50"
        />
      </aside>

      <main className="flex-1 flex overflow-hidden">

        <section style={{ width: isSplit ? `${splitPos}%` : '100%' }} className="flex flex-col border-r border-zinc-800 relative">
          <div className="flex bg-[#0c0e11] border-b border-zinc-800 h-10 overflow-x-auto no-scrollbar">
            {p1Tabs.map(tab => (
              <div
                key={tab}
                onClick={() => setP1Active(tab)}
                className={`flex items-center gap-2 px-4 h-full border-r border-zinc-800 cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-all ${p1Active === tab ? 'text-amber-500 bg-zinc-800/20 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                <span>{tab}</span>
                <X size={12} className="hover:bg-zinc-800 rounded-full" onClick={(e) => { e.stopPropagation(); closeTab(1, tab); }} />
              </div>
            ))}
          </div>
          <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">{p1Active || 'Vuoto'}</h2>
            <div className="bg-[#1a1c1f] border border-zinc-800 rounded p-6">
              <TrendingUp className="text-amber-500 mb-2" />
              <div className="text-zinc-500 text-[10px] font-bold uppercase">Stato Modulo</div>
              <div className="text-xl font-bold">Operativo</div>
            </div>
          </div>
          {isSplit && (
            <div
              onMouseDown={() => { isResizingSplit.current = true; document.body.style.cursor = 'col-resize'; }}
              className="absolute right-[-1px] top-0 w-1 h-full cursor-col-resize hover:bg-amber-500/50 z-50"
            />
          )}
        </section>

        {isSplit && (
          <section className="flex-1 flex flex-col bg-[#121316]">
            <div className="flex bg-[#0c0e11] border-b border-zinc-800 h-10">
              {p2Tabs.map(tab => (
                <div
                  key={tab}
                  onClick={() => setP2Active(tab)}
                  className={`flex items-center gap-2 px-4 h-full border-r border-zinc-800 cursor-pointer text-[10px] font-bold uppercase tracking-wider ${p2Active === tab ? 'text-amber-500 bg-zinc-800/20 border-b-2 border-amber-500' : 'text-zinc-500'
                    }`}
                >
                  <span>{tab}</span>
                  <X size={12} className="hover:bg-zinc-800 rounded-full" onClick={(e) => { e.stopPropagation(); closeTab(2, tab); }} />
                </div>
              ))}
              <button onClick={() => setIsSplit(false)} className="ml-auto px-3 text-zinc-600 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 p-8 opacity-40 flex flex-col items-center justify-center text-center">
              <Columns size={40} className="mb-2" />
              <h3 className="font-bold italic uppercase text-xs tracking-widest">Secondary View</h3>
            </div>
          </section>
        )}
      </main>

      <aside style={{ width: `${zeusWidth}px` }} className="bg-zinc-900/40 border-l border-zinc-800 flex flex-col relative">
        <div
          onMouseDown={() => { isResizingZ.current = true; document.body.style.cursor = 'col-resize'; }}
          className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-amber-500/50 z-50"
        />
        <div className="pt-12 px-5 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-amber-500 font-bold uppercase tracking-widest text-xs italic">ZeusClaw</h2>
            <p className="text-zinc-500 text-[10px] font-bold">Controllo AI Attivo</p>
          </div>
          {zeusLoading && (
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
          {zeusMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-zinc-800/60 text-zinc-300 ml-4'
                  : 'bg-[#1e2023] border border-zinc-800 text-zinc-200 mr-2'
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800">
          <div className="relative group flex gap-2">
            <input
              type="text"
              value={zeusInput}
              onChange={(e) => setZeusInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Comanda Zeus..."
              disabled={zeusLoading}
              className="flex-1 bg-[#1e2023] border border-zinc-800 rounded py-2.5 px-3 text-xs text-zinc-200 outline-none focus:border-amber-500/50 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={zeusLoading || !zeusInput.trim()}
              className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </aside>

    </div>
  );
}