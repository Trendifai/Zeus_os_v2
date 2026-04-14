# STRATEGIA 29: Acquisizione Dati Cross-Platform (Headless)
**Stato**: VITALE | **Target**: Core PaaS (Tutti i Tenant)
**ROI**: Azzeramento costi API Social e bypass autorizzazioni developer (X, TikTok, LinkedIn).

## 1. Visione Tecnica
Integrare `opencli-rs` come layer di scraping universale per ZEUS OS. Invece di richiedere chiavi API ufficiali ad ogni cliente, ZEUS utilizza la sessione browser attiva dell'utente per estrarre dati in tempo reale.

## 2. Architettura Multi-Tenant
- **Session Injection**: Il modulo `NeMoClaw` riceve i cookie di sessione criptati dal frontend del Tenant.
- **Agentic Scraping**: L'agente "Scraper" esegue comandi CLI (`opencli-rs twitter search`) agendo come l'utente stesso.
- **Scalabilità**: Ogni Tenant può monitorare i propri competitor o trend di settore senza configurazioni tecniche.

## 3. Applicazione Business
- **CRM Intelligence**: Auto-popolamento delle schede contatti con dati estratti da LinkedIn/X.
- **Market Sentiment**: Analisi dei trend su Reddit/TikTok per la pianificazione stock.