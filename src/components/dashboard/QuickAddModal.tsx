'use client'
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuickAddModal({ isOpen, onClose, onAdd, title }: any) {
    const [value, setValue] = useState('');
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border border-amber-500/30 text-zinc-200">
                <DialogHeader><DialogTitle className="text-amber-500 uppercase text-sm tracking-widest">{title}</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-4">
                    <Input value={value} onChange={(e) => setValue(e.target.value)} className="bg-zinc-900 border-zinc-800" placeholder="Inserisci valore..." />
                    <Button onClick={() => { onAdd(value); setValue(''); onClose(); }} className="w-full bg-amber-500 text-zinc-950 font-bold uppercase">Conferma Aggiunta</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
