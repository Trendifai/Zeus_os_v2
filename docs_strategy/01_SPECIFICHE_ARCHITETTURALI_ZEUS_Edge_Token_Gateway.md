🏛️ SPECIFICHE ARCHITETTURALI ZEUS: "Edge Token Gateway"
Progetto: Zeus OS (by Agentia)
Componenti: Next.js 15 (Edge Middleware) | Supabase (PostgreSQL) | Upstash (Redis Serverless) | LiteLLM (Proxy Gateway)

1. Filosofia del Sistema ("Il Secchiello Temporaneo")
Il principio base è eliminare la latenza e proteggere il database centrale.
Supabase è la Banca (lenta ma assoluta). Upstash Redis è il Portafoglio in tasca (istantaneo ma volatile).

2. Flusso dei Dati (Data Flow)
FASE A: Inizializzazione (La mattina o al Login)
L'utente di Manipura effettua l'accesso.

Il sistema controlla su Upstash Redis se esiste una chiave wallet:cache:{tenant_id}.

Se non esiste, Zeus interroga Supabase (wallet_finanziario), legge il saldo reale (es. 45.00 TND) e lo "carica" su Upstash Redis impostando un Time-To-Live (TTL) di 24 ore.

FASE B: Esecuzione Prompt (Il Millisecondo)
L'utente chiede all'AI di scrivere un'email. La richiesta passa per l'Edge Middleware di Next.js.

Il Middleware fa una chiamata REST ad Upstash (latenza ~5ms): "Questo tenant ha credito?".

Se il saldo Redis è > 0, la chiamata viene passata a LiteLLM.

LiteLLM inoltra la richiesta a OpenAI/Anthropic usando la Master Key di Agentia.

FASE C: Addebito e Arbitraggio (Il Guadagno)
LiteLLM restituisce l'email generata e il calcolo esatto: Input: 50 token, Output: 200 token.

Il Middleware applica la nostra formula di ricarico: (Costo Base API) * (Markup Agentia) = 0.05 TND.

Il Middleware esegue un comando asincrono non bloccante (redis.decrby) su Upstash per sottrarre istantaneamente i 0.05 TND dal "portafoglio veloce". L'utente non percepisce alcuna attesa.

FASE D: Sincronizzazione (La "Chiusura di Cassa")
Non scriviamo su Supabase a ogni prompt. Usiamo una Serverless Cron Job (o un trigger basato su soglie):

Ogni ora (o quando il credito su Redis scende sotto i 5 TND), un background worker preleva il saldo aggiornato da Upstash Redis.

Scrive il dato in batch su Supabase, aggiornando la riga in wallet_finanziario.

Scrive in blocco tutti i log nella tabella registro_token_log per la fatturazione dettagliata del cliente.

3. Sicurezza Anti-Svuotamento
Se il servizio di sync fallisce per qualsiasi motivo, Redis mantiene il conteggio reale grazie alla sua natura in-memory.

Il Gateway LiteLLM è impostato con max_budget per evitare che un bug nel frontend causi richieste infinite che ci svuoterebbero le Master Keys in una notte.

Questa architettura è una fortezza, Architetto. Scalabile, a bassissimo costo di computazione (tutto gira su Edge) e con latenza inesistente per l'utente finale.