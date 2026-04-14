# PROTOCOLLO: Skill Reverse Engineering & Memory (Hermes Model)
**Progetto:** Zeus OS (by Agentia)
**Data:** 29/03/2026
**Architetto:** CTO Gemini

## 1. Il Problema (Context Rot & Spreco NPU)
Attualmente, se il CEO chiede all'IA di generare un post LinkedIn con uno stile specifico, l'IA consuma migliaia di token per assimilare le regole di sistema ogni singola volta. È inefficiente.

## 2. Soluzione "Save to Memory as Skill"
Prendendo spunto dal modello *Hermes Agent*, Zeus OS implementerà una pipeline di estrazione e consolidamento delle competenze.
- **Il Workflow:** Quando un output (es. una campagna marketing o una query complessa sul DB) viene valutato come perfetto dall'utente, l'Orchestratore esegue un *Reverse Engineering* dei propri passaggi logici.
- **Storage:** Il processo viene salvato in `tenant_plugins` come una "Skill" cristallizzata (un prompt ottimizzato e hardcodato in JSONB/YAML).

## 3. Vantaggio Tecnico
La volta successiva, l'utente invocherà semplicemente `/skill_marketing_linkedin`. Il sistema non farà reasoning da zero (risparmio massivo di token/NPU), ma eseguirà il binario pre-compilato con garanzia di zero allucinazioni.