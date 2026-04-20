'use client';

import { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import ZeusClow from './ZeusClow';

export default function Desktop({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatWidth, setChatWidth] = useState(400);
  
  const effectiveSidebarWidth = sidebarCollapsed ? 64 : 256;

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div 
        className="flex-1 flex"
        style={{ 
          marginLeft: `${effectiveSidebarWidth}px`, 
          marginRight: `${chatWidth}px` 
        }}
      >
        <main className="flex-1 h-screen overflow-y-auto relative">
          {children}
        </main>
      </div>

      <ZeusClow width={chatWidth} />
    </div>
  );
}