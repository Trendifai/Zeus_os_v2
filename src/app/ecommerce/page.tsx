'use client';

import { useState } from 'react';
import { fetchProducts } from '@/app/ecommerce/actions';

export default function EcommercePage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await fetchProducts(query);
      setProducts(result);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 flex gap-6">
      {/* Left Column: Chat Assistant */}
      <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800/50">
        <h2 className="text-xl font-bold mb-4 text-amber-400">Assistant AI</h2>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Descrivi il tuo problema..."
            className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-zinc-950 font-semibold px-4 py-2 rounded transition"
          >
            Cerca
          </button>
        </form>
        {loading && <p className="text-amber-200">Ricerca in corso...</p>}
        {!loading && query && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Prodotti consigliati:</h3>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-800/50 p-3 rounded border border-zinc-700">
                  <h4 className="text-amber-300">{product.name}</h4>
                  <p className="text-zinc-300 text-sm">{product.description}</p>
                  <p className="text-amber-400 font-medium">€{product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-2 bg-amber-600 hover:bg-amber-700 text-zinc-950 font-semibold px-3 py-1 rounded transition"
                  >
                    Aggiungi al carrello
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Live Cart */}
      <div className="w-80 bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800/50">
        <h2 className="text-xl font-bold mb-4 text-amber-400">Carrello</h2>
        {cart.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Il carrello è vuoto</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-zinc-800/50 p-3 rounded border border-zinc-700 flex items-center space-x-3">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-amber-300">{item.name}</h4>
                    <p className="text-zinc-300 text-sm">€{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-700">
              <p className="font-bold text-amber-300">
                Totale: €{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </p>
              <button
                className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-zinc-950 font-semibold py-2 rounded transition"
              >
                Procedi al pagamento
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}