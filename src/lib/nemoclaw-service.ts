export interface NeMoJob {
  id: string;
  type: 'web_analysis' | 'massive_compute' | 'skill_generation';
  payload: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  created_at: string;
}

export interface NeMoConfig {
  containerUrl: string;
  apiKey?: string;
  isConnected: boolean;
}

const DEFAULT_CONFIG: NeMoConfig = {
  containerUrl: process.env.NEMOCLAW_URL || 'http://localhost:11434',
  apiKey: process.env.NEMOCLAW_API_KEY,
  isConnected: false,
};

let nemoclawConfig = { ...DEFAULT_CONFIG };

export async function connectToNeMoClaw(): Promise<boolean> {
  try {
    const response = await fetch(`${nemoclawConfig.containerUrl}/api/tags`, {
      method: 'GET',
      headers: nemoclawConfig.apiKey 
        ? { 'Authorization': `Bearer ${nemoclawConfig.apiKey}` }
        : {},
    });
    nemoclawConfig.isConnected = response.ok;
    console.log('🤖 NeMoClaw: Connected =', response.ok);
    return response.ok;
  } catch (error) {
    console.log('🤖 NeMoClaw: Connection failed', error);
    nemoclawConfig.isConnected = false;
    return false;
  }
}

export function getNeMoStatus(): NeMoConfig {
  return nemoclawConfig;
}

export async function executeNeMoJob(job: Omit<NeMoJob, 'id' | 'status' | 'created_at'>): Promise<NeMoJob> {
  if (!nemoclawConfig.isConnected) {
    await connectToNeMoClaw();
  }

  const fullJob: NeMoJob = {
    ...job,
    id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${nemoclawConfig.containerUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(nemoclawConfig.apiKey ? { 'Authorization': `Bearer ${nemoclawConfig.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: 'nemoclaw',
        prompt: job.payload.prompt,
        options: {
          temperature: 0.3,
          num_ctx: 128000,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      fullJob.status = 'completed';
      fullJob.result = data.response;
    } else {
      fullJob.status = 'failed';
      fullJob.result = { error: `NeMo error: ${response.status}` };
    }
  } catch (error) {
    fullJob.status = 'failed';
    fullJob.result = { error: error instanceof Error ? error.message : 'Unknown error' };
  }

  return fullJob;
}

export async function delegateToNeMoIfNeeded(
  prompt: string,
  context: any
): Promise<{ delegated: boolean; result?: any }> {
  const delegationKeywords = [
    'analizza web',
    'ricerca su web',
    'calcola',
    'massive',
    'computazione',
    'deep analysis',
    'scan',
    'crawl',
  ];

  const shouldDelegate = delegationKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );

  if (!shouldDelegate) {
    return { delegated: false };
  }

  console.log('🤖 NeMoClaw: Delegating job to container...');
  const job = await executeNeMoJob({
    type: 'web_analysis',
    payload: { prompt, context },
  });

  return { 
    delegated: true, 
    result: job.result || { status: job.status } 
  };
}

export function setNeMoConfig(config: Partial<NeMoConfig>) {
  nemoclawConfig = { ...nemoclawConfig, ...config };
}