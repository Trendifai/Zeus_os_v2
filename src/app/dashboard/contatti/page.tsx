export const dynamic = 'force-dynamic';

import { getCrmContatti } from '@/lib/actions/crm-queries';
import ContattiClient from './ContattiClient';

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

export default async function ContattiPage() {
  // Fetch real data from Supabase on server
  const contatti: Contatto[] = await getCrmContatti();
    
  // Pass data to client component
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <ContattiClient initialContatti={contatti} onContattiUpdate={async () => {}} />
    </div>
  );
}