import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ConnectorsHub from '@/components/dashboard/ConnectorsHub';
import MemoryVault from '@/components/dashboard/MemoryVault';
import ActiveKnowledgeMap from '@/components/dashboard/ActiveKnowledgeMap';
import { Crown, Zap, Brain, MessageSquare, User, Lightbulb } from 'lucide-react';

function NPUMonitor() {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-zinc-300">NPU Monitor</span>
        <span className="text-xs text-zinc-500">Neural Processing</span>
      </div>
      <div className="flex items-end gap-1 h-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-amber-400/20 rounded-t"
            style={{ height: `${Math.max(4, Math.random() * 40)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-zinc-500">0%</span>
        <span className="text-amber-400 font-medium">32%</span>
        <span className="text-zinc-500">100%</span>
      </div>
    </div>
  );
}

function SystemHealth() {
  const services = [
    { name: 'Supabase', status: 'online', latency: '12ms' },
    { name: 'OpenRouter', status: 'online', latency: '45ms' },
    { name: 'GitHub', status: 'online', latency: '23ms' },
  ];

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-zinc-300">System Health</span>
        <span className="text-xs text-amber-400">● All Systems Online</span>
      </div>
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between py-1 border-b border-zinc-800/30 last:border-0"
          >
            <span className="text-sm text-zinc-400">{service.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-400">●</span>
              <span className="text-xs text-zinc-500">{service.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const roleLabels: Record<string, string> = {
  ceo: 'Visionario (CEO)',
  cto: 'Architetto (CTO)',
  cmo: 'Crescita (CMO)',
};

const autonomyLabels: Record<string, string> = {
  copilot: 'Copilot - Passivo',
  partner: 'Partner - Proattivo',
  manager: 'Manager - Autonomo',
};

const roleIcons: Record<string, typeof Crown> = {
  ceo: Crown,
  cto: Zap,
  cmo: Brain,
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: jarvisConfig } = await supabase
    .from('jarvis_configs')
    .select('role, autonomy_level, tone, context_data')
    .eq('user_id', user.id)
    .single();

  if (!jarvisConfig) {
    redirect('/onboarding');
  }

  const RoleIcon = roleIcons[jarvisConfig.role] || User;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Desktop Canvas</h1>
        <p className="text-zinc-500 text-sm">Tenant 0 - Manipura</p>
      </div>

      <div className="bg-zinc-900/50 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-400/10 rounded-lg">
            <Brain className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-medium text-zinc-100">Jarvis Core Identity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <RoleIcon className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Ruolo</span>
            </div>
            <p className="text-zinc-100 font-medium">{roleLabels[jarvisConfig.role] || jarvisConfig.role}</p>
          </div>

          <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Autonomia</span>
            </div>
            <p className="text-zinc-100 font-medium">{autonomyLabels[jarvisConfig.autonomy_level] || jarvisConfig.autonomy_level}</p>
          </div>

          <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Tono</span>
            </div>
            <p className="text-zinc-100 font-medium">{jarvisConfig.tone}</p>
          </div>

          <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Contesto</span>
            </div>
            <p className="text-zinc-100 font-medium text-sm line-clamp-2">
              {typeof jarvisConfig.context_data === 'object' && jarvisConfig.context_data !== null 
                ? jarvisConfig.context_data.source || JSON.stringify(jarvisConfig.context_data) 
                : jarvisConfig.context_data || 'Nessun contesto'}
            </p>
          </div>
        </div>
      </div>

      <MemoryVault />

      <ActiveKnowledgeMap />

      <div className="bg-zinc-900/50 border border-amber-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-400/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-medium text-zinc-100">Jarvis Insights</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
          <Lightbulb className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">Le pillole strategiche basate sulla tua memoria appariranno qui</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NPUMonitor />
        <SystemHealth />
      </div>

      <ConnectorsHub />
    </div>
  );
}