# WALKTHROUGH - 2026-04-22
## Quick Reference for CEO
## ZEUS OS v2 - Manipura

---

## 1. Karpathy Wiki Structure

```
src/wiki/
├── index/              # ✅ Validated content
│   ├── prodotti.md
│   ├── fornitori.md
│   └── 00_GOALS/
│       └── active_kpis.md
├── raw/               # 🔄 Scraping buffer
│   └── proposals/    # ⏳ CEO approval needed
├── log/               # 📝 Maintenance
└── wiki-compiler.py
```

---

## 2. How to Scrape a Website

**Step 1:** Type in ZeusClaw:
```
Scansiona https://manipura.shop
```

**Step 2:** Zeus fetches → cleans → returns summary

**Step 3:** Zeus asks:
```
Dati acquisiti. Salvo in src/wiki/raw/[domain].md?
```

**Step 4:** Confirm with:
```
Sì
```
or
```
Salva
```

**Result:** Saved to `src/wiki/raw/[domain].md`

---

## 3. GRO Mode (Goal-Driven Orchestration)

### Activate
When talking to Zeus, he automatically:
1. Checks current command against GOALS
2. Validates KPI impact
3. Proposes optimized alternatives if conflict

### Check GOALS
**File:** `src/wiki/index/00_GOALS/active_kpis.md`

### Update GOALS
```markdown
- [GOAL_X]: Goal Name (KPI Target).
```

Then run:
```bash
python scripts/compile_wiki.py
```

---

## 4. Scripts Reference

### Compile Wiki
```bash
python scripts/compile_wiki.py
```
Reads `index/` → generates `src/zeus_context.txt`

### Lint Wiki
```bash
python scripts/lint_wiki.py          # Check
python scripts/lint_wiki.py --fix    # Auto-fix
```
Validates: H1 required, no double lines, trim trailing

### Autonomous Watcher
```bash
python scripts/zeus_watcher.py
```
Runs every 30 minutes, creates proposals

---

## 5. MCP Bridge

**Endpoint:** `POST /api/mcp`

### Read Codebase
```json
{
  "tool": "read_codebase",
  "params": { "path": "src/app/page.tsx" },
  "api_key": "zeus-mcp-secret"
}
```

### Suggest Edit (Creates Proposal)
```json
{
  "tool": "suggest_edit",
  "params": {
    "path": "src/app/page.tsx",
    "code": "export default function..."
  },
  "api_key": "zeus-mcp-secret"
}
```

**Security:** All changes → `raw/proposals/` → CEO approval required

---

## 6. Quick Commands

| Action | Command |
|--------|---------|
| Scrape URL | "Scansiona [URL]" |
| Save content | "Sì" / "Salva" |
| Update GOALS | Edit `00_GOALS/active_kpis.md` |
| Compile wiki | `python scripts/compile_wiki.py` |
| Lint wiki | `python scripts/lint_wiki.py` |

---

## 7. Error Handling

| Error | Message |
|-------|---------|
| Network failure | "Sito irraggiungibile o errore di connessione. Riprovo, CEO?" |
| Scraping failed | "Scraping fallito. Riprovo?" |
| File not found | "File non trovato" |

---

## 8. Tomorrow's Tasks

- [ ] Test scraping on manipura.shop
- [ ] Implement CEO approval flow for proposals
- [ ] Activate zeus_watcher.py in production
- [ ] Connect MCP to external GCA service

---

*Quick reference for CEO - ZEUS OS v2 - 2026-04-22*