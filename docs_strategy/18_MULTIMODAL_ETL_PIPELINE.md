# 18_MULTIMODAL_ETL_PIPELINE (PDF TO CRM)
**Status:** ATTIVO
**Architetto:** CTO Gemini
**Data:** 22/03/2026
**Tenant Target:** Manipura Studio (e futuri)

## 1. OBIETTIVO (BUSINESS LOGIC)
Eliminare il data entry manuale. Creare una pipeline ETL (Extract, Transform, Load) che riceve documenti non strutturati (PDF fornitori, ricevute, immagini), sfrutta il cluster MOE (Gemini) per l'estrazione intelligente e salva i dati strutturati direttamente su Supabase CRM.

## 2. FLUSSO DEI DATI (WORKFLOW)
1. **Upload (Client):** L'utente usa l'icona "graffetta" nella UI (Amber Glow). Il file viene passato come `FormData`.
2. **Server Action (Next.js 15):** Riceve il file in un ambiente sicuro (`use server`).
3. **Estrazione (Gemini API):** Il buffer del file viene inviato al modello multimodale. Viene forzato un output JSON rigoroso (Structured Outputs) corrispondente allo schema del CRM.
4. **Billing (NPU):** Viene calcolato il costo in token dell'operazione e scalato dal wallet TND del tenant.
5. **Storage (Supabase):** Inserimento del record JSON nel database passando il `tenant_id` per soddisfare le policy RLS.

## 3. SICUREZZA E CONSTRAINT
- **Server-Side Only:** Nessuna chiave API del LLM o di Supabase deve essere esposta al client.
- **RLS Enforcement:** Ogni query al DB deve includere il token JWT dell'utente loggato per garantire l'isolamento del `tenant_id`.