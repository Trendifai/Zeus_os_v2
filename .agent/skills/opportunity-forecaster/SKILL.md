---
name: Opportunity Forecaster
description: Analizza i dati del gestionale e i segnali di mercato per suggerire pivot strategici e nuove gamme di prodotti, fatturando il responso in NPU.
---

# Opportunity Forecaster

## 1. Breve Introduzione
L'Opportunity Forecaster è il primo endpoint "Intelligente" di ZEUS OS. Non si limita a leggere i dati, ma usa il ragionamento del LLM (Mixture of Experts) per incrociare lo storico vendite del Tenant con trend di mercato esterni. Il suo scopo è agire da analista strategico invisibile, suggerendo ai CEO o agli agenti decisionali quando lanciare un nuovo prodotto o interrompere una linea in perdita.

## 2. Casi d'uso pratici
- **Previsione per Manipura (Tenant 0):** L'agente analizza un calo di vendite sui saponi estivi e un aumento dei costi delle materie prime, suggerendo di anticipare la produzione della linea autunnale per massimizzare i margini.
- **Integrazione B2B (Agenti Esterni):** Un agente ERP di un cliente chiama l'API ogni venerdì per generare un report esecutivo sui rischi di fornitura, pagando in NPU per il calcolo.

## 3. Istruzioni e Codice
Questa skill non è un'interfaccia visiva, ma un "Action" che si aggancia allo ZEUS Edge Token Gateway.
- **Passo 1 (Intercettazione):** Il Gateway riceve un payload con `action: "forecast_opportunities"`.
- **Passo 2 (Estrazione Dati):** Il sistema interroga in modo sicuro (tramite RLS) le tabelle `products` e `usage_logs` del Tenant chiamante.
- **Passo 3 (Iniezione Prompt):** I dati grezzi vengono iniettati in un System Prompt strategico.
- **Passo 4 (Routing MoE):** La richiesta viene inviata a Gemini 3.1 Pro (modello ad alto ragionamento) per generare l'analisi.
- **Passo 5 (Fatturazione):** L'output viene restituito al client, e il Gateway registra i token NPU consumati per l'elaborazione complessa.

## Variables
- `GEMINI_API_KEY` (Per il routing MoE)
- `TENANT_ID` (Obbligatorio per il contesto dei dati)
