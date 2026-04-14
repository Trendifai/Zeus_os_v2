# PRD (Product Requirements Document)
**Progetto:** Zeus AI Plugin Engine (AI-as-a-Service App Store)
**Documento:** Strategia Core & Architettura Base
**Status:** Ideazione Avanzata / Visione Strategica

---

## 1. L'Idea (Executive Summary)
Zeus OS smette di essere un semplice ERP statico (Software-as-a-Service) e diventa un **PaaS (Platform-as-a-Service) Dinamico e Autonomo**. 
L'obiettivo è permettere a ogni singolo cliente (Tenant) di richiedere, tramite un'interfaccia chat integrata (ZeusFlow), la creazione di moduli gestionali personalizzati per le proprie esigenze specifiche (es. *automazione social, calcolatori provvigioni complessi, esportatori doganali*).

Invece di richiedere mesi di sviluppo umano, la richiesta viene elaborata da un'infrastruttura di Agenti AI Autonomi (es. Nvidia NemoClaw) che scrivono il codice logico, mentre un nostro protocollo interno (Zeus MCP) disegna l'interfaccia rispettando il design system nativo dell'ERP (Amber Glow). Il risultato viene iniettato nel database e appare nel menu del cliente come un "Micro-Frontend" isolato e pronto all'uso.

## 2. Modello di Business (Monetizzazione)
Questa infrastruttura sblocca un nuovo canale di revenue altamente scalabile:
* **Micro-Sviluppo (Setup Fee):** Pagamento una tantum (es. $20 - $50) per la generazione e l'installazione del modulo custom.
* **Markup Computazionale (Token Fee):** Applicazione di un ricarico sui token consumati dall'agente o dall'uso continuo dell'app (es. $0.010 per token).
* **Vendor Lock-in Positivo:** Il cliente ottiene un ERP cucito millimetricamente sulla sua azienda, abbassando drasticamente il tasso di abbandono (Churn Rate).

## 3. Architettura Tecnica & Stack
Il sistema si basa su 4 pilastri architetturali per garantire sicurezza, estetica e scalabilità:

1. **Il Cervello (Cloud LLM & Sandbox):** Utilizzo di modelli Enterprise-grade (es. Nvidia Nemotron via build.nvidia.com) all'interno di una sandbox sicura (NemoClaw/Docker in cloud). L'AI ragiona, scrive codice backend (Python/Node) e lo testa in isolamento totale per evitare vulnerabilità.
2. **Il Direttore d'Orchestra (Zeus MCP - Model Context Protocol):**
   Un server MCP proprietario che fornisce all'AI le "regole del gioco". Istruisce l'AI a usare rigorosamente i componenti React del progetto, le classi Tailwind `zinc-950` e `amber-500`, e le librerie interne, evitando codice "spaghettato" fuori standard.
3. **Il Database (Supabase JSONB & RLS):**
   Il codice generato (UI e Logica) viene salvato come stringa/JSON all'interno della tabella `tenant_settings` (o una nuova tabella `tenant_plugins`). La RLS (Row Level Security) garantisce che quel modulo sia visibile *esclusivamente* a quel cliente.
4. **Il Motore di Rendering (Next.js Dynamic Imports):**
   Il frontend scarica il componente dal database e lo renderizza in tempo reale nella dashboard o nella Unified Sidebar del cliente.

## 4. User Flow (L'Esperienza del Cliente)
1. **Richiesta:** Il cliente apre ZeusFlow e scrive: *"Crea un'app per leggere le email di info@azienda.com e generare ticket di assistenza"*.
2. **Generazione (Background):** Zeus OS invia il prompt all'architettura AI. L'agente scrive la logica di connessione IMAP e la UI per la tabella ticket.
3. **Review & Approvazione (Human-in-the-Loop per la Fase 1):** Il codice generato passa su un pannello SuperAdmin di Agentia. Il CTO/CEO controlla il codice, fa un click su "Approva". *(Nella Fase 2, questo step diventerà automatico).*
4. **Deploy Dinamico:** Il cliente riceve una notifica: *"La tua app è pronta"*. Un nuovo link appare nella sua barra laterale sinistra. Cliccandolo, accede al suo modulo personalizzato.

## 5. Sicurezza e "Guardrails"
* **Isolamento dell'Agente (Sandbox):** L'AI generativa non ha mai accesso diretto in scrittura al codice sorgente principale (il repository GitHub di Zeus OS). Scrive solo in contenitori virtuali.
* **Tenant Data Isolation:** I plugin girano nel contesto dell'utente loggato. Non possono eseguire query al di fuori del proprio `tenant_id`.

## 6. Roadmap di Sviluppo
* **Fase 1 (Sperimentale):** Utilizzare GitHub Codespaces + NemoClaw come laboratorio per far scrivere script complessi all'AI, per poi integrarli manualmente tramite comandi (Antigravity).
* **Fase 2 (Strutturale):** Creazione della tabella Supabase `tenant_plugins` e implementazione del parser React capace di renderizzare componenti UI salvati nel database.
* **Fase 3 (Autonomia):** Connessione diretta tra ZeusFlow (Front-end cliente) e l'infrastruttura di generazione AI.