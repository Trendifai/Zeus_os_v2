'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Hexagon, TrendingUp, Hand, Zap, Brain, ChevronRight, Loader2 } from 'lucide-react';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

const roles = [
  { id: 'ceo', label: 'Visionario', sublabel: 'CEO', icon: Crown, description: 'Strategia, leadership e decisioni ad alto livello' },
  { id: 'cto', label: 'Architetto', sublabel: 'CTO', icon: Hexagon, description: 'Infrastruttura, architettura e innovazione tecnica' },
  { id: 'cmo', label: 'Crescita', sublabel: 'CMO', icon: TrendingUp, description: 'Marketing, acquisition e scaling' },
];

const autonomyLevels = [
  { id: 'copilot', label: 'Copilot', sublabel: 'Passivo', icon: Hand, description: 'Aspetta le tue istruzioni, esegue con precisione' },
  { id: 'partner', label: 'Partner', sublabel: 'Proattivo', icon: Zap, description: 'Suggerisce azioni, lavora al tuo fianco' },
  { id: 'manager', label: 'Manager', sublabel: 'Autonomo', icon: Brain, description: 'Prende iniziative, gestisce in autonomia' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedAutonomy, setSelectedAutonomy] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleComplete = async () => {
    if (!selectedRole || !selectedAutonomy) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.id) {
        console.error("Nessun utente trovato");
        setError("Sessione scaduta o utente non trovato");
        setLoading(false);
        return;
      }

      const autonomyInt = parseInt(String(selectedAutonomy), 10) || 1;
      const contextData = context ? { source: context } : null;

      const { error: upsertError } = await supabase.from('jarvis_configs').upsert({
        user_id: user.id,
        role: selectedRole,
        autonomy_level: autonomyInt,
        tone: 'Visionario',
        context_data: contextData,
      }, { onConflict: 'user_id' });

      if (upsertError) {
        console.error("Supabase Error Raw:", upsertError);
        const errorMessage = upsertError?.message 
          ? String(upsertError.message) 
          : 'Errore sconosciuto';
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const { data: verifyConfig } = await supabase
        .from('jarvis_configs')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!verifyConfig) {
        setError('Errore nel salvataggio. Riprova.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Errore inatteso. Riprova.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-wide mb-2">
            <span className="text-amber-400">Configura</span> il tuo Jarvis
          </h1>
          <p className="text-zinc-500">Step {step} di 3</p>
          
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-500 ${
                  s <= step ? 'w-8 bg-amber-400' : 'w-8 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="transition-all duration-500">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-medium text-zinc-300 mb-6">Scegli il tuo ruolo</h2>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => { setSelectedRole(role.id); setStep(2); }}
                    className="group flex items-center gap-4 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-amber-400/50 hover:bg-zinc-900 transition-all duration-300 text-left"
                  >
                    <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-amber-400/10 transition-colors">
                      <role.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{role.label}</span>
                        <span className="text-xs text-zinc-500">({role.sublabel})</span>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">{role.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-medium text-zinc-300 mb-6">Livello di autonomia</h2>
              <div className="grid gap-4">
                {autonomyLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => { setSelectedAutonomy(level.id); setStep(3); }}
                    className="group flex items-center gap-4 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-amber-400/50 hover:bg-zinc-900 transition-all duration-300 text-left"
                  >
                    <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-amber-400/10 transition-colors">
                      <level.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{level.label}</span>
                        <span className="text-xs text-zinc-500">({level.sublabel})</span>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">{level.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-medium text-zinc-300">Contesto</h2>
              <p className="text-zinc-500">Incolla il tuo LinkedIn o descrivi i tuoi obiettivi</p>
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Descrivi chi sei, quali sono i tuoi obiettivi, il tuo background..."
                className="w-full h-48 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none resize-none transition-colors"
              />

              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-amber-400 text-zinc-950 font-medium rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Completa configurazione
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}