# SITEMAP ARCHITETTURALE: ZEUS OS - SUPER ADMIN (Torre di Controllo PaaS)

**Stato:** Approvato dal CTO
**Architettura:** Next.js 15 (Amber Glow UI). Rotta protetta `/admin`.
**Obiettivo:** Gestione Multi-Tenant, monitoraggio ZEUS Edge Token Gateway, fatturazione centralizzata e gestione interna Agentia.

---

## 1. GLOBAL DASHBOARD (Vista Panoramica)
* **Metriche di Sistema (Live):** NPU (Neural Processing Units) totali consumati oggi, MRR (Monthly Recurring Revenue) stimato, chiamate API al secondo.
* **Stato Infrastruttura:** Status server Next.js, connessione Supabase (PostgreSQL), latenza Redis (Upstash).
* **Alert & Log Critici:** Errori di routing LLM o tentativi di violazione del Rate Limit.

## 2. TENANT MANAGEMENT (La Fabbrica dei Clienti)
* **Lista Tenants:** Anagrafica di tutte le aziende clienti (Manipura Studio è fisso come Tenant 0 - ID: 1).
* **Dettaglio Tenant:** * Stato abbonamento (Active, Suspended).
    * Limiti mensili impostati (Soft limit / Hard limit NPU).
    * Accesso rapido in modalità "Impersonate" (solo per Super Admin, per debug).
* **Onboarding Nuovo Tenant:** Creazione manuale o visualizzazione iscrizioni self-service.

## 3. ZEUS EDGE TOKEN GATEWAY (Il Motore Commerciale)
* **Monitoraggio API Keys:** Lista di tutte le chiavi generate dai Tenants, con stato (Attiva/Revocata).
* **Log di Traffico (Real-time):** Quali agenti esterni (Claude, Cursor, automazioni) stanno chiamando i nostri endpoint MCP.
* **Routing Dinamico (MoE - Mixture of Experts):** * Statistiche di utilizzo per modello (Gemini 3.1 Pro vs Claude vs modelli smaller/faster).
    * Costo computazionale interno vs Prezzo fatturato in NPU al cliente.
* **Rate Limiting Dashboard:** Identificazione dei Tenants che stanno spammando richieste.

## 4. BILLING & TOKENOMICS (Monetizzazione)
* **Integrazione Stripe:** Status dei pagamenti, webhook falliti, abbonamenti attivi.
* **Consumo NPU per Tenant:** Classifica dei clienti più profittevoli (quelli i cui agenti consumano più token API).
* **Wallet Management:** Ricariche manuali o automatiche di crediti (TND / USD) per i singoli Tenant.
* **Fatturazione (Invoices):** Storico delle fatture generate automaticamente a fine mese in base al pay-per-use.

## 5. AI & AGENT REGISTRY (Protocollo MCP)
* **Gestione Endpoints:** Quali "abilità" (es. *Opportunity Forecaster*, *Burnout Shield*) sono attualmente esposte e vendibili tramite l'OpenAPI.
* **Versionamento API:** Gestione v1, v2 degli endpoint senza rompere le integrazioni dei clienti esistenti.
* **Prompt Registry:** Repository centrale dei system prompt che governano le logiche di business interne prima di passare il task all'LLM.

## 6. SYSTEM & SECURITY
* **Audit Logs:** Registro immutabile di chi ha fatto cosa all'interno della dashboard Super Admin.
* **RLS Monitor:** Verifica che le Row Level Security di Supabase non presentino falle che permettano leakage di dati tra Tenants.

## 7. AGENTIA PLATFORM MANAGEMENT (Gestione Interna)
* **Team Agentia (RBAC):** Gestione degli accessi per i membri del nostro team interno (Super Admin, Developer, Support). Livelli di permesso specifici.
* **Impostazioni Globali (Global Settings):** Toggle per la *Maintenance Mode*, configurazione dei limiti NPU di default per i nuovi iscritti, gestione di variabili d'ambiente critiche a livello di UI.
* **Supporto & Helpdesk:** Gestione centralizzata dei ticket aperti dai Tenant (es. assistenza integrazione API, segnalazione bug, richieste aumento limiti).
* **CMS & Public Docs:** Gestore dei contenuti per aggiornare testi della Landing Page, le News e i Changelog della Documentazione API senza dover richiedere un nuovo deploy ad Antigravity.
* **DevOps Links:** Accessi rapidi diretti alle infrastrutture esterne (Dashboard Vercel, Supabase Studio, Console Stripe) per interventi di emergenza.