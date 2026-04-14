# STRATEGIA 30: Layer di Esecuzione "Operator" via Arcade.dev
**Stato**: VITALE | **Target**: Core PaaS (Esecuzione Azioni Reali)
**ROI**: Trasforma l'IA da "Chatbot" a "Dipendente Virtuale" capace di operare su 7500+ app.

## 1. Architettura di Comando
ZEUS OS implementa `Arcade.dev` come gateway MCP (Model Context Protocol). L'IA non si limita a suggerire, ma "clicca" e "scrive" per conto dell'utente.

## 2. Governance e Sicurezza
- **Gateway Centralizzato**: Agentia gestisce il server Arcade; i singoli Tenant autorizzano le proprie app (Slack, Gmail, Google Drive) via OAuth.
- **Zero-Key Leak**: Le credenziali non toccano mai il database di ZEUS, risiedono nel Vault di Arcade.
- **Audit Log**: Ogni azione (es. "Crea repo GitHub") è loggata e fatturata in NPU.

## 3. Workflow Esecutivo
1. L'utente impartisce un comando operativo.
2. L'Orchestratore ZEUS valida il permesso e il saldo NPU.
3. Il sub-agente esegue l'azione tramite il connettore Arcade.