'use client'
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DynamicField({ label, options, onAddClick, value, onChange }: any) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{label}</label>
            <div className="flex gap-2">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md p-2 text-zinc-300 focus:border-amber-500/50 outline-none h-10"
                >
                    <option value="">Seleziona...</option>
                    {options.map((opt: any) => (
                        <option key={opt.id} value={opt.name}>{opt.name}</option>
                    ))}
                </select>
                <Button
                    type="button"
                    onClick={onAddClick}
                    className="bg-zinc-900 border border-amber-500/20 text-amber-500 hover:bg-amber-500/10 h-10 w-10 p-0"
                >
                    <Plus size={18} />
                </Button>
            </div>
        </div>
    );
}
