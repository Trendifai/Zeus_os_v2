'use client'

import { useState } from 'react';
import { SidebarMain } from "@/components/dashboard/SidebarMain";
import ProductsPage from "./products/page";

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
    <div className="flex h-screen bg-black text-zinc-200 overflow-hidden select-none font-sans">
      <SidebarMain onNavigate={openPane} activeTab={activePane} />
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative">
        <div className="h-12 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800/50 flex items-center px-4 gap-1 z-50 shadow-lg">
          {panes.map(pane => (
            <div
              key={pane}
              onClick={() => setActivePane(pane)}
              className={`group flex items-center gap-3 px-5 h-9 rounded-t-xl cursor-pointer transition-all border-t border-x ${
                activePane === pane
                ? 'bg-zinc-950 border-amber-500/40 text-amber-500'
                : 'bg-transparent border-transparent text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{pane}</span>
              {pane !== 'DASHBOARD' && (
                <button
                  onClick={(e) => { e.stopPropagation(); closePane(pane); }}
                  className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity px-1"
                >×</button>
              )}
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-10 custom-scrollbar relative">
          <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
            {activePane === 'DASHBOARD' && (
              <div className="py-20 text-center">
                <h1 className="text-6xl font-black text-amber-500 italic tracking-tighter opacity-20">MANIPURA OS</h1>
                <p className="text-zinc-700 uppercase text-xs tracking-[1em] mt-4 font-bold">Workspace Ready</p>
              </div>
            )}
            {activePane === 'PRODOTTI' && <ProductsPage />}
          </div>
        </div>
      </div>
    </div>
  );
}