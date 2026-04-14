# PROTOCOLLO: RLS Lockdown & Zero-Access Default
**ID:** 27_RLS_LOCKDOWN_PROTOCOL  
**Status:** CRITICO / IMMEDIATO  
**Architetto:** CTO Gemini

## 0. ANALISI E CONTESTO STRATEGICO (Note del CTO)
**Input originale:** Alert sicurezza Supabase ("Table publicly accessible... rls_disabled_in_public").
**Crash-Test:** Rischio Finanziario e Legale Massimo. Questo è inaccettabile. Una falla del genere viola il nostro Documento 06 (RGPD) e il Documento 07 (Zero Trust Architecture). Un data leak in fase di scale-up distrugge la reputazione del PaaS e ci espone a sanzioni milionarie. L'ottimismo non copre i buchi nel database.
**Verdetto:** Vitale. Blocco immediato dello sviluppo di nuove feature fino alla risoluzione.

---

## 1. Analisi del Rischio
Le tabelle "publicly accessible" sono il cancro di un PaaS. Un attaccante o un semplice bot scraper può svuotare il wallet TND, scaricare i listini o rubare i contatti dei clienti in pochi secondi.

## 2. Operatività A-Z

### Fase 1: Identificazione
Eseguire il comando di audit su Supabase (MCP o SQL Editor) per listare *tutte* le tabelle con `row_level_security = 'disabled'`.

### Fase 2: Chiusura Totale (Kill Switch)
Per ogni tabella identificata:
1. Eseguire `ALTER TABLE <nome_tabella> ENABLE ROW LEVEL SECURITY;`
2. Rimuovere qualsiasi policy `ALL` o `SELECT` associata al ruolo `anon` (utenti non autenticati).

### Fase 3: Applicazione Policy "Zeus Standard"
Ogni tabella operativa deve avere questa policy minima assoluta:
```sql
CREATE POLICY "Tenant Isolation" ON public.<nome_tabella>
FOR ALL USING (
  tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
);