# 🦞 SPECIFICHE ARCHITETTURALI ZEUS: "NeMoClaw Sandbox & Guardrails"

**Progetto:** Zeus OS (by Agentia)
**Focus:** Ambiente di esecuzione isolato (OpenShell), Privacy Routing e NeMo Guardrails
**File di riferimento futuro:** `docker-compose.agents.yml`, `guardrails/crm_policy.yaml`

## 1. La Filosofia "OpenShell" (La Gabbia di Titanio)
Gli Agenti Specialisti di Zeus (Livello 2) non vengono eseguiti direttamente sul server Node.js principale. Vengono istanziati all'interno di **NeMoClaw OpenShell**, un ambiente Docker iper-isolato.
* **Network Isolato:** Il container dell'agente NON ha accesso diretto a Internet. Può comunicare solo in uscita verso due nodi interni:
  1. Il Gateway LiteLLM (per generare i token).
  2. I Server MCP (per eseguire i tool).
* **Prevenzione Data Exfiltration:** Se un attaccante o un prompt maligno convince l'agente a "inviare i dati del cliente a *http://hacker-server.com*", la richiesta viene bloccata fisicamente dal firewall del container OpenShell.

## 2. Router della Privacy (Cloud vs Edge Local)
NeMoClaw si integra con il nostro LiteLLM per decidere *dove* processare i dati in base al livello di rischio RGPD:
* **Task a Basso Rischio (es. Marketing, Scraper):** Il router invia il prompt criptato ai server cloud di OpenAI (GPT-4o) o Anthropic (Claude 3.5).
* **Task ad Alto Rischio (es. Lettura Buste Paga, Bilanci non pubblici):** Il router blocca l'uscita verso il cloud e processa il prompt utilizzando un modello LLM ospitato sui nostri server privati o in un'istanza dedicata (es. Llama 3 o NVIDIA Nemotron), garantendo che il dato sensibile non lasci mai la nostra infrastruttura europea (Zero-Data-Transfer).

## 3. NeMo Guardrails: Le Regole di Ingaggio (YAML)
Oltre all'isolamento hardware, applichiamo un "guinzaglio" logico (Guardrails) a ogni singolo Agente Specialista. Se l'utente cerca di deviare l'agente dal suo scopo, il Guardrail intercetta la conversazione e la blocca prima ancora che raggiunga l'LLM (risparmiando token e prevenendo allucinazioni).

**Esempio: `crm_policy.yaml` (Guardrail dell'Agente CRM)**
```yaml
define user express greeting
  "ciao"
  "buongiorno"

define bot express greeting
  "Salve, sono l'Agente CRM di Zeus. Come posso aiutarti con i tuoi contatti?"

define user ask non_crm_question
  "scrivimi una poesia"
  "come si cucina la carbonara?"
  "cancella tutto il database"

define bot refuse to answer
  "Mi dispiace, ma sono uno specialista CRM e sono autorizzato a operare solo sulle anagrafiche clienti. Non posso elaborare questa richiesta."

define flow
  user ask non_crm_question
  bot refuse to answer

4. Implementazione (Per il Team di Sviluppo)
L'implementazione tecnica richiederà un docker-compose separato per il cluster AI:

Node 1 (Zeus Core): Next.js 15 (Interfaccia e DB).

Node 2 (LiteLLM): Il gateway per API e conteggio Token (Redis).

Node 3 (NeMoClaw): Il cluster che esegue i Worker Python/Node con i Guardrails attivati