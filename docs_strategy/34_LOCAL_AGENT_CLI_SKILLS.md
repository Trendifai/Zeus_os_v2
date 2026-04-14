[GCA HANDOFF - EPIC ARCHITECT MODE]
Invocare [MCP-Supabase] per scansione tabelle e applicazione patch RLS globale. GCA HANDOFF COMPLETED


***

### Documento 3: 28_LOCAL_AGENT_CLI_SKILLS.md

```markdown
# EVOLUZIONE: Local Agent "CLI + Skills" Pattern
**ID:** 28_LOCAL_AGENT_CLI_SKILLS  
**Status:** OTTIMIZZAZIONE ROI  
**Architetto:** CTO Gemini

## 0. ANALISI E CONTESTO STRATEGICO (Note del CTO)
**Input originale:** Video analisi "MCP is Dead — Why CLI + Skills is Replacing It".
**Crash-Test:** L'utilizzo massivo dei server MCP per gli agenti consuma fino al 60% della context window (circa 30k token solo per le definizioni dei tool). Questo brucia letteralmente il budget NPU senza produrre valore. L'approccio descritto nel video (Bash nativo + Markdown skills) abbatte i costi ed è perfetto per l'ambiente locale.
**Verdetto:** Shift immediato su "CLI + Skills" per gli agenti locali e i dev-tools (Z-Forge/Antigravity). L'MCP rimane relegato *esclusivamente* lato cloud (Zeus OS) come connettore isolato per le API dei clienti (Google Workspace, ecc.).

---

## 1. La Falla dell'MCP (Context Bloat)
L'MCP tradizionale carica enormi schemi JSON nel contesto dell'LLM solo per spiegare quali strumenti esistono. È uno spreco computazionale inaccettabile per le operazioni di backend/dev di Antigravity.

## 2. La Nuova Via: Skill-Based Shell
Invece di server MCP pesanti, daremo all'IA accesso diretto alla Bash guidata da file di istruzioni `.md`.

### A. Struttura Skills
Creeremo cartelle strutturate in `.agent/skills/` contenenti:
- `filesystem.md`: Comandi ottimizzati per la manipolazione file (grep, find, cat).
- `supabase_cli.md`: Istruzioni per usare nativamente `npx supabase` invece di costruire un server MCP ad-hoc.

### B. Vantaggi A-Z
1. **Token Zero Overhead:** L'IA (Claude/Gemini) conosce già la sintassi Bash. Legge solo la skill `.md` specifica quando serve, risparmiando decine di migliaia di token per prompt.
2. **Flessibilità Infinita:** Qualsiasi tool CLI (npm, pip, supabase) diventa istantaneamente un tool per l'agente.

## 3. Implementazione
Riconfigurare l'innesco di Antigravity per caricare i file `.md` della directory `/skills` come "System Instructions" dinamiche, bypassando l'infrastruttura MCP locale.

---
[GCA HANDOFF - EPIC ARCHITECT MODE]
Invocare [FileSystemSkill] per creare la struttura .agent/skills/ e popolare i template.