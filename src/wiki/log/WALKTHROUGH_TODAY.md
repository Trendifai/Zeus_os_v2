# WALKTHROUGH - 2026-04-22
## Quick Guide for CEO

---

## 1. How to Scrape a Website

**Step 1:** Type in ZeusClaw chat:
```
Scansiona https://manipura.shop
```

**Step 2:** Zeus fetches the content and shows you a summary

**Step 3:** Zeus asks:
```
"Dati acquisiti. Salvo in src/wiki/raw/?"
```

**Step 4:** Confirm with:
```
Sì
```
or
```
Salva
```

**Result:** File saved in `src/wiki/raw/[domain].md`

---

## 2. How to Update Goals

**File:** `src/wiki/index/00_GOALS/active_kpis.md`

**Format:**
```markdown
- [GOAL_X]: Goal Name (KPI Target).
```

**Example:**
```markdown
- [GOAL_4]: Reduce Bundle Size (Bundle < 150kb).
```

**After edit:** Run:
```bash
python scripts/compile_wiki.py
```
This updates `src/zeus_context.txt` for Zeus.

---

## 3. How to Check KPI Status

**View:** `src/wiki/index/00_GOALS/active_kpis.md`

| ID | Metric | Target |
|----|--------|--------|
| P-001 | Dashboard Load | < 1000ms |
| P-002 | Bundle Size | < 200kb |
| P-003 | LLM Latency | < 2000ms |

---

## 4. How Maintenance Works

### Automatic
- `zeus_watcher.py` runs every 30 minutes
- Checks context against GOALS
- Creates proposals in `src/wiki/raw/proposals/`
- Triggers notification on dashboard

### Manual
```bash
# Lint wiki files
python scripts/lint_wiki.py

# Compile wiki to context
python scripts/compile_wiki.py

# Auto-fix lint issues
python scripts/lint_wiki.py --fix
```

---

## 5. MCP Bridge Usage

**Endpoint:** `POST /api/mcp`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "x-api-key": "zeus-mcp-secret"
}
```

**Example - Read File:**
```json
{
  "tool": "read_codebase",
  "params": { "path": "src/app/page.tsx" }
}
```

**Example - Propose Edit:**
```json
{
  "tool": "suggest_edit",
  "params": {
    "path": "src/app/page.tsx",
    "code": "export default function..."
  }
}
```

**Note:** All edits go to `raw/proposals/` - CEO must approve.

---

## 6. GRO Mode Commands

When talking to Zeus, you can:
- Ask Zeus to analyze code against GOALS
- Request performance optimization suggestions
- Ask Zeus to propose changes (saved as proposals)

---

## Quick Reference

| Action | Command |
|--------|---------|
| Scrape URL | "Scansiona [URL]" |
| Save content | "Sì" / "Salva" |
| Update GOALS | Edit `00_GOALS/active_kpis.md` |
| Check KPIs | Read `active_kpis.md` |
| Lint wiki | `python scripts/lint_wiki.py` |
| Compile wiki | `python scripts/compile_wiki.py` |

---

*Quick reference for CEO - ZEUS OS v2*