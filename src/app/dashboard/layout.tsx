import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Desktop from '@/components/dashboard/Desktop';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  async function signOut() {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
  }

  const userEmail = user.email || 'Utente';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const displayName = user.user_metadata?.full_name || userEmail.split('@')[0];

  return (
    <Desktop>
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm">Workspace</span>
          <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-sm font-medium border border-amber-400/20">
            Tenant 0 - Manipura
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-900/50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-sm font-bold">
              {userInitial}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">{displayName}</p>
              <p className="text-xs text-zinc-500">{userEmail}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 border border-zinc-800 hover:border-red-400/30 transition-colors text-sm"
              >
                Esci
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </Desktop>
  );
}