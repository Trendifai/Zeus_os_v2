'use client';

import { createClient } from '@/lib/supabase/client';

const APP_URL = 'http://localhost:3000';

export default function HomePage() {
  const supabase = createClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${APP_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-400 mb-8">ZEUS OS</h1>
        
        <button
          onClick={handleLogin}
          className="px-8 py-4 bg-amber-400 text-zinc-950 font-bold rounded-lg hover:bg-amber-500 transition-colors"
        >
          Login Admin (Tenant 0)
        </button>
      </div>
    </div>
  );
}