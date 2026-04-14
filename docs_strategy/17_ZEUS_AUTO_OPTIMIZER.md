# ZEUS AUTO-OPTIMIZER (Z-AUTO)
**Status:** DRAFT / IN MEMORIA
**Architetto:** CTO Gemini
**Data:** 22/03/2026

## 1. OBIETTIVO (ROI & BUSINESS LOGIC)
"Agentia non vende AI, vende il futuro."
Z-AUTO è un modulo in background progettato per ottimizzare in autonomia gli asset dei clienti (Tenant) su ZEUS OS. Ispirato al loop di "autoresearch", applica micro-iterazioni (A/B testing automatico) su Prompt di estrazione dati, RAG parameters o Copy di Funnel. 
L'obiettivo è aumentare i tassi di conversione e l'accuratezza dei dati senza intervento umano.

## 2. COME FUNZIONA (WORKFLOW)
1. **Isolamento:** L'agente AI riceve in input la configurazione attuale (es. il prompt usato da Manipura Studio per estrarre dati da PDF).
2. **Iterazione (5-min Time Budget):** L'agente (modello Claude/DeepSeek via MOE) modifica la configurazione.
3. **Validazione:** Il nuovo asset viene testato su un set di dati di validazione del tenant.
4. **Scoring:** Se la metrica (es. accuratezza estrazione o stimatore di conversione) migliora, la nuova configurazione viene salvata.
5. **Reportistica:** Al risveglio, il cliente trova una dashboard con l'asset ottimizzato pronto al deploy in produzione.

## 3. ATTIVAZIONE
- **UI:** Interruttore toggle "Nightly Optimization" nel pannello di controllo del Tenant (Design: **Amber Glow**, Glassmorphism, Zinc-950).
- **Innesco:** Alla pressione, un Server Component attiva un job Serverless/Background tramite Next.js 15 API routes.
- **Tokenomics:** Ogni ciclo consuma NPU in tempo reale dal wallet TND del tenant.

## 4. STACK TECNOLOGICO
- **Core:** Next.js 15, TypeScript.
- **Esecuzione Background:** Route API isolate (Vercel Background Functions o equivalente).
- **Cluster AI (MOE):** - Generazione varianti: DeepSeek / Claude.
  - Valutazione logica: Gemini.
- **Sicurezza:** Sandbox di esecuzione su `/tmp/tenant_[ID]/auto-eval/`. Regola Zero-Invention attiva: i file core di sistema non possono essere toccati dall'agente.

## 5. DATABASE (MCP-SUPABASE)
Richiede l'estensione dello schema Supabase esistente:

**Tabella: `tenant_optimization_logs`**
- `id`: UUID (Primary Key)
- `tenant_id`: UUID (Foreign Key)
- `asset_type`: String (es. "FUNNEL_COPY", "PDF_EXTRACTION")
- `baseline_score`: Float
- `new_score`: Float
- `config_diff`: JSONB
- `npu_cost`: Integer
- `created_at`: Timestamp

**RLS (Row Level Security):**
Obbligatorio `auth.uid() == tenant_id`. Nessun task autonomo può leggere o scrivere log di un altro tenant.