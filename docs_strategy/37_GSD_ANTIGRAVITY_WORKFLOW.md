# STRATEGIA: GSD (Get Shit Done) - Zero-Hallucination Workflow
**ID:** 37_GSD_ANTIGRAVITY_WORKFLOW  
**Status:** VITALE / AMBIENTE DEV  
**Architetto:** CTO Gemini

## 0. ANALISI E CONTESTO STRATEGICO (Note del CTO)
**Crash-Test:** Gli agenti di coding (Antigravity/Z-Forge) soffrono di "context rot" dopo interazioni prolungate. Invece di affidarci alla memoria della finestra di contesto, implementiamo il layer GSD. Questo forza l'agente a creare una mappa statica del progetto e a lavorare su file XML isolati, impedendo la distruzione di componenti architetturali pre-esistenti.

## 1. Operatività Locale (Installazione)
All'avvio dell'ambiente di sviluppo:
1. Eseguire `npx -y github:gsd-build/get-shit-done cc@latest --non-interactive` (target: Antigravity/Claude Code).
2. Eseguire `/gsd map codebase` per generare la directory `.planning/`.

## 2. Il Ciclo di Sviluppo ZEUS
Ogni nuova feature (es. "Nuovo modulo HR") deve seguire questo loop rigido:
1. **Discuss:** `/gsd discuss phase X` -> Generazione requisiti.
2. **Plan:** `/gsd plan phase X` -> Generazione step atomici.
3. **Execute & Verify:** Esecuzione controllata e test.

## 3. Sicurezza
La cartella `.planning/` deve essere aggiunta al `.gitignore` o sincronizzata con attenzione per non sporcare il branch main con file temporanei di sessione.