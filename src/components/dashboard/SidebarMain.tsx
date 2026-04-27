'use client'

import { LayoutDashboard, Box, Settings, Bot, Factory, Users, ShoppingCart } from 'lucide-react';

export function SidebarMain({ onNavigate, activeTab }: { onNavigate: (n: string) => void, activeTab: string }) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'DASHBOARD' },
    { name: 'Prodotti', icon: Box, id: 'PRODOTTI' },
    { name: 'Produzione', icon: Factory, id: 'PRODUZIONE' },
    { name: 'Clienti (CRM)', icon: Users, id: 'CRM' },
    { name: 'Ordini', icon: ShoppingCart, id: 'ORDINI' },
    { name: 'Engine Room', icon: Settings, id: 'ENGINE' },
    { name: 'ZeusClow (AI)', icon: Bot, id: 'ZEUSCLOW' },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-amber-500/10 flex flex-col h-screen fixed left-0 top-0 z-[100] shadow-2xl">
      <div className="p-6 border-b border-amber-500/5">
        <h1 className="text-amber-500 font-black text-xl italic tracking-tighter">MANIPURA</h1>
        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">ZEUS OS v3.2</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <item.icon size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-900 text-center">
        <div className="text-[8px] text-amber-500/30 font-mono uppercase">CEO MASTER SESSION</div>
      </div>
    </div>
  );
}