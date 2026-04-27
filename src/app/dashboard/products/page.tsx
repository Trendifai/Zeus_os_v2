'use client'
import { useState, useEffect } from 'react';
import { DynamicField } from '@/components/dashboard/DynamicField';
import { generateIntelligentSKU } from '@/lib/utils/sku-generator';
import { createProduct, deleteProduct } from '@/app/actions/product-actions';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Package } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [liters, setLiters] = useState(3);
    const supabase = createClient();

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            setProducts(data || []);
        };
        fetchProducts();
    }, [supabase]);

    const handleSave = async () => {
        const sku = generateIntelligentSKU(name, category, liters);
        const { error } = await createProduct({ name, category, volume_liters: liters, sku });
        if (!error) {
            window.location.reload();
        }
    };

    return (
        <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-zinc-200">
            <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
                <h1 className="text-2xl font-black text-amber-500 tracking-tighter uppercase">Gestione Prodotti Manipura</h1>
                <Package className="text-amber-500/50" size={32} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form di Inserimento */}
                <div className="md:col-span-1 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-xl space-y-4">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Aggiungi Prodotto</h2>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Nome Prodotto</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-zinc-950 border-zinc-800 focus:border-amber-500" placeholder="Es: Lessive Marseille" />
                    </div>
                    <DynamicField
                        label="Categoria"
                        options={[{ id: 1, name: 'Lessives' }, { id: 2, name: 'Maison' }]}
                        value={category}
                        onChange={setCategory}
                        onAddClick={() => alert('Aggiunta categoria non ancora implementata - usa SQL per ora')}
                    />
                    <Button onClick={handleSave} className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold uppercase py-6 shadow-[0_0_20px_rgba(255,191,0,0.2)]">
                        Salva Prodotto
                    </Button>
                </div>

                {/* Lista Prodotti Navigabile */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Inventario Attivo</h2>
                    {products.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-900/20">
                            Nessun prodotto in magazzino.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {products.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-zinc-200">{p.name} <span className="text-amber-500 text-xs ml-2 bg-amber-500/10 px-2 py-0.5 rounded-full">{p.sku}</span></span>
                                        <span className="text-[10px] uppercase text-zinc-500 tracking-widest mt-1">
                                            {p.category} | {p.volume_liters}L
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id).then(() => window.location.reload())} className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
