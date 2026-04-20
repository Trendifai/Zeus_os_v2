import Link from 'next/link';
import OAuthButtons from '@/components/auth/OAuthButtons';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-amber-400">ZEUS OS v2</h1>
          <nav className="flex items-center gap-6">
            <Link href="/auth/login" className="text-zinc-400 hover:text-amber-400 transition-colors">
              Accedi
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-amber-400 text-zinc-950 font-semibold rounded hover:bg-amber-500 transition-colors"
            >
              Inizia
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Multi-Tenant Intelligence Platform
            </div>

            <h2 className="text-6xl md:text-7xl font-bold text-zinc-100 mb-6">
              ZEUS OS <span className="text-amber-400">v2</span>
            </h2>

            <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              L&apos;Orchestratore di Intelligence Multi-Tenant
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-amber-400 text-zinc-950 font-bold text-lg rounded-lg hover:bg-amber-500 transition-colors"
              >
                Accedi alla Console
              </Link>
              <a
                href="#features"
                className="px-8 py-4 border border-zinc-700 text-zinc-300 font-medium rounded-lg hover:border-amber-400/50 hover:text-amber-400 transition-colors"
              >
                Scopri di più
              </a>
            </div>

            <div className="mt-12">
              <OAuthButtons />
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-zinc-100 mb-12 text-center">
              Architettura <span className="text-amber-400">Multi-Tenant</span>
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-amber-400/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-zinc-100 mb-2">Agent Orchestration</h4>
                <p className="text-zinc-400">
                  Orchestra agenti AI multipli con routing intelligente e gestione centralizzata delle risorse.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-amber-400/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-zinc-100 mb-2">Multi-Tenant</h4>
                <p className="text-zinc-400">
                  Isolatione completa dei dati per tenant. Ogni organizzazione opera in ambiente isolato.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-amber-400/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-zinc-100 mb-2">Sicurezza Enterprise</h4>
                <p className="text-zinc-400">
                  Autenticazione Supabase, Row Level Security e audit trail completo delle operazioni.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-6 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              © 2026 ZEUS AGENTIA. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-zinc-500 text-sm">
                Powered by <span className="text-amber-400">Supabase</span>
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}