# 🛡️ ARCHITETTURA DI SICUREZZA "ZERO TRUST"

**Progetto:** Zeus OS (by Agentia)
**Uso:** Documento tecnico da fornire ai reparti IT dei clienti Enterprise per superare gli audit di sicurezza.

## 1. Isolamento dei Dati (Siloing) tramite RLS
In un ambiente PaaS multi-tenant, il rischio più grande è la fuga di dati tra clienti.
Zeus risolve il problema alla radice utilizzando la **Row Level Security (RLS)** di PostgreSQL su Supabase.
* Ogni query effettuata da un utente umano o da un Agente AI passa attraverso un filtro crittografico. 
* Il database controlla il JWT (JSON Web Token) della sessione. Se l'utente appartiene a `tenant_id = Manipura`, il database *maschera fisicamente* le righe di tutti gli altri tenant. È impossibile per un'IA eludere questo blocco tramite "Prompt Injection", perché il blocco è a livello di database, non di codice applicativo.

## 2. Gestione Segreti e API Keys
* **Nessuna chiave esposta:** Le API Keys master (OpenAI, Anthropic, Google Cloud) non sono mai scritte nel codice sorgente e non vengono mai inviate al browser del cliente.
* **Proxy Vault:** Risiedono esplicitamente come Variabili d'Ambiente criptate nei server Edge (Vercel/Cloudflare) e vengono invocate esclusivamente tramite il gateway server-to-server (LiteLLM).
* **Virtual Keys:** Ogni modulo (es. Agente HR) utilizza una chiave virtuale generata internamente, soggetta a limiti di spesa giornalieri (Rate Limiting & Cost Caps) per prevenire attacchi di tipo *Denial of Wallet* (svuotamento del credito).

## 3. Sicurezza Connettore Esterno (Protocollo MCP)
L'integrazione con Google Workspace del cliente avviene seguendo il **Principle of Least Privilege (PoLP)**.
* **Permessi Granulari:** Il server MCP di Zeus richiede solo i permessi (OAuth Scopes) strettamente necessari all'operatività del singolo modulo.
* **Isolamento del Contesto:** L'Agente Scraper non ha alcun accesso fisico al tool di Google Drive. L'Agente PM ha accesso a Google Drive ma non può usare i tool di fatturazione. Se un agente dovesse subire un hijacking, il danno ("Blast Radius") sarebbe limitato esclusivamente al suo recinto operativo.