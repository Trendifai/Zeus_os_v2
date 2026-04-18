import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      <div className="container flex flex-col items-center gap-12 px-4">
        <h1 className="text-6xl font-bold tracking-tight text-[#FFBF00] amber-glow-text">
          ZEUS OS <span className="text-zinc-500">v2</span>
        </h1>
        
        <p className="max-w-md text-center text-lg text-zinc-400">
          Neural Processing Operating System
          <br />
          <span className="text-sm text-zinc-600">Tabula Rasa Architecture</span>
        </p>

        <Link
          href="/manipura"
          className="glass-card inline-flex h-12 items-center justify-center rounded-lg px-8 text-sm font-medium text-[#FFBF00] transition-all amber-focus hover:amber-glow"
        >
          Access System
        </Link>
      </div>
    </main>
  );
}