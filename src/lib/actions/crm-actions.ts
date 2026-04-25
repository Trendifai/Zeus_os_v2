'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Elimina un contatto forzando tenant_id = 0 per sicurezza RLS
 */
export async function deleteCrmContact(id: string) {
  try {
    const supabase = await createClient();
    
    // Elimina il contatto con controllo sul tenant_id per sicurezza
    const { error } = await supabase
      .from('crm_contatti')
      .delete()
      .match({ id, tenant_id: 0 }); // Forziamo tenant_id = 0
    
    if (error) {
      console.error('Errore eliminazione contatto:', error);
      return { success: false, error: error.message };
    }
    
    // Revalidate the contacts path to refresh the UI
    revalidatePath('/contatti');
    
    return { success: true };
  } catch (err) {
    console.error('Errore interno eliminazione contatto:', err);
    return { success: false, error: 'Errore interno durante l\'eliminazione' };
  }
}