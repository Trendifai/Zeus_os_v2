import { Activity, Cpu, HeartPulse, Users, Zap, Brain } from "lucide-react";

export default function ManipuraDashboard() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">
          <span className="text-[#FFBF00]">Manipura</span> Control Center
        </h1>
        <div className="glass rounded-lg px-4 py-2 text-sm text-zinc-400">
          System Status: <span className="text-green-400">Online</span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* NPU Stats */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-zinc-400">
            <Zap className="h-4 w-4 text-[#FFBF00]" />
            <span className="text-sm font-medium">NPU Balance</span>
          </div>
          <p className="text-3xl font-bold text-[#FFBF00]">999,999.9</p>
          <p className="mt-2 text-xs text-zinc-500">Neural Processing Units</p>
        </div>

        {/* Active Agents */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-zinc-400">
            <Brain className="h-4 w-4 text-[#FFBF00]" />
            <span className="text-sm font-medium">Active Agents</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100">4</p>
          <p className="mt-2 text-xs text-zinc-500">HERMES, Julia, Caveman, Arcade</p>
        </div>

        {/* System Health */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-zinc-400">
            <HeartPulse className="h-4 w-4 text-[#FFBF00]" />
            <span className="text-sm font-medium">System Health</span>
          </div>
          <p className="text-3xl font-bold text-green-400">99.9%</p>
          <p className="mt-2 text-xs text-zinc-500">Uptime: 14 days</p>
        </div>

        {/* Requests */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-zinc-400">
            <Activity className="h-4 w-4 text-[#FFBF00]" />
            <span className="text-sm font-medium">Requests (24h)</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100">12,847</p>
          <p className="mt-2 text-xs text-zinc-500">+8.2% vs yesterday</p>
        </div>

        {/* CPU Load */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-zinc-400">
            <Cpu className="h-4 w-4 text-[#FFBF00]" />
            <span className="text-sm font-medium">CPU Load</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100">23%</p>
          <p className="mt-2 text-xs text-zinc-500">Optimal range</p>
        </div>

        {/* Online Users */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-zinc-400">
            <Users className="h-4 w-4 text-[#FFBF00]" />
            <span className="text-sm font-medium">Online Users</span>
          </div>
          <p className="text-3xl font-bold text-zinc-100">7</p>
          <p className="mt-2 text-xs text-zinc-500">Active sessions</p>
        </div>
      </div>
    </main>
  );
}