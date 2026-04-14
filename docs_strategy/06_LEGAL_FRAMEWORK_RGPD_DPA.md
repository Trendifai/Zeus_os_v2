# ⚖️ FRAMEWORK LEGALE ZEUS: RGPD, DPA & CGV

**Progetto:** Zeus OS (by Agentia)
**Uso:** Linee guida per la stesura dei contratti legali (Terms of Service, Privacy Policy, Data Processing Agreement).

## 1. DPA (Data Processing Agreement) - Clausola "Zero-Data Retention"
*Il cliente deve sapere che l'IA non "ruba" i suoi segreti.*
* **Ruoli:** Il Cliente è il *Titolare del Trattamento*. Agentia è il *Responsabile del Trattamento*.
* **LLM Sub-Processors:** Agentia utilizza le API ufficiali di OpenAI/Anthropic tramite gateway (LiteLLM). 
* **Garanzia:** I dati processati dall'IA (fatture, email, anagrafiche) **NON vengono utilizzati per l'addestramento (training)** dei modelli di linguaggio. Vengono trasmessi via API in modalità *stateless*, elaborati e immediatamente distrutti dai server del provider LLM (come da policy API di OpenAI/Anthropic per gli account Enterprise).

## 2. RGPD - Policy Modulo "Scraper Leads"
*Il modulo più a rischio. Dobbiamo giustificare come troviamo le email B2B.*
* **Base Giuridica:** L'estrazione di contatti B2B pubblici avviene sotto la base del **"Legittimo Interesse"** commerciale (Art. 6, par. 1, lett. f del RGPD). Non trattiamo dati B2C (consumatori privati).
* **Tracciamento Tecnico Obbligatorio:** Ogni qualvolta l'Agente Scraper inserisce un Lead nel CRM, il database di Zeus compila automaticamente tre colonne nascoste:
  1. `data_estrazione`: Timestamp esatto.
  2. `fonte_estrazione`: URL pubblico da cui il dato è stato preso (es. sito web o LinkedIn).
  3. `agente_responsabile`: ID dell'Agente Scraper.
* **Informativa (Art. 14):** L'Agente Marketing è programmato per inserire obbligatoriamente nella primissima email di contatto (Cold Email) un link di *Opt-Out* e una riga che spiega: *"Abbiamo trovato il tuo contatto pubblico su [fonte_estrazione]. Se non vuoi ricevere altre comunicazioni, clicca qui."*

## 3. CGV (Condizioni Generali di Vendita) - "IA come Assistente"
*Dobbiamo tutelare Agentia dai danni causati dalle allucinazioni dell'IA.*
* **Limitazione di Responsabilità:** Zeus OS e i suoi Agenti (inclusi PM, Marketing, CRM) forniscono *bozze, suggerimenti e automazioni*. L'output dell'IA non costituisce consulenza legale, finanziaria o medica.
* **Obbligo di Human-in-the-Loop (HITL):** L'utente finale accetta di essere l'unico responsabile per l'approvazione (clic manuale) di azioni "distruttive" o comunicazioni verso l'esterno. Agentia non è responsabile per perdite finanziarie derivanti dall'invio di email non revisionate dall'utente, dall'applicazione di sconti errati o dalla cancellazione di file su Google Workspace, qualora l'azione sia stata approvata dal Titolare tramite l'interfaccia HITL.