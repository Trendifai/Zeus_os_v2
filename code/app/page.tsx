import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-amber-500 md:text-6xl">
          The Operational Brain <br /> for Your AI Agents
        </h1>
        <p className="mb-8 max-w-xl text-lg text-zinc-400">
          Orchestrate autonomous agents, manage NPU resources, and deploy enterprise AI workflows from a single dashboard.
        </p>
        <Link
          href="/onboarding"
          className="rounded-lg bg-amber-500 px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(255,191,0,0.3)]"
        >
          Get Your API Key
        </Link>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-sm text-zinc-500">api.zeus-os.com</span>
          </div>
          <pre className="p-4 text-sm font-mono text-zinc-300">
<span className="text-purple-400">$</span> curl -X POST https://api.zeus-os.com/v1/execute
  -H "Authorization: Bearer YOUR_API_KEY"
  -d {"{"agent": "hermes", "task": "deploy"}  }
          </pre>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-2xl font-bold text-zinc-100">
          <span className="text-amber-500">NPU</span> Pricing
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-zinc-100">Starter</h3>
            <p className="mt-2 text-3xl font-bold text-amber-500">$0<span className="text-sm text-zinc-500">/mo</span></p>
            <p className="mt-1 text-sm text-zinc-500">1,000 NPU included</p>
          </div>
          <div className="rounded-xl border border-amber-500/50 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-zinc-100">Professional</h3>
            <p className="mt-2 text-3xl font-bold text-amber-500">$49<span className="text-sm text-zinc-500">/mo</span></p>
            <p className="mt-1 text-sm text-zinc-500">50,000 NPU included</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-zinc-100">Enterprise</h3>
            <p className="mt-2 text-3xl font-bold text-amber-500">Custom</p>
            <p className="mt-1 text-sm text-zinc-500">Unlimited NPU</p>
          </div>
        </div>
      </section>
    </main>
  );
}