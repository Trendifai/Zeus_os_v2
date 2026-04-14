# ZEUS OS - Architettura Cognitiva e Memory Layer
**Data:** 19/03/2026
**Autore:** Zeus_Agentia (Senior Software Architect)
**Stato:** Approvato per FASE 5.1.5

## 1. Obiettivo Strategico
Evolvere l'Orchestrator di ZEUS OS (Claude 3.5) da un sistema "statico" con limiti di contesto a un agente proattivo e persistente (24/7). L'obiettivo è superare il limite del context window e del context rot, implementando un approccio **Agentic File Search / Agentic Memory** combinato con **Mem0** per le query semantiche.

## 2. Architettura di Memoria Ibrida
Il sistema utilizzerà un approccio a due livelli per massimizzare efficienza e accuratezza:

* **Livello 1: Memoria Semantica (Mem0)**
    * **Scopo:** Storage a lungo termine per informazioni "destrutturate" (chi è l'utente, preferenze di stile UI come "Amber Glow", domain expertise, contatti).
    * **Funzionamento:** Utilizza vector search per recuperare concetti ampi e preferenze globali ad ogni avvio di sessione.
* **Livello 2: Agentic File System (Sandbox in Locale/Volume)**
    * **Scopo:** Gestione operativa dei task, tracking dei progressi dei workflow complessi (Gravity Kit) e log giornalieri.
    * **Funzionamento:** Un file system gerarchico accessibile direttamente da Claude 3.5 tramite chiamate a funzioni (Tool Calling). 

## 3. Struttura della Directory (Sandbox)
L'agente avrà accesso esclusivo in lettura/scrittura a un volume isolato, strutturato come segue:

/zeus_memory_sandbox/
├── /preferences/
│   └── user_profile.md      # Stile, lingua di default (FR), info utente
├── /logs/
│   ├── 2026-03-18.md        # Log della sessione (Append-only)
│   └── 2026-03-19.md        # Log odierno
├── /projects/
│   └── /gravity_workflows/
│       ├── PRD.md           # Product Requirements Document
│       └── progress.md      # Tracking dei task (Cosa è fatto, cosa manca)
└── memory.md                # Fatti duraturi e core knowledge base


## 4. Interfaccia Tool Calling (Strumenti per l'Agente)
Per permettere a Claude 3.5 di navigare questo file system autonomamente, implementeremo i seguenti tools nel backend (Gravity Kit):

1.  `scan_directory(path)`: Per esplorare le cartelle e capire cosa è salvato in memoria.
2.  `read_memory_file(filename, lines/chars)`: Per leggere file specifici (es. `progress.md`) o fare preview di file lunghi senza intasare il contesto.
3.  `write_to_memory(filename, content, mode="append")`: Per registrare nuovi log, aggiornare i progressi di un workflow o salvare un nuovo fatto duraturo.
4.  `search_memory(query)`: Endpoint collegato a Mem0 per la ricerca vettoriale rapida.

## 5. Meccanismo di "Pre-Compaction Flush"
Per prevenire la perdita di dati dovuta all'esaurimento dei token di contesto:
* Verrà impostato un **soft threshold** sui token in input.
* Quando la sessione si avvicina a questo limite, il sistema invierà un system prompt invisibile all'Orchestrator: *"Session nearing compaction. Store durable memories now in today's log or memory.md"*.

## 6. Impatto sulle Fasi Successive
* **FASE 5.2 (UI/UX):** Le preferenze salvate nel file `user_profile.md` (es. lingua IT/FR/EN, tema Amber Glow) verranno lette dalla memoria per personalizzare la UI al login.
* **FASE 6 (Commerce/Wallet):** Lo stato delle transazioni in sospeso o dei pagamenti rateali (Stripe/LemonSqueezy) e i log dei crediti (TND) potranno essere tracciati in file dedicati all'interno della sandbox per garantire coerenza anche in caso di riavvio del sistema.