import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-amber-400 mb-4">⚠</h1>
          <h2 className="text-3xl font-bold text-amber-400 mb-2">
            Accesso Negato
          </h2>
          <p className="text-zinc-500 text-lg">
            Il tuo account non è ancora associato a un Tenant
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <p className="text-zinc-400 text-sm">
            Per accedere al dashboard Devi prima essere associato a un organizzazione.
            Contatta l&apos;amministratore del sistema per richiedere l&apos;accesso.
          </p>

          <Link
            href="/auth/login"
            className="inline-block w-full bg-amber-400 text-zinc-950 font-semibold py-3 rounded hover:bg-amber-500 transition-colors"
          >
            Torna al Login
          </Link>
        </div>
      </div>
    </div>
  );
}