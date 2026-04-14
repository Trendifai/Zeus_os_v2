SPECIFICHE ARCHITETTURALI ZEUS: "MOE Routing & Arbitraggio"
Progetto: Zeus OS (by Agentia)
Focus: Ottimizzazione Costi, High Availability (HA) e Fallback tramite LiteLLM
File di riferimento futuro: litellm_config.yaml

1. Il Concetto di "Marginalità Dinamica"
Il cliente paga ad Agentia un prezzo fisso per "Token Zeus" (es. 0.01 TND per 1000 token).
Il nostro obiettivo è rispondere alla sua richiesta con il modello più economico possibile che sia in grado di svolgere perfettamente quel compito specifico. La differenza tra il costo del modello e il prezzo del "Token Zeus" è il nostro utile netto.

2. Regole di Routing (I Tre Livelli di Esperti)
LiteLLM ci permette di classificare le chiamate API in "Tiers" (Livelli) semplicemente leggendo il prompt di sistema o il modulo di provenienza.

🟢 Tier 1: I "Manovali" (Costo Quasi Zero)
Casi d'uso: Modulo Scraper, classificazione dati, estrazione JSON, traduzioni semplici, riassunti di email.

Modelli assegnati: Llama-3 (8B/70B) via Groq, GPT-4o-mini, Claude 3 Haiku.

Costo medio: ~$0.05 / 1M Token.

Margine Agentia: ~98%

🟡 Tier 2: I "Professionisti" (Costo Medio)
Casi d'uso: CRM Avanzato, risposte dell'Agente Vocale (dove serve intelligenza emotiva ma massima velocità), generazione di testi marketing.

Modelli assegnati: GPT-4o, Claude 3.5 Sonnet.

Costo medio: ~$3.00 / 1M Token.

Margine Agentia: ~60-70%

🔴 Tier 3: Gli "Architetti" (Costo Alto - Uso Limitato)
Casi d'uso: AI Project Manager (analisi di documenti complessi, generazione di codice, ragionamento a step multipli).

Modelli assegnati: GPT-4o, Claude 3.5 Sonnet (con temperature specifiche), o futuri modelli "reasoning" (es. o1-preview).

Costo medio: ~$5.00 - $15.00 / 1M Token.

Margine Agentia: ~30-40% (Ma alto valore percepito dal cliente).

3. High Availability (HA) & Fallback Automatico
Non possiamo permetterci che un cliente veda "Errore OpenAI" se i server di Sam Altman vanno giù.
In LiteLLM imposteremo una regola di Fallback:

Zeus chiama gpt-4o.

Se OpenAI restituisce errore 500 o va in timeout (> 5 secondi).

LiteLLM instrada immediatamente e silenziosamente la richiesta a claude-3.5-sonnet.

Il cliente riceve la risposta senza mai accorgersi del disservizio.

4. Virtual Keys & Sicurezza
Il backend di Zeus (Next.js) non conoscerà mai le chiavi reali di OpenAI o Anthropic.
LiteLLM genererà una Virtual Key univoca per il modulo di Zeus. Se un domani sospettiamo una falla di sicurezza, revochiamo la Virtual Key in LiteLLM, senza dover toccare gli account fatturati di OpenAI.