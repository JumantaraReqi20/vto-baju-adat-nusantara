
import React from 'react';
import { clothingItems } from '../constants';
import type { ClothingItem } from '../types';

interface ClothingSelectorProps {
  selectedClothing: ClothingItem | null;
  onSelectClothing: (item: ClothingItem) => void;
}

export const ClothingSelector: React.FC<ClothingSelectorProps> = ({
  selectedClothing,
  onSelectClothing,
}) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold font-display mb-4 text-stone-800">Pilih Pakaian Adat</h2>
      <div className="space-y-3 pr-2 overflow-y-auto max-h-[600px] lg:max-h-none">
        {clothingItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectClothing(item)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ease-in-out flex items-center space-x-4 ${
              selectedClothing?.id === item.id
                ? 'bg-amber-100 border-amber-600 shadow-md'
                : 'bg-stone-50 border-stone-200 hover:border-amber-500 hover:bg-amber-50'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-grow">
              <h3 className="font-semibold text-stone-900">{item.name}</h3>
              <p className="text-sm text-stone-500">{item.origin}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
