'use client';

import React, { useState, useCallback } from 'react';
import { Send, Loader2, Zap, Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SkillHubPage() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const analyzeWithHermes = useCallback(async () => {
        const textValue = input.trim();
        if (!textValue || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log("📡 Invio richiesta a ZeusClaw su Colab...");
            const response = await fetch("https://sushi-ravishing-karate.ngrok-free.dev/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                },
                body: JSON.stringify({
                    model: "minimax/minimax-m2.5:free",
                    messages: [
                        { role: "system", content: "Sei ZeusClaw, l'intelligenza di Manipura ERP. Analizza il lead e rispondi in modo strutturato." },
                        { role: "user", content: textValue }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Errore Server:", errorData);
                throw new Error(`Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Risposta ricevuta:", data);

            if (data.choices && data.choices[0]) {
                setResult(data.choices[0].message.content);
            }
        } catch (err) {
            console.error("🚨 Errore durante l'analisi:", err);
            setError(err instanceof Error ? err.message : "Errore Sconosciuto");
            alert("Errore di connessione a ZeusClaw. Controlla la console.");
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            analyzeWithHermes();
        }
    };

    const copyResult = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full w-full flex flex-col bg-zinc-950">

            {/* Top Bar */}
            <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-800/60">
                <Link
                    href="/dashboard"
                    className="p-1.5 rounded-sm hover:bg-zinc-800/40 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <ArrowLeft size={16} />
                </Link>
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-sm flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
                        <Zap size={14} className="text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold uppercase tracking-tight text-zinc-100">
                            Skill Hub
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Hermes Engine · Tenant 0
                        </p>
                    </div>
                </div>
            </header>

            {/* Two-Column Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">

                {/* LEFT — Input */}
                <section className="flex flex-col p-6 border-r border-zinc-800/40 overflow-y-auto">
                    <label
                        htmlFor="hermes-input"
                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3"
                    >
                        Dati Grezzi
                    </label>

                    <textarea
                        id="hermes-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Incolla dati cliente qui..."
                        rows={14}
                        disabled={isLoading}
                        className="flex-1 min-h-[200px] w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-3 px-4 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none resize-none transition-colors focus:border-amber-500/40 disabled:opacity-50 font-mono leading-relaxed"
                    />

                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={analyzeWithHermes}
                            disabled={isLoading || !input.trim()}
                            className="flex items-center gap-2.5 px-5 py-2.5 bg-amber-500 text-black font-bold text-xs uppercase tracking-widest rounded-sm transition-all hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Send size={14} />
                            )}
                            <span>Analizza con Hermes</span>
                        </button>

                        <span className="text-[10px] text-zinc-600 font-mono">
                            Ctrl+Enter
                        </span>

                        {isLoading && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/60 animate-pulse">
                                Elaborazione...
                            </span>
                        )}
                    </div>
                </section>

                {/* RIGHT — Result */}
                <section className="flex flex-col p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Risultato
                        </span>
                        {result && (
                            <button
                                onClick={copyResult}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-amber-500 hover:bg-zinc-800/40 transition-colors"
                            >
                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                {copied ? 'Copiato' : 'Copia'}
                            </button>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-sm px-4 py-3 mb-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">
                                Errore
                            </p>
                            <p className="text-sm text-red-300/80 font-mono">{error}</p>
                        </div>
                    )}

                    {/* Result Card */}
                    {result && (
                        <div
                            className="relative flex-1 rounded-sm overflow-hidden"
                            style={{
                                background:
                                    'linear-gradient(160deg, rgba(255,191,0,0.04) 0%, rgba(9,9,11,0.97) 40%)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            {/* Top accent */}
                            <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                            <div className="absolute inset-0 border border-amber-500/10 rounded-sm pointer-events-none" />

                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                        Risposta ZeusClaw
                                    </span>
                                </div>

                                <div className="bg-zinc-950/70 border border-zinc-800/50 rounded-sm p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                                    {result}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {!result && !error && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center opacity-15">
                                <Zap size={40} className="mx-auto mb-3" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">
                                    In attesa di analisi
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
