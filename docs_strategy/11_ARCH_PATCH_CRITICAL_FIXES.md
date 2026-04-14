# 🩹 SPECIFICHE ARCHITETTURALI ZEUS: "Patch di Sicurezza e Stabilità (V1.1)"

**Progetto:** Zeus OS (by Agentia)
**Focus:** Risoluzione Colli di Bottiglia, Compliance RGPD, Sicurezza Vault e Prevenzione Frodi Token.

## PATCH 1: "Edge Memory" (Prevenzione Collasso Supabase)
* **Faglia:** Salvare ogni singolo messaggio degli agenti (la memoria conversazionale) direttamente su Supabase saturerebbe le connessioni al database, causando rallentamenti e costi eccessivi.
* **Soluzione:** Estensione dell'uso di **Upstash Redis**.
    * I "Thread" (la memoria a breve termine delle conversazioni tra utente e Agenti o tra Agente e Agente) vivono *esclusivamente* in Redis sotto la chiave `thread:state:{session_id}`.
    * **Sync ritardato:** Solo quando la conversazione viene chiusa (o dopo 6 ore di inattività), un Background Worker (o una Server Action di Next.js) preleva l'intero thread da Redis, lo comprime e lo salva in un'unica riga di Supabase (tabella `agent_memory_logs`). 

## PATCH 2: "Global Suppression List" (Compliance RGPD - Anti-Multa)
* **Faglia:** L'Agente Scraper o l'Agente Marketing potrebbero ricontattare un utente che in precedenza ha richiesto la cancellazione (Opt-Out), violando il Diritto all'Oblio (Art. 17 RGPD).
* **Soluzione:** Implementazione di una Blacklist Crittografica.
    * Nel database Supabase viene creata la tabella `global_suppression_list`.
    * **Privacy by Design:** Non salviamo mai l'email in chiaro. Quando un utente clicca "Unsubscribe", il sistema calcola l'hash crittografico (SHA-256) dell'email (es. `a1b2c3d4...`) e salva solo l'hash.
    * **Guardrail:** Prima che lo Scraper inserisca un nuovo Lead nel CRM o che il Marketing invii un'email, il sistema calcola l'hash dell'indirizzo trovato e lo confronta con la tabella. Se c'è un match, l'inserimento/invio viene bloccato istantaneamente a livello di infrastruttura.

## PATCH 3: "Zero-Knowledge Vault" (Sicurezza Chiavi Google Workspace)
* **Faglia:** Salvare i `refresh_token` OAuth di Google Drive/Gmail in formato testo o in tabelle standard espone i dati dei clienti a potenziali data breach in caso di bug nelle policy RLS o attacchi SQL Injection.
* **Soluzione:** Adozione di **Supabase Vault (pgsodium)**.
    * Supabase Vault è un'estensione nativa crittografica. I token OAuth dei clienti (necessari per i server MCP) vengono archiviati come "Secrets" cifrati a riposo (AES-GCM).
    * Né tu (Super Admin) né alcun bug del frontend potete leggere questi token in chiaro. Vengono decifrati *solo* internamente dal server Node.js nel momento esatto in cui l'Agente PM deve eseguire una chiamata alle API di Google, per poi essere distrutti dalla memoria RAM.

## PATCH 4: "Token Lock & Rate Limiting" (Prevenzione Svuotamento Finanziario)
* **Faglia (Race Condition):** Esecuzioni parallele di più agenti per lo stesso cliente potrebbero bypassare il controllo del saldo Redis, portando il Wallet Finanziario in negativo prima dell'aggiornamento, facendoci pagare il costo delle API di tasca nostra.
* **Soluzione:** Implementazione di semafori (Locks) e Code.
    * **Redis Mutex Lock:** Quando un Agente chiede a Redis il permesso di spendere token, Redis blocca temporaneamente l'accesso alla chiave del wallet (Lock) per pochi millisecondi, scala il credito e sblocca. Questo previene la "doppia spesa".
    * **LiteLLM Rate Limiting:** Nella configurazione di LiteLLM ( `config.yaml` ), impostiamo la variabile `max_parallel_requests` in base al tier del cliente. Se un cliente ha meno di 2.00 TND nel wallet, LiteLLM forza le richieste in coda (sequenziali), rifiutando il multi-threading fino alla successiva ricarica.