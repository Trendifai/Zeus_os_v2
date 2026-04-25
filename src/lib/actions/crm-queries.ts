'use server';

import { createClient } from '@/lib/supabase/server';

type Contatto = {
  id: string;
  nome: string | null;
  email: string | null;
  telefono: string | null;
  azienda: string | null;
  categoria_id: string | null;
  note: string | null;
  created_at: string;
};

/**
 * Fetch real contatti from Supabase with tenant_id = 0 filter
 * Ordered by created_at DESC (most recent first)
 */
export async function getCrmContatti(): Promise<Contatto[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('crm_contatti')
      .select('*')
      .eq('tenant_id', 0)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Error fetching contatti from Supabase:', err);
    throw err;
  }
}