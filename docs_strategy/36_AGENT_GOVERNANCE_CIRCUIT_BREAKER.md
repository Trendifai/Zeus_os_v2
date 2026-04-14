# GOVERNANCE: Circuit Breaker NPU (Paperclip Guard)
**ID:** 30_AGENT_GOVERNANCE_CIRCUIT_BREAKER  
**Status:** SICUREZZA FINANZIARIA  
**Architetto:** CTO Gemini

## 0. ANALISI E CONTESTO STRATEGICO (Note del CTO)
**Input originale:** Video su framework "Paperclip" (agenti IA che strutturano e assumono altri agenti IA in un organigramma).
**Crash-Test:** Il concept convalida il nostro documento `22_PAPERCLIP_VISUAL_GOVERNANCE.md`. Tuttavia, il rischio finanziario è catastrofico. Un "CEO IA" che spawna sub-agenti in modo ricorsivo a causa di un task mal formulato drena il wallet TND del cliente (e le nostre API keys) in pochi minuti. 
**Verdetto:** Da implementare, ma con un hard-limit sistemico. Serve un "Circuit Breaker" per interrompere istantaneamente l'esecuzione.

---

## 1. Il Rischio "Denial of Wallet"
Un'architettura ad agenti autonomi senza limiti di spesa è una bomba a orologeria. Un loop infinito o una "falsa incomprensione" tra due sub-agenti brucia NPU in modo esponenziale.

## 2. Implementazione A-Z

### A. Token Quota per Task
Ogni richiesta inviata al Token Gateway deve avere un parametro `max_npu_budget` hardcodato.
- **Default:** 5.000 NPU per task genitore. Esaurito questo budget, il gateway stacca la connessione con errore `402 Payment Required / Budget Exceeded`.

### B. Recursion Limit (Limite di Delega)
Limite fisico di 3 livelli gerarchici per gli agenti.
- Se l'agente "Orchestratore" delega al "Manager" che delega al "Worker", il "Worker" **non** può spawnare ulteriori agenti o chiamare funzioni ricorsive.

### C. Kill Switch (Lato Client & Server)
- **UI (Amber Glow):** Pulsante fisico rosso/ambra "HALT" nel terminale ZeusClaw.
- **Backend:** Implementazione dell' `AbortController` (già abbozzato nel log del 29/03) per chiudere istantaneamente le connessioni HTTP aperte verso i provider LLM, bloccando la fatturazione al millisecondo.

## 3. Gestione Errori
Se il Circuit Breaker scatta, il cliente riceve una notifica: *"Operazione interrotta per superamento budget di sicurezza NPU. Riformulare la richiesta in modo più specifico."*

---
[GCA HANDOFF - EPIC ARCHITECT MODE]
Invocare [MCP-Supabase] per aggiungere colonna budget_limit a tabelle task e aggiornare il Gateway. GCA HANDOFF COMPLETED