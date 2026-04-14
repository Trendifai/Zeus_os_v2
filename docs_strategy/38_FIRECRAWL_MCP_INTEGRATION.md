# INTEGRAZIONE: Firecrawl MCP per Scraper Agent
**ID:** 38_FIRECRAWL_MCP_INTEGRATION  
**Status:** VITALE / CON RISERVA NPU  
**Architetto:** CTO Gemini

## 0. ANALISI E CONTESTO STRATEGICO (Note del CTO)
**Crash-Test:** Dare in pasto HTML grezzo ai nostri LLM consuma un'oscenità di token. Firecrawl estrae Markdown pulito e bypassa gli anti-bot. L'uso è approvato, ma essendo un servizio a pagamento, deve essere agganciato al nostro Token Gateway. Nessun tenant può lanciare uno scraping senza prima aver congelato il budget NPU necessario.

## 1. Architettura
- **Server:** Installazione di `firecrawl-mcp` nel container dell'Agente Scraper (Livello 2).
- **Security:** Le API Key di Firecrawl (`FIRECRAWL_API_KEY`) risiedono solo nel `.env` del server Agentia. Il tenant non le vede mai.

## 2. Tokenomics & Billing
1. Il Tenant richiede: "Scrappa i blog di competitor.com".
2. Il Gateway calcola una pre-autorizzazione di 50 NPU per pagina.
3. Firecrawl esegue il job.
4. Supabase RPC `consume_tokens_atomic` scala il costo reale post-esecuzione.

## 3. Output
Il markdown generato viene passato a Gemini Embedding 2 per l'inserimento nel database vettoriale isolato del tenant.