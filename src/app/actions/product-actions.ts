'use server'
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addCategory(name: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('raw_materials') // Usiamo temporaneamente questa o una tabella categorie specifica
        .insert([{ name, tenant_id: '0' }])
        .select();
    revalidatePath('/dashboard/products');
    return { data, error };
}

export async function createProduct(formData: any) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('products')
        .insert([{ ...formData, tenant_id: '0' }]);
    revalidatePath('/dashboard/products');
    return { error };
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    revalidatePath('/dashboard/products');
    return { error };
}
