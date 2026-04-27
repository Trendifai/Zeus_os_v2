'use client'

import { useState } from 'react';
import { SidebarMain } from "@/components/dashboard/SidebarMain";
import ProductsPage from "./products/page";
import SettingsPage from "./settings/page";

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
    <div className="flex h-screen bg-black text-zinc-200 overflow-hidden font-sans">
      <SidebarMain onNavigate={openPane} activeTab={activePane} />

      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        <div className="h-12 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800 flex items-center px-4 gap-1 z-40">
          {panes.map(pane => (
            <div
              key={pane}
              onClick={() => setActivePane(pane)}
              className={`flex items-center gap-3 px-4 h-8 rounded-t-lg cursor-pointer transition-all border-t border-x text-[9px] font-black uppercase tracking-widest ${
                activePane === pane ? 'bg-zinc-950 border-amber-500/40 text-amber-500' : 'bg-transparent border-transparent text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {pane}
              {pane !== 'DASHBOARD' && <span onClick={(e) => { e.stopPropagation(); closePane(pane); }} className="hover:text-white px-1">×</span>}
            </div>
          ))}
        </div>

        <div className="flex-1 flex overflow-x-auto overflow-y-hidden bg-zinc-950 custom-scrollbar">
          {panes.map(pane => (
            <div
              key={pane}
              className={`flex-shrink-0 w-[800px] border-r border-zinc-800/50 overflow-y-auto p-10 transition-all ${
                activePane === pane ? 'bg-zinc-950 opacity-100' : 'bg-zinc-900/20 opacity-40 grayscale-[0.5]'
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.5em]">{pane}</span>
                <button onClick={() => closePane(pane)} className="text-zinc-700 hover:text-red-500 uppercase text-[9px] font-black tracking-widest">Close Section</button>
              </div>
              {pane === 'DASHBOARD' && (
                <div className="py-20 text-center">
                  <h1 className="text-7xl font-black text-amber-500 italic opacity-10">MANIPURA</h1>
                  <p className="text-zinc-700 uppercase text-xs tracking-[1em] mt-4 font-bold">Workspace Ready</p>
                </div>
              )}
              {pane === 'PRODOTTI' && <ProductsPage />}
              {pane === 'ENGINE' && <SettingsPage />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}