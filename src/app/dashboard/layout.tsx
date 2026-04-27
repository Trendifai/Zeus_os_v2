'use client'

import { useState } from 'react';
import { SidebarMain } from "@/components/dashboard/SidebarMain";
import ProductsPage from "./products/page";
import SettingsPage from "./settings/page";

const ModulePlaceholder = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-zinc-800 border-2 border-dashed border-zinc-900 rounded-3xl p-20">
    <div className="w-16 h-16 border-4 border-zinc-900 border-t-amber-500 rounded-full animate-spin mb-6" />
    <h2 className="text-xl font-black uppercase tracking-widest">Modulo {name}</h2>
    <p className="text-xs mt-2 text-zinc-700 tracking-[0.3em]">INTEGRAZIONE IN CORSO NEL WIKI_DEV</p>
  </div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [panes, setPanes] = useState(['DASHBOARD']);
  const [activePane, setActivePane] = useState('DASHBOARD');

  const openPane = (name: string) => {
    if (!panes.includes(name)) setPanes([...panes, name]);
    setActivePane(name);
  };

  const closePane = (name: string) => {
    const newPanes = panes.filter(p => p !== name);
    setPanes(newPanes);
    if (activePane === name) setActivePane(newPanes[newPanes.length - 1] || 'DASHBOARD');
  };

  return (
    <div className="flex h-screen bg-black text-zinc-200 overflow-hidden font-sans select-none">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f59e0b; }
      `}</style>

      <SidebarMain onNavigate={openPane} activeTab={activePane} />

      <div className="flex-1 flex flex-col ml-64 bg-zinc-950">
        <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-1 z-50">
          {panes.map(p => (
            <div
              key={p}
              onClick={() => setActivePane(p)}
              className={`flex items-center gap-3 px-4 h-7 rounded-t-md cursor-pointer text-[9px] font-black uppercase tracking-tighter transition-all border-x border-t ${
                activePane === p ? 'bg-zinc-950 border-amber-500/40 text-amber-500' : 'bg-transparent border-transparent text-zinc-600'
              }`}
            >
              {p}
              {p !== 'DASHBOARD' && <span onClick={(e) => { e.stopPropagation(); closePane(p); }} className="hover:text-red-500 ml-2">×</span>}
            </div>
          ))}
        </div>

        <div className="flex-1 flex overflow-x-auto bg-zinc-950 custom-scrollbar">
          {panes.map(pane => (
            <div
              key={pane}
              className={`flex-shrink-0 w-[700px] md:w-[900px] border-r border-zinc-900 overflow-y-auto p-10 transition-all ${
                activePane === pane ? 'bg-zinc-950 opacity-100' : 'bg-black/50 opacity-30 grayscale'
              }`}
            >
              <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-2">
                <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.5em]">{pane}</span>
                <button onClick={() => closePane(pane)} className="text-[8px] font-bold text-zinc-700 hover:text-red-500 uppercase">Close Section</button>
              </div>
              {pane === 'DASHBOARD' && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <h1 className="text-8xl font-black text-amber-500 italic">ZEUS</h1>
                  <p className="tracking-[2em] text-xs font-bold mt-4">MANIPURA STUDIO</p>
                </div>
              )}
              {pane === 'PRODOTTI' && <ProductsPage />}
              {pane === 'ENGINE' && <SettingsPage />}
              {['PRODUZIONE', 'CRM', 'ORDINI', 'ZEUSCLOW'].includes(pane) && <ModulePlaceholder name={pane} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}