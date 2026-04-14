# STRATEGIA: Memoria Agentica Isolata (Mem0 + RLS)
**ID:** 26_MEM0_TENANT_ISOLATION  
**Status:** VITALE  
**Architetto:** CTO Gemini

## 0. ANALISI E CONTESTO STRATEGICO (Note del CTO)
**Input originale:** Email lancio "mem0 CLI" per memoria persistente degli agenti.
**Crash-Test:** In un'architettura PaaS Multi-Tenant come ZEUS OS, affidare la memoria a un tool CLI globale e schema-driven senza controlli centralizzati è un errore critico. I dati dei clienti (Manipura e futuri tenant) devono essere rigorosamente isolati tramite RLS su Supabase (pgvector). Una CLI esterna usata in produzione aggira i nostri guardrail di isolamento, creando il rischio concreto di mischiare i contesti tra clienti diversi.
**Verdetto:** La CLI di Mem0 va usata *esclusivamente* in locale per i tool di sviluppo (Antigravity). In produzione (Zeus OS), si integra via API lato server, filtrando sempre per `tenant_id`.

---

## 1. Il Problema
L'utilizzo standard di Mem0 CLI salva i dati in un database locale o cloud globale. In un ambiente PaaS come ZEUS OS, questo permetterebbe a un'istanza dell'IA di Manipura Studio di accedere accidentalmente ai ricordi o ai dati sensibili di un altro tenant.

## 2. Soluzione A-Z: Il "Memory Silo"
Non useremo la CLI globale in produzione. Implementeremo un wrapper lato server che forza il filtro `tenant_id`.

### A. Architettura Database
La memoria verrà salvata su Supabase sfruttando `pgvector`.
- **Tabella:** `agent_memories`
- **Campi:** `id`, `tenant_id`, `user_id`, `vector_embedding`, `metadata` (JSONB).

### B. Iniezione del Contesto
Ogni chiamata a `mem0.add()` o `mem0.search()` deve includere obbligatoriamente:
`{ user_id: user.id, metadata: { tenant_id: current_tenant_id } }`

### C. RLS Enforcement
Applicheremo una policy SQL che impedisce la ricerca di vettori che non corrispondono al `tenant_id` dell'utente autenticato.

## 3. ROI e Vantaggi
- **Efficienza:** L'agente non chiede due volte la stessa informazione (es. "Qual è il prefisso IVA di Manipura?"). Riduzione chiamate inutili all'LLM.
- **Vendibilità:** Possiamo fatturare l'uso della "Memoria Aziendale" come modulo Premium a consumo (NPU).

---
[GCA HANDOFF - EPIC ARCHITECT MODE]
Invocare [MCP-Supabase] per creare la tabella agent_memories e configurare pgvector. GCA HANDOFF COMPLETED