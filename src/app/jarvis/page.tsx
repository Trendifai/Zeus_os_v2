'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';

type TabId = 'neural' | 'fiscal' | 'team' | 'vip';

interface GlobalConfig {
  currency: string;
  lang: string;
  fiscal_data: {
    tva_rate: number;
    rc: string;
    matricule_fiscale: string;
    rib: string;
    address?: string;
    phone?: string;
  };
}

export default function JarvisPage() {
  const [activeTab, setActiveTab] = useState<TabId>('neural');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const supabase = createClient();

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'neural', label: 'Neural', icon: '⚡' },
    { id: 'fiscal', label: 'Fiscal', icon: '📊' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'vip', label: 'VIP Club', icon: '💎' },
  ];

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      const { data } = await supabase
        .from('global_config')
        .select('*')
        .eq('tenant_id', 'manipura-0')
        .single();
      
      if (data) {
        setConfig(data as unknown as GlobalConfig);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  function renderTabContent() {
    switch (activeTab) {
      case 'neural':
        return (
          <div className="space-y-4">
            <div className="card">
              <h3 className="card-title">Neural Processing</h3>
              <p className="card-desc">Chat, Voice & Vision AI</p>
              <div className="flex gap-2 mt-4">
                <button className="btn-amber">Chat</button>
                <button className="btn-outline">Voice</button>
                <button className="btn-outline">Vision</button>
              </div>
            </div>
            <div className="card">
              <h3 className="card-title">Quick Chat</h3>
              <textarea 
                placeholder="Ask ZEUS..." 
                className="input-field"
                rows={3}
              />
              <button className="btn-amber mt-2 w-full">Send</button>
            </div>
          </div>
        );
      case 'fiscal':
        return (
          <div className="space-y-4">
            <div className="card">
              <h3 className="card-title">Fiscal Tunisia</h3>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="label">Currency</label>
                  <select className="input-field" defaultValue={config?.currency || 'TND'}>
                    <option value="TND">TND</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div>
                  <label className="label">Language</label>
                  <select className="input-field" defaultValue={config?.lang || 'fr'}>
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="label">TVA Rate %</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    defaultValue={config?.fiscal_data?.tva_rate || 19}
                  />
                </div>
                <div>
                  <label className="label">RC</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    defaultValue={config?.fiscal_data?.rc || ''}
                  />
                </div>
                <div className="col-span-2">
                  <label className="label">Matricule Fiscale</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    defaultValue={config?.fiscal_data?.matricule_fiscale || ''}
                  />
                </div>
              </div>
              <button className="btn-amber mt-4 w-full">Save Fiscal</button>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="space-y-4">
            <div className="card">
              <h3 className="card-title">Team IAM</h3>
              <p className="card-desc">Invite & manage team members</p>
              <div className="mt-3">
                <label className="label">Email</label>
                <input type="email" className="input-field" placeholder="user@example.com" />
              </div>
              <div className="mt-3">
                <label className="label">Role</label>
                <select className="input-field">
                  <option value="operator">Operator</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <button className="btn-amber mt-4 w-full">Send Invite</button>
            </div>
            <div className="card">
              <h3 className="card-title">Members</h3>
              <p className="text-zinc-400">No members yet</p>
            </div>
          </div>
        );
      case 'vip':
        return (
          <div className="space-y-4">
            <div className="card">
              <h3 className="card-title">VIP Club</h3>
              <p className="card-desc">Production Lots Generator</p>
              <div className="mt-3">
                <label className="label">Lot Number</label>
                <input type="text" className="input-field" placeholder="LOT-2026-001" />
              </div>
              <div className="mt-3">
                <label className="label">Product</label>
                <select className="input-field">
                  <option value="">Select product...</option>
                </select>
              </div>
              <div className="mt-3">
                <label className="label">Story Data</label>
                <textarea 
                  className="input-field" 
                  rows={3}
                  placeholder='{"origin": "Sousse", "ingredients": [...]}'
                />
              </div>
              <button className="btn-amber mt-4 w-full">Generate Lot</button>
            </div>
            <div className="card">
              <h3 className="card-title">Recent Lots</h3>
              <p className="text-zinc-400">No lots yet</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-amber-500 animate-pulse font-mono">Loading ZEUS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <style>{`
        .neural-tab { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .btn-amber { 
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
          color: #09090b; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem;
          transition: all 0.2s;
        }
        .btn-amber:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-outline { 
          background: transparent; border: 1px solid #71717a; color: #e4e4e7; 
          padding: 0.5rem 1rem; border-radius: 0.5rem;
        }
        .btn-outline:hover { border-color: #f59e0b; color: #f59e0b; }
        .input-field {
          width: 100%; background: #18181b; border: 1px solid #27272a; 
          color: #e4e4e7; padding: 0.5rem; border-radius: 0.5rem;
        }
        .input-field:focus { outline: none; border-color: #f59e0b; }
        .label { display: block; color: #a1a1aa; font-size: 0.75rem; margin-bottom: 0.25rem; }
        .card { background: #18181b; border: 1px solid #27272a; border-radius: 0.75rem; padding: 1rem; }
        .card-title { color: #fafafa; font-weight: 600; font-size: 1rem; }
        .card-desc { color: #71717a; font-size: 0.875rem; margin-top: 0.25rem; }
        .tab-btn { padding: 0.5rem 1rem; border-radius: 0.5rem; transition: all 0.2s; }
        .tab-btn.active { background: #27272a; color: #f59e0b; }
        .tab-btn:not(.active):hover { color: #e4e4e7; }
      `}</style>
      
      <header className="border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h1 className="text-lg font-semibold text-zinc-100">ZEUS Jarvis</h1>
              <p className="text-xs text-zinc-500">Tenant: manipura-0</p>
            </div>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-sm text-zinc-300">{user.email}</p>
              <p className="text-xs text-amber-500">Admin</p>
            </div>
          )}
        </div>
      </header>
      
      <nav className="p-4 border-b border-zinc-800">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
      
      <main className="p-4 max-w-md mx-auto">
        {renderTabContent()}
      </main>
    </div>
  );
}