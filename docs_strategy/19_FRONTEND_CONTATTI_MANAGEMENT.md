# 19_FRONTEND_CONTATTI_MANAGEMENT
**Status:** ATTIVO
**Architetto:** CTO Gemini
**Data:** 22/03/2026
**Tenant Target:** Manipura Studio

## 1. OBIETTIVO (OPERATIVITÀ IMMEDIATA)
Abilitare la gestione operativa del database contatti esistente (visto in image_0.png). Creare un'interfaccia tradizionale ("vecchio stile") con tabella, ricerca e bottoni CRUD (Crea, Leggi, Aggiorna, Elimina) integrata in ZeusClaw (/zeusclaw/contatti).

## 2. ARCHITETTURA UI (AMBER GLOW)
- **Layout:** `/app/zeusclaw/contatti/page.tsx` (Server Component per il layout di base).
- **Componente Principale:** Tabella dati (Client Component `'use client'` per l'interattività).
- **Style:** Rigorosamente Amber Glow:
  - Sfondo: Obsidian/Zinc-950.
  - Testo: Chiaro/Ambra (#FFBF00) per gli stati attivi.
  - Bordi: Sottili `border-border/40`.
  - Glassmorphism: Per i componenti di overlay/modali.
- **Elementi:** Bottoni "vecchio stile" (solidi, chiari per l'azione: Modifica, Elimina), campo di ricerca, filtri per categoria (usando `contatti_categorie`).

## 3. LOGICA DATI & SICUREZZA
- **Fetch:** Utilizzo dei Server Components e di Supabase SDK `use server` per il fetch dei dati, assicurandosi che il JWT dell'utente loggato inietti automaticamente il filtro `tenant_id` tramite le policy RLS attive.
- **CRUD:** Le operazioni di Modifica ed Eliminazione chiameranno Server Actions dedicate.