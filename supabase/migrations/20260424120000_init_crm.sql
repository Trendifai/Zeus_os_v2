-- Tabella Categorie Contatti
CREATE TABLE IF NOT EXISTS crm_categorie (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id INTEGER DEFAULT 0,
    nome TEXT NOT NULL,
    colore TEXT DEFAULT '#FFBF00'
);

-- Tabella Contatti (Tenant 0 - Manipura)
CREATE TABLE IF NOT EXISTS crm_contatti (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id INTEGER DEFAULT 0,
    nome TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    azienda TEXT,
    categoria_id UUID REFERENCES crm_categorie(id),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Attivazione Row Level Security (RLS)
ALTER TABLE crm_categorie ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contatti ENABLE ROW LEVEL SECURITY;

-- Policy: Solo accesso ai dati del proprio Tenant (Tenant 0) con protezione completa
CREATE POLICY tenant_isolation_contatti ON crm_contatti
FOR ALL USING (tenant_id = 0)
WITH CHECK (tenant_id = 0);

CREATE POLICY tenant_isolation_categorie ON crm_categorie
FOR ALL USING (tenant_id = 0)
WITH CHECK (tenant_id = 0);