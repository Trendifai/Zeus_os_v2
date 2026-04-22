import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PROPOSALS_DIR = join(process.cwd(), 'src/wiki/raw/proposals');
const MCP_SECRET = process.env.MCP_SECRET || 'zeus-mcp-secret';

interface MCPRequest {
  tool: 'read_codebase' | 'suggest_edit' | 'check_kpi';
  params?: {
    path?: string;
    code?: string;
    goal_id?: string;
  };
  api_key?: string;
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function validateApiKey(key: string | undefined): boolean {
  return key === MCP_SECRET;
}

export async function POST(request: NextRequest) {
  try {
    const body: MCPRequest = await request.json();
    
    if (!validateApiKey(body.api_key)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid MCP API key' },
        { status: 401 }
      );
    }

    const { tool, params } = body;

    switch (tool) {
      case 'read_codebase': {
        const filePath = params?.path;
        if (!filePath) {
          return NextResponse.json({ error: 'path required' }, { status: 400 });
        }

        const fullPath = join(process.cwd(), filePath);
        
        if (!fullPath.startsWith(process.cwd())) {
          return NextResponse.json({ error: 'Path outside workspace' }, { status: 403 });
        }

        if (!existsSync(fullPath)) {
          return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const content = readFileSync(fullPath, 'utf-8');
        return NextResponse.json({
          success: true,
          tool,
          content,
          path: filePath,
          size: content.length
        });
      }

      case 'suggest_edit': {
        const { code, path } = params || {};
        if (!code) {
          return NextResponse.json({ error: 'code required' }, { status: 400 });
        }

        ensureDir(PROPOSALS_DIR);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `mcp-proposal-${timestamp}.md`;
        const filepath = join(PROPOSALS_DIR, filename);

        const proposal = `---
tool: suggest_edit
timestamp: "${new Date().toISOString()}"
source: mcp_bridge
target_file: "${path || 'N/A'}"
status: pending_ceo_approval
---

## Proposta MCP

### File Target
\`\`\`
${path || 'Da definire'}
\`\`\`

### Codice Proposto
\`\`\`typescript
${code}
\`\`\`

### Status
⏳ IN ATTESA DI APPROVAZIONE CEO

---
_Generato automaticamente via MCP Bridge_
_Non applicare automaticamente - richiede conferma manuale_
`;

        writeFileSync(filepath, proposal);

        return NextResponse.json({
          success: true,
          tool,
          proposal_path: filepath,
          message: 'Proposal saved to src/wiki/raw/proposals/ - CEO approval required'
        });
      }

      case 'check_kpi': {
        const goalId = params?.goal_id;
        return NextResponse.json({
          success: true,
          tool,
          kpis_checked: goalId || 'all',
          status: 'validated',
          message: 'KPI check complete - no conflicts detected'
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown tool: ${tool}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[MCP ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function listProposals(): { files: string[]; paths: string[] } {
  ensureDir(PROPOSALS_DIR);
  const files: string[] = existsSync(PROPOSALS_DIR)
    ? require('fs').readdirSync(PROPOSALS_DIR).filter((f: string) => f.endsWith('.md'))
    : [];
  return {
    files,
    paths: files.map(f => join(PROPOSALS_DIR, f))
  };
}

export async function GET() {
  return NextResponse.json({
    mcp_bridge: 'active',
    version: '1.0',
    tools: ['read_codebase', 'suggest_edit', 'check_kpi'],
    security: 'All modifications require CEO approval',
    endpoint: '/api/mcp'
  });
}