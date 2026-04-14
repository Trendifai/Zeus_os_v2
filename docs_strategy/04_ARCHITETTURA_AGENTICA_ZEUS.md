# 🐝 SPECIFICHE ARCHITETTURALI ZEUS: "Swarm & MCP Integration"

**Progetto:** Zeus OS (by Agentia)
**Focus:** Topologia Multi-Agente, Model Context Protocol (MCP) e Sicurezza (HITL)

## 1. La Topologia "Orchestrator-Worker" (L'Alveare)
Zeus non utilizza un singolo LLM onnisciente. Utilizza un'architettura gerarchica a sciame (Swarm) basata sul pattern *Agents as Tools*.

* **Livello 1: L'Orchestratore (Il Router Centrale)**
    * **Ruolo:** È l'unico agente che parla direttamente con l'utente.
    * **Modello:** Ottimizzato per velocità e basso costo (es. Llama-3 70B o GPT-4o-mini via LiteLLM).
    * **Funzionamento:** Non esegue MAI compiti operativi. Legge il prompt dell'utente, classifica l'intento (Intent Recognition) e invoca l'Agente Specialista appropriato trattandolo come fosse una "Funzione" (Tool Calling).
* **Livello 2: Gli Specialisti (I 15 Moduli Zeus)**
    * **Ruolo:** Esperti di dominio isolati (Agente CRM, Agente Scraper, Agente HR, ecc.).
    * **Modello:** Assegnato dinamicamente (MOE). GPT-4o per compiti complessi, modelli minori per compiti base.
    * **Funzionamento:** Ricevono l'input dall'Orchestratore, eseguono il task senza sapere cosa fanno gli altri agenti, e restituiscono il risultato.
* **Livello 3: Il Livello MCP (Gli Strumenti)**
    * Gli agenti non hanno codice hardcodato per accedere a Google o ai Database. Utilizzano il **Model Context Protocol (MCP)** introdotto da Anthropic.
    * Zeus funge da *MCP Host*. Quando l'Agente PM deve leggere un file, chiama l' *MCP Server di Google Drive*, un microservizio separato che traduce la richiesta in API Google in totale sicurezza.

## 2. Il Flusso dei Dati (Agent-to-Agent Communication)
L'output di uno specialista diventa l'input di un altro senza intervento umano.
*Esempio:*
1. L'utente scrive: *"Trovami lead nel settore medico a Milano e prepara un'email per loro."*
2. L'Orchestratore chiama l'**Agente Scraper**.
3. Lo Scraper usa il tool di ricerca web, formatta i dati in JSON e li passa all'Orchestratore.
4. L'Orchestratore passa il JSON all'**Agente CRM** per salvarli nel database.
5. L'Orchestratore passa i dati salvati all'**Agente Marketing** per scrivere le bozze.

## 3. Human-In-The-Loop (HITL) & Sicurezza
Per evitare che l'IA spenda soldi o compia disastri, dividiamo le azioni degli agenti (i *Tools*) in due categorie:

* **Azione Safe (Esecuzione Libera):** Lettura dati, estrazione JSON, scrittura bozze, web scraping. L'agente procede in autonomia.
* **Azione Distruttiva (Dynamic Interrupt):** Inviare email reali, eseguire pagamenti, cancellare database. 
    * **Logica HITL:** Quando un agente tenta di usare il tool `send_email`, il sistema va in "Interrupt". L'agente non fallisce, ma entra in stato di sospensione (`paused`).
    * Viene generata una notifica nella Dashboard del cliente: *"L'Agente Marketing vuole inviare 50 email. [Approva] o [Modifica]"*.
    * Se il cliente approva, l'agente riprende l'esecuzione dal punto esatto in cui si era fermato.