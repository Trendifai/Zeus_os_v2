'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed: controlledCollapsed, onToggle }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const pathname = usePathname();
  
  const isCollapsed = controlledCollapsed ?? internalCollapsed;
  const handleToggle = onToggle ?? (() => setInternalCollapsed(!internalCollapsed));

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-amber-400">ZEUS</h1>
        )}
        <button
          onClick={handleToggle}
          className="p-2 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-900/50 transition-colors"
          title={isCollapsed ? 'Espandi' : 'Riduci'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isCollapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7M19 19l-7-7 7-7'}
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                  : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-900/50'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}