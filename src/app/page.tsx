import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500/30">

      {/* GLOW OVERLAYS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 backdrop-blur-xl bg-zinc-950/50">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          ZEUS <span className="text-white/50 font-light italic">OS</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-white/60">
          <Link href="#infrastructure" className="hover:text-amber-500 transition-colors">Platform</Link>
          <Link href="#pricing" className="hover:text-amber-500 transition-colors">NPU Pricing</Link>
          <Link href="#docs" className="hover:text-amber-500 transition-colors">API Docs</Link>
        </div>
        <Link href="/auth" className="px-5 py-2 rounded-full bg-white text-zinc-950 text-sm font-bold hover:bg-amber-500 transition-all shadow-lg">
          Sign In
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase tracking-widest font-bold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          V2 Operational Layer
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 max-w-5xl leading-[0.9]">
          The Operational <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Brain</span> for <br />
          <span className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]">Your AI Agents</span>
        </h1>

        <p className="text-lg md:text-xl text-white/40 max-w-2xl mb-12 font-medium">
          Connect autonomous agents to our headless ERP, CRM, and Strategy APIs. Native MCP support for real-world execution.
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <Link href="/auth" className="px-10 py-4 rounded-full bg-amber-500 text-zinc-950 font-black text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(245,158,11,0.4)]">
            GET API KEY
          </Link>
          <button className="px-10 py-4 rounded-full bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all backdrop-blur-md">
            VIEW DOCS
          </button>
        </div>
      </main>

      {/* CODE MOCKUP */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-40">
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.03]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
            </div>
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">zeus_mcp_bridge.py</div>
          </div>
          <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
            <div className="text-amber-500/40 mb-2 italic"># Initializing Multi-Tenant Agent Session</div>
            <div><span className="text-amber-500">from</span> zeus <span className="text-amber-500">import</span> AgentiaOS</div>
            <br />
            <div>zeus = AgentiaOS(api_key=<span className="text-green-400">"z_live_8829..."</span>)</div>
            <div>res = zeus.execute(<span className="text-green-400">"check_stock"</span>, tenant=<span className="text-green-400">"manipura_0"</span>)</div>
            <br />
            <div className="text-white/20">
              {`>> { "status": "authorized", "npu_cost": 0.002, "data": { "stock": 1240 } }`}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION (Dossier 16) */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">NPU Credit Units</h2>
          <p className="text-white/40">Pay only for the computational and strategic logic your agents use.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Sandbox", price: "0", units: "1,000", desc: "For testing & dev." },
            { name: "Pro", price: "49", units: "50,000", desc: "For scaling agencies.", featured: true },
            { name: "Enterprise", price: "Custom", units: "Unlimited", desc: "Dedicated NPU clusters." }
          ].map((tier, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${tier.featured ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_50px_rgba(245,158,11,0.1)]' : 'border-white/10 bg-white/[0.02]'}`}>
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="text-4xl font-black mb-4">
                <span className="text-lg font-light text-white/40">$</span>{tier.price}
                <span className="text-sm font-light text-white/40">/mo</span>
              </div>
              <p className="text-sm text-white/50 mb-8">{tier.desc}</p>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">NPU Units</span>
                  <span className="text-amber-500 font-bold tracking-widest">{tier.units}</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Multi-Tenancy</span>
                  <span>Active</span>
                </div>
              </div>
              <button className={`w-full py-3 rounded-xl font-bold transition-all ${tier.featured ? 'bg-amber-500 text-zinc-950' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-20 px-8 text-center">
        <div className="text-sm text-white/20 font-mono tracking-widest uppercase">
          ZEUS OS © 2026 // AGENTIA INFRASTRUCTURE UNIT
        </div>
      </footer>

    </div>
  );
}