"use client";

import { useState } from "react";
import { Check, Zap, Code, Rocket } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="mb-4 text-4xl font-bold text-amber-500 md:text-6xl">
          The Operational Brain for Your AI
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          Orchestrate autonomous agents, manage NPU resources, and deploy enterprise AI workflows from a single dashboard.
        </p>
      </section>

      {/* Code Editor Mockup */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
          <div className="mb-4 flex items-center gap-2 border-b border-zinc-800 pb-4">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-4 text-sm text-zinc-500">api.zeus-os.com/v1/execute</span>
          </div>
          <pre className="font-mono text-sm">
            <span className="text-purple-400">POST</span> <span className="text-green-400">/v1/execute</span> {"{\n"}
            {"  "}<span className="text-blue-400">"agent"</span>: <span className="text-amber-500">"hermes"</span>,{"\n"}
            {"  "}<span className="text-blue-400">"task"</span>: <span className="text-green-400">"analyze_deployment"</span>,{"\n"}
            {"  "}<span className="text-blue-400">"context"</span>: <span className="text-green-400">"production_log"</span>,{"\n"}
            {"  "}<span className="text-blue-400">"npu_budget"</span>: <span className="text-amber-500">100</span>{"\n"}
            {"}"}
          </pre>
          <div className="mt-4 rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-400">
            ✓ 200 OK - Execution completed in 2.3s
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-zinc-100">
          <span className="text-amber-500">NPU</span> Pricing Plans
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Free */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-zinc-100">Starter</h3>
            <p className="mt-2 text-3xl font-bold text-amber-500">$0<span className="text-sm text-zinc-500">/mo</span></p>
            <p className="mt-2 text-sm text-zinc-500">1,000 NPU included</p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> 1 workspace</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> 3 agents</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> Community support</li>
            </ul>
            <button className="mt-6 w-full rounded-lg bg-zinc-800 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
              Get Started
            </button>
          </div>

          {/* Pro */}
          <div className="glass-card rounded-xl border-amber-500/50 p-6">
            <div className="mb-2 text-sm text-amber-500">MOST POPULAR</div>
            <h3 className="text-xl font-bold text-zinc-100">Professional</h3>
            <p className="mt-2 text-3xl font-bold text-amber-500">$49<span className="text-sm text-zinc-500">/mo</span></p>
            <p className="mt-2 text-sm text-zinc-500">50,000 NPU included</p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> Unlimited workspaces</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> 20 agents</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> Priority support</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> NPU rollover</li>
            </ul>
            <button className="mt-6 w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-black hover:bg-amber-400">
              Start Free Trial
            </button>
          </div>

          {/* Enterprise */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-zinc-100">Enterprise</h3>
            <p className="mt-2 text-3xl font-bold text-amber-500">Custom</p>
            <p className="mt-2 text-sm text-zinc-500">Unlimited NPU</p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> Everything in Pro</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> Dedicated infrastructure</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> SLA guarantee</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-500" /> Custom integrations</li>
            </ul>
            <button className="mt-6 w-full rounded-lg border border-amber-500 py-2 text-sm text-amber-500 hover:bg-amber-500/10">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}