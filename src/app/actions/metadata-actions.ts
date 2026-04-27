'use server'
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function quickAddMetadata(table: string, name: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from(table).insert([{ name, tenant_id: '0' }]).select();
    revalidatePath('/dashboard/products');
    return { data, error };
}
