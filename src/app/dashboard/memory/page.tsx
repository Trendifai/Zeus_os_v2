'use client';

import { Brain, Database, FolderOpen, Search, Clock, TrendingUp, Sparkles, HardDrive } from 'lucide-react';
import { useState } from 'react';

function MemoryStatCard({ icon: Icon, label, value, subtext, color }: { icon: typeof Brain, label: string, value: string, subtext: string, color: string }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{subtext}</p>
    </div>
  );
}

function MemoryLayer({ icon: Icon, title, description, items, color, iconColor }: { icon: typeof Database, title: string, description: string, items: string[], color: string, iconColor: string }) {
  return (
    <div className={`bg-zinc-900/30 border rounded-lg p-4 ${color}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-zinc-100">{title}</h3>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      <div className="space-y-2 mt-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-950/30 p-2 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search memories..."
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400/50"
      />
    </div>
  );
}

function ActivityTimeline() {
  const activities = [
    { time: '2h ago', action: 'Session saved', detail: 'Gravity workflow progress.md' },
    { time: '4h ago', action: 'Preference updated', detail: 'UI theme set to Amber Glow' },
    { time: 'Yesterday', action: 'Memory indexed', detail: '12 new semantic memories' },
  ];
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-zinc-300">Recent Activity</span>
      </div>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xs text-zinc-500 mt-1">{activity.time}</span>
            <div>
              <p className="text-sm text-zinc-300">{activity.action}</p>
              <p className="text-xs text-zinc-500">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MemoryVaultPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Memory Vault</h1>
          <p className="text-zinc-500 text-sm">Two-tier cognitive architecture</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-lg">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-400">Mem0 Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MemoryStatCard icon={Brain} label="Semantic Memories" value="247" subtext="Stored in Mem0" color="text-amber-400" />
        <MemoryStatCard icon={FolderOpen} label="File System" value="18" subtext="Project memories" color="text-blue-400" />
        <MemoryStatCard icon={TrendingUp} label="Context Usage" value="32%" subtext="Of 200K token limit" color="text-green-400" />
        <MemoryStatCard icon={HardDrive} label="Storage" value="2.4MB" subtext="Local sandbox" color="text-purple-400" />
      </div>

      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MemoryLayer
          icon={Brain}
          title="Layer 1: Semantic Memory (Mem0)"
          description="Long-term unstructured storage with vector search"
          items={['User preferences (UI theme, language)', 'Domain expertise', 'Contact profiles', 'Session context']}
          color="border-zinc-800"
          iconColor="bg-amber-400/10"
        />
        <MemoryLayer
          icon={Database}
          title="Layer 2: Agentic File System"
          description="Operational task tracking & logs"
          items={['/preferences/user_profile.md', '/logs/2026-04-20.md', '/projects/gravity_workflows/', 'memory.md']}
          color="border-zinc-800"
          iconColor="bg-blue-400/10"
        />
      </div>

      <ActivityTimeline />
    </div>
  );
}