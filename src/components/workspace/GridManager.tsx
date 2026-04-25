'use client';

import { useState, DragEvent } from 'react';
import { GripVertical, Plus } from 'lucide-react';

export interface ContextTile {
  id: string;
  title: string;
  type: 'crm' | 'produzione' | 'wiki' | 'contatti' | 'empty';
  colSpan?: number;
  rowSpan?: number;
}

export interface GridItem {
  id: string;
  tile: ContextTile | null;
}

const defaultTiles: ContextTile[] = [
   { id: '1', title: 'Contatti', type: 'contatti' },
  { id: '2', title: 'Produzione', type: 'produzione' },
  { id: '3', title: 'Wiki', type: 'wiki' },
];

export default function GridManager() {
  const [tiles, setTiles] = useState<ContextTile[]>(defaultTiles);
  const [draggedTile, setDraggedTile] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, tileId: string) => {
    setDraggedTile(tileId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTile || draggedTile === targetId) return;

    setTiles(prev => {
      const newTiles = [...prev];
      const dragIndex = newTiles.findIndex(t => t.id === draggedTile);
      const dropIndex = newTiles.findIndex(t => t.id === targetId);
      
      if (dragIndex !== -1 && dropIndex !== -1) {
        const [removed] = newTiles.splice(dragIndex, 1);
        newTiles.splice(dropIndex, 0, removed);
      }
      
      return newTiles;
    });
    
    setDraggedTile(null);
  };

  const getTileTypeStyles = (type: ContextTile['type']) => {
    switch (type) {
      case 'crm':
        return 'border-amber-500/20 bg-amber-500/5';
      case 'produzione':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'wiki':
        return 'border-purple-500/20 bg-purple-500/5';
      default:
        return 'border-zinc-800/40 bg-zinc-900/50';
    }
  };

  const getTileTypeAccent = (type: ContextTile['type']) => {
    switch (type) {
      case 'crm':
        return 'text-amber-500';
      case 'produzione':
        return 'text-blue-400';
      case 'wiki':
        return 'text-purple-400';
      default:
        return 'text-zinc-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Context Tiles</h2>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-amber-500 hover:bg-zinc-900/50 border border-zinc-800/40 transition-colors">
          <Plus className="w-4 h-4" />
          Aggiungi Tile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            draggable
            onDragStart={(e) => handleDragStart(e, tile.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tile.id)}
            className={`
              group relative rounded-xl border backdrop-blur-sm transition-all duration-200
              ${getTileTypeStyles(tile.type)}
              ${draggedTile === tile.id ? 'opacity-50 scale-95' : 'hover:border-zinc-700/50'}
              aspect-video
            `}
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />
            </div>

            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${getTileTypeAccent(tile.type).replace('text-', 'bg-')}`} />
                <span className={`text-xs font-medium uppercase tracking-wider ${getTileTypeAccent(tile.type)}`}>
                  {tile.type}
                </span>
              </div>
              
              <h3 className="text-base font-medium text-zinc-100">{tile.title}</h3>
              
              <p className="text-xs text-zinc-500 mt-auto">
                Trascina per riordinare
              </p>
            </div>
          </div>
        ))}

        {[...Array(3 - tiles.length)].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="rounded-xl border border-dashed border-zinc-800/40 bg-zinc-900/20 backdrop-blur-sm aspect-video flex items-center justify-center"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-600">Slot vuoto</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}