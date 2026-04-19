# 48 | INFRASTRUTTURA CLOUD E PROVISIONING (V2)
**Versione:** 2.0 (Tabula Rasa)
**Responsabile:** CTO Gemini
**Stato:** In Corso - VITALE

## 1. VISIONE GENERALE
L'infrastruttura di ZEUS OS v2 è progettata per l'isolamento totale dei dati (Zero-Trust) e la scalabilità tramite Mixture of Experts (MOE). Ogni account deve essere configurato ex-novo per evitare il "Context Rot" tecnologico della V1.

---

## 2. CHECKLIST ACCOUNT & SETUP

### 2.1 GitHub (Agentia-Lab)
Il codice deve risiedere in un'organizzazione professionale per gestire i permessi a livello di team e sub-agenti.
- **Repository:** `zeus-os-v2` (Privato)
- **Framework:** Next.js 16 (App Router)
- **CI/CD:** GitHub Actions per deploy automatico su Vercel/Supabase.

### 2.2 Supabase (ZEUS_V2_PROD)
Il cuore della persistenza e dell'autenticazione.
- **Region:** `eu-central-1` (Francoforte) per bassa latenza e conformità GDPR.
- **Auth:** SSR obbligatorio tramite Cookie `HttpOnly`.
- **Database:** PostgreSQL con estensione `pgvector` abilitata (per memoria semantica).

### 2.3 Google Cloud (Project: zeus-os-core-v2)
Necessario per l'integrazione MCP (Model Context Protocol).
- **API Abilitate:** Drive API, Gmail API, Sheets API.
- **Service Account:** Da generare per permettere agli agenti di leggere/scrivere documentazione tecnica in autonomia.

---

## 3. ARCHITETTURA MULTI-TENANT (DATABASE)

Ogni tabella creata deve seguire rigorosamente questo schema logico per impedire il "Data Bleed":

| Tabella | Colonna Critica | Vincolo |
| :--- | :--- | :--- |
| `tenants` | `id (uuid)` | Chiave primaria dell'organizzazione. |
| `profiles` | `tenant_id` | Foreign Key su `tenants.id`. |
| `wallets` | `balance_npu` | Consumo atomico in Dinari Tunisini (TND). |

### Row Level Security (RLS) Blueprint:
```sql
-- Esempio di policy di isolamento obbligatoria
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant Isolation Policy" 
ON public.user_data 
USING (tenant_id = auth.jwt() ->> 'tenant_id');