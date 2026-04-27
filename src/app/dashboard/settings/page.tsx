'use client'

import { Building2, Gavel, BadgePercent, Landmark, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Field = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">{label}</label>
    <div className="flex gap-2">
      <Input className="bg-zinc-950 border-zinc-900 focus:border-amber-500/40 text-sm h-10" placeholder={placeholder} />
      <Button variant="outline" className="border-zinc-900 text-amber-500 h-10 w-10 p-0 hover:bg-amber-500/5">+</Button>
    </div>
  </div>
);

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 border-l-4 border-amber-500 pl-4">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        <h2 className="text-4xl font-black text-zinc-100 uppercase tracking-tighter">Engine Room</h2>
      </div>

      <Tabs defaultValue="societa">
        <TabsList className="bg-zinc-900/50 border border-zinc-800 h-12 p-1">
          <TabsTrigger value="societa" className="text-[10px] font-bold uppercase">Società</TabsTrigger>
          <TabsTrigger value="fiscale" className="text-[10px] font-bold uppercase">Fiscale</TabsTrigger>
          <TabsTrigger value="commerciale" className="text-[10px] font-bold uppercase">Commerciale</TabsTrigger>
          <TabsTrigger value="finanza" className="text-[10px] font-bold uppercase">Finanza</TabsTrigger>
        </TabsList>

        <TabsContent value="societa" className="grid grid-cols-1 gap-6 pt-6">
          <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Ragione Sociale" placeholder="Manipura Studio" />
            <Field label="Stato Giuridico" placeholder="SUARL" />
            <Field label="Indirizzo" placeholder="Via..." />
            <Field label="Social" placeholder="Instagram..." />
          </div>
        </TabsContent>

        <TabsContent value="fiscale" className="pt-6">
          <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Matricola Fiscale" placeholder="000XXXX" />
            <Field label="Codice RNE" placeholder="..." />
            <Field label="Codice Dogana" placeholder="..." />
          </div>
        </TabsContent>

        <TabsContent value="commerciale" className="pt-6">
          <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Numerazione Doc" placeholder="2026/001" />
            <Field label="Condizioni Pagamento" placeholder="30gg FM" />
            <Field label="Sconto Max" placeholder="15%" />
          </div>
        </TabsContent>

        <TabsContent value="finanza" className="pt-6">
          <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Banca" placeholder="Attijari" />
            <Field label="IBAN" placeholder="TN59..." />
            <Field label="SWIFT" placeholder="..." />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}