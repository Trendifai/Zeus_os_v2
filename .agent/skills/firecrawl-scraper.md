---
name: firecrawl-scraper
description: Expert web scraping via Firecrawl MCP. Supports deep crawling, mapping, and markdown extraction.
skills: [clean-code, api-patterns]
---

# Firecrawl Scraper Skill

This skill enables autonomous web scraping using the Firecrawl Model Context Protocol (MCP). It handles tokenomics (NPU) and multi-tenant isolation.

## MCP Tools Mapping

### 1. `scrape`
- **Purpose:** Extract clean markdown from a single URL.
- **Payload:** `{ url: string, formats: ["markdown", "html"] }`
- **NPU Cost:** 50 NPU (Base)

### 2. `crawl`
- **Purpose:** Deep crawl a website starting from a seed URL.
- **Payload:** `{ url: string, limit: number, scrapeOptions: { formats: ["markdown"] } }`
- **NPU Cost:** 50 NPU per page.

### 3. `map`
- **Purpose:** Generate a sitemap of a domain.
- **Payload:** `{ url: string }`
- **NPU Cost:** 10 NPU per scan.

## Workflow Pattern
1. **Pre-flight:** Verify tenant wallet balance.
2. **Execution:** Call `firecrawl_scrape` action via Zeus Gateway.
3. **Billing:** Ingress 'Capture' logic on success.
4. **Processing:** Pass markdown to Gemini v2 for vector embedding.
