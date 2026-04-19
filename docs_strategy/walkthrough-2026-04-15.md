# Walkthrough - 15 Aprile 2026

## Obiettivi Giornalieri

### 1. Creare Agentia-Lab su GitHub e repo vuoto zeus-os-v2

- Creare organizzazione Agentia-Lab su GitHub
- Inizializzare nuovo repo privato vuoto: zeus-os-v2

### 2. Creare progetto Supabase ZEUS_V2_PROD

- Accedere a dashboard.supabase.com
- Creare nuovo progetto: ZEUS_V2_PROD
- Ottenere credentials e configurare .env.local

### 3. Agganciare remote Git e Supabase DB Push

- Aggiungere remote GitHub al workspace locale
- Eseguire migration SQL su Supabase:
  ```bash
  supabase migrations new core_schema
  supabase db push
  ```