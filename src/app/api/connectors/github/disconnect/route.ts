import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    console.log('🔵 GITHUB DISCONNECT: Inizio');

    const supabase = await createClient();

    // Verifica sessione utente
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    let userId = user?.id;

    if (!userId) {
        const { data: { session } } = await supabase.auth.getSession();
        userId = session?.user?.id;
    }

    // RIPRISTINO AUTH REALE: Nessun fallback
    if (!userId) {
        console.error('🔴 GITHUB DISCONNECT: Utente non autenticato');
        return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }

    const { error } = await supabase
        .from('connectors')
        .delete()
        .eq('tenant_id', userId)
        .eq('provider', 'github');

    if (error) {
        console.error('🔴 GITHUB DISCONNECT: Errore delete:', JSON.stringify(error));
        return NextResponse.redirect(new URL('/dashboard?error=disconnect_failed', request.url));
    }

    console.log('🟢 GITHUB DISCONNECT: Rimosso per utente:', userId);
    return NextResponse.redirect(new URL('/dashboard', request.url));
}
