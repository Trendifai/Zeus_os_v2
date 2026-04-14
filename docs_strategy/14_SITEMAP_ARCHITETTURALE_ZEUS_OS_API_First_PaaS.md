# SITEMAP ARCHITETTURALE: ZEUS OS (API-First PaaS)

**Stato:** Approvato dal CTO
**Architettura:** Frontend Next.js 15 (Amber Glow UI) disaccoppiato. 
**Regola "Dogfooding":** Il frontend (Tenant 0 - Manipura) è una scatola vuota che deve obbligatoriamente chiamare e consumare token (NPU) dalle nostre API backend tramite lo ZEUS Edge Token Gateway.

---

## 1. HUB CENTRALE (La Dashboard)
* **Tutti i widget integrati:** Panoramica globale e metriche chiave.
* **Agente Vocale:** Interfaccia visiva per chiamata API di interazione vocale.
* **Barra di ricerca MoE LLM Interna:** Smistamento dinamico (Mixture of Experts) delle query interne aziendali.
* **Bottoni Azioni Rapide:** Trigger immediati (Crea ordine, crea progetto, ecc.).

## 2. ERP COMMERCIALE (Il Cuore Operativo)
* **Contatti:** Clienti B2C, B2B, fornitori, servizi (dati rigidamente separati per `tenant_id`).
* **Prodotti & Servizi:** Gestione anagrafiche, listini di vendita e fornitori.
* **Documentazione:** Preventivi (devis), ordini, DDT (bon de livraison), fatture, note di credito.
* **Produzione & Inventario:** Stock, magazzini, cicli di produzione.
    * *API Integrata:* **Sincronizzazione Predittiva dell'Inventario** (anticipazione necessità e riordini automatici).
    * *API Integrata:* **Ottimizzazione dei Procédés à Froid** (calcoli strutturali chimica verde).
* **Finanziario per CEO:** Cassa, banche, proiezioni flussi di cassa.
    * *API Integrata:* **Opportunity Forecaster** (analisi segnali di mercato e raccomandazioni di pivot strategici).

## 3. CRM & MARKETING AUTONOMO (Il Motore di Crescita)
* **Lead Scraper & Mailing:** Ricerca contatti automatizzata e invio massivo.
* **Funnel Vendite Agentici:** Avatare virtuali per la qualificazione dei lead B2B e negoziazione autonoma.
* **Ricerca Mercato & Social Media.**
    * *API Integrata:* **Dynamic Persona & Brand Voice** (registro dell'ADN aziendale interrogabile dagli agenti IA di creazione contenuti).
    * *API Integrata:* **A/B Tester Perpétuel** (test invisibili e continui sui tassi di conversione).

## 4. E-COMMERCE & PROGETTI
* **E-commerce AI Builder:** Agente costruttore che preleva dati dall'ERP (prodotti/stock) per generare/aggiornare la vetrina.
* **Project Manager AI:** Assegnazione e monitoraggio task per il team.

## 5. HR & TEAM (Performance Cognitiva)
* *API Integrata:* **Burnout Shield** (Analisi del ritmo operativo sul gestionale, rilevamento esaurimento e iniezione forzata di "Focus Rituals" o pause a calendario).

## 6. ZEUS ADMIN & CONTROLLO (Il Backend del PaaS)
* **Controllo Agenti:** Log in tempo reale delle operazioni degli "Impiegati Invisibili".
* **Parametri User Zeus:** Impostazioni di sistema e configurazione tenant.
* **Edge Token Gateway Dashboard:** Il cruscotto commerciale. Monitoraggio API keys attive, conteggio NPU consumati e metriche di fatturazione (Stripe/Crediti).