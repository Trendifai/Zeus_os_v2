# ZEUS OS - Strategic Architecture Document
**Version:** 2.0  
**Date:** 2026-04-12  
**Classification:** Internal - CEO/CTO  
**Stakeholders:** Massimo (CEO), Gemini (CTO)

---

## 1. Vision

Costruire un'infrastruttura **Agentic Computing** per PMI tunisine e internazionali. ZEUS OS integra CRM, documenti, e-commerce e AI operativa in un'unica piattaforma multi-tenant con sicurezza Zero-Trust.

**Principio Fondamentale:** Zero Allucinazioni. Ogni output AI viene validato in sandbox prima dell'uso in produzione.

---

## 2. Roadmap Operativa (Sessioni 3-4 ore)

| Phase | Focus | Deliverables |
|-------|-------|--------------|
| **G1** | Skeleton & Foundation Fix | Setup Next.js 16, Supabase RLS, fix Wallet 401 Unauthorized |
| **G2-G3** | Mirror Protocol | Onboarding identitario RAG: CV upload, documenti, intervista affinamento |
| **G4** | Voice/UI Interface | Amber Glow Design, integrazione vocale bassa latenza (Gemini 3.1 Flash) |
| **G5-G7** | MOE & Sandbox | Mixture of Experts (Gemini, Claude, GLM-5.1, Minimax), sandbox validazione Zero Allucinazioni |
| **G8** | Billing & Quote | Sistema Quote & Pay basato su NPU, Wallet TND |
| **G9** | Deploy & Hardening | Vercel + VPS dedicata per Long Horizon Tasks |

---

## 3. Stack Tecnologico

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Next.js 16 (App Router) | Server Components, React 19 |
| Backend | Supabase | Auth, DB, RLS, Edge Functions |
| Styling | Tailwind CSS | Amber Glow Design System |
| AI Core | Gemini 1.5 Flash | Estrazione, analisi, generazione |
| AI Orchestration | MOE | Gemini + Claude + GLM-5.1 + Minimax |
| Deployment | Vercel + VPS | CDN edge + long-horizon compute |
| Security | RLS mandatory | Zero Cross-Tenant Data Bleed |

---

## 4. Multi-Tenant Architecture

### 4.1 Tenant Structure

```
Tenant 0 (Agentia Core)
├── Configurazione globale
├── Modelli AI
└── Amministrazione platform

Tenant N (Clienti)
├── CRM isolato
├── Documenti isolati
├── Wallet isolato
└── NPU credits isolati
```

### 4.2 Role Hierarchy

| Role | Accesso | Descrizione |
|------|---------|------------|
| `superadmin` | Platform | Accesso completo, gestione tenant |
| `admin` | Tenant | Amministrazione tenant |
| `operator` | Reparto | Accesso operativo |

---

## 5. Zero-Trust RLS

### 5.1 Implementation

```typescript
// Profile verification on every request
const { data: profile } = await supabase
  .from('profiles')
  .select('role, tenant_id')
  .eq('id', user.id)
  .single();

const isSuperAdmin = profile?.role === 'superadmin';
```

### 5.2 Layout Enforcement

```typescript
export const dynamic = "force-dynamic";

if (!isSuperAdmin) {
  redirect(`/${locale}/dashboard`);
}
```

### 5.3 Action Authorization

```typescript
if (!isSuperAdmin && !tenantId) {
  throw new Error("401 Unauthorized");
}
```

---

## 6. NPU Tokenomics (G8)

### 6.1 Architecture

Sistema Quote & Pay interno basato su Neural Processing Units.

### 6.2 Consumption Table

| Operazione | NPU | Descrizione |
|------------|-----|-------------|
| AI Text Analysis | 20 | Gemini extraction |
| Customer Save | 5 | DB write |
| Document Generation | 10 | PDF/Invoice |
| Product Import | 15 | Batch ingestion |
| Voice Processing | 25 | Low-latency voice AI |

### 6.3 Implementation

```sql
SELECT consume_tokens_atomic(
  p_tenant_id := 'uuid',
  p_amount_tokens := 20,
  p_service_name := 'AI Extraction'
);
```

---

## 7. MOE Orchestrator (G5-G7)

### 7.1 Concept

Mixture of Experts: coordinamento di molteplici provider AI per task specifici.

### 7.2 Provider Matrix

| Task | Provider | Model | Latency |
|------|----------|-------|---------|
| Extraction | Google | Gemini 1.5 Flash | Low |
| Reasoning | Anthropic | Claude 3.5 | Medium |
| Code | OpenAI | GPT-4 | Medium |
| Chinese | Zhipu | GLM-5.1 | Medium |
| Budget | Abacus | Minimax | Low |

### 7.3 Sandbox Validation

```
AI Output → Sandbox → Zero Hallucination Check → Production
                ↓
         [FAIL] → Retry with different provider
         [PASS] → Cache + Use
```

### 7.4 Implementation Pattern

```typescript
interface MOERequest {
  task: 'extract' | 'reason' | 'generate';
  payload: string;
  priority: 'low' | 'medium' | 'high';
}

async function MOEOrchestrate(request: MOERequest) {
  const provider = getProviderForTask(request.task);
  const result = await provider.generate(request.payload);
  
  if (!validateInSandbox(result)) {
    return retryWithFallback(request);
  }
  
  return cacheAndReturn(result);
}
```

---

## 8. Mirror Protocol (G2-G3)

### 8.1 Purpose

Onboarding identitario per ogni tenant: costruire un "mirror" digitale dell'organizzazione.

### 8.2 Process

1. **CV Upload**: Caricamento organigramma e ruoli
2. **Documenti**: Fatture, contratti, procedure
3. **Intervista AI**: Sessione di affinamento per coprire edge cases
4. **Mirror Activation**: Il sistema risponde "in persona" dell'azienda

### 8.3 RAG Implementation

```typescript
interface TenantMirror {
  tenant_id: string;
  documents: Document[];
  cv_data: CVData;
  interview_summary: string;
  rag_index: VectorIndex;
}

async function buildMirror(tenantId: string) {
  const docs = await fetchTenantDocuments(tenantId);
  const vectors = await embedAll(docs);
  await storeRAGIndex(tenantId, vectors);
}
```

---

## 9. Voice/UI Interface (G4)

### 9.1 Amber Glow Design

Design system proprietario per ZEUS OS.

```css
:root {
  --amber-primary: #f59e0b;
  --amber-glow: rgba(245, 158, 11, 0.4);
  --zinc-bg: #18181b;
}
```

### 9.2 Voice Integration

```typescript
interface VoiceConfig {
  provider: 'gemini' | 'openai';
  model: '3.1-flash';
  latency_target: '<200ms';
  voice: 'adaptive';
}
```

---

## 10. Deploy & Hardening (G9)

### 10.1 Infrastructure

| Component | Environment | Purpose |
|-----------|-------------|---------|
| Vercel | Edge | SSR, CDN, API routes |
| VPS | Dedicated | Long-horizon tasks, batch processing |
| Supabase | Cloud | Auth, DB, RLS |

### 10.2 Security Hardening

- [ ] RLS on all tables (mandatory)
- [ ] Rate limiting on AI endpoints
- [ ] Audit logging for all mutations
- [ ] TLS 1.3 enforcement
- [ ] CSP headers configured

---

## 11. Technical Debt & Known Issues

| Issue | Status | Priority |
|-------|--------|----------|
| AI Auth 401 | In Progress | High |
| Sidebar Cache | Fixed | Complete |
| RLS Verification | TODO | High |
| Zero-Trust Audit | TODO | Medium |

---

## 12. Session Tracking

| Session | Date | Focus | Duration |
|---------|------|-------|----------|
| 1 | 2026-04-11 | OpenCode transition, RBAC fixes | 3h |
| 2 | 2026-04-12 | Strategy document, MOE planning | 2h |

---

*Document status: Active*  
*Next review: 2026-04-19*
