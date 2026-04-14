# ARCHITETTURA: Hermes Trajectory Caching (Self-Improving ROI)
**ID:** 39_HERMES_TRAJECTORY_CACHING  
**Status:** VISIONE LUNGO TERMINE / VITALE  
**Architetto:** CTO Gemini

## 0. ANALISI E CONTESTO STRATEGICO (Note del CTO)
**Crash-Test:** Eseguire task complessi più e più volte tramite LLM è uno spreco di margini operativi. Dobbiamo implementare il concetto di "Skill Compilation" visto in Hermes Agent. Se l'IA impara a fare una cosa complessa, la registra in uno script riutilizzabile. Il costo di esecuzione per noi crolla a zero, ma il prezzo fatturato al tenant in NPU rimane costante.

## 1. Logica di Esecuzione (Il Loop di Profitto)
1. **First Run (Costosa):** L'Orchestratore usa l'LLM (es. Claude 3.5) per risolvere un task complesso multi-step (es. Analisi bilancio + Export PDF).
2. **Trajectory Capture:** Il backend registra la sequenza esatta di chiamate API e logica usata.
3. **Skill Compilation (Background):** Un worker notturno analizza la traiettoria e genera un file TypeScript/Python ottimizzato e deterministico per quel preciso workflow.
4. **Second Run (Puro Profitto):** La prossima volta che l'utente richiede lo stesso task, il Router bypassa l'LLM costoso ed esegue lo script compilato. Il tenant paga lo stesso, Agentia spende zero.

## 2. Integrazione
Questa logica andrà a fondersi con il modulo `17_ZEUS_AUTO_OPTIMIZER.md`, posizionando ZEUS OS come un sistema che non solo esegue, ma abbassa attivamente i costi operativi interni di Agentia col passare del tempo.