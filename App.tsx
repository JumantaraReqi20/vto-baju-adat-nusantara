
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ClothingSelector } from './components/ClothingSelector';
import { TryOnStudio } from './components/TryOnStudio';
import { Footer } from './components/Footer';
import { clothingItems } from './constants';
import type { ClothingItem } from './types';

export default function App() {
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(clothingItems[0]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 font-display">Virtual Try-On Pakaian Adat</h1>
          <p className="mt-4 text-lg md:text-xl text-stone-600 max-w-3xl mx-auto">
            Unggah foto Anda, pilih Wastra Nusantara, dan lihat pesonanya menyatu dengan diri Anda melalui keajaiban AI.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <ClothingSelector
                selectedClothing={selectedClothing}
                onSelectClothing={setSelectedClothing}
              />
            </div>
            <div className="lg:col-span-8">
              <TryOnStudio selectedClothing={selectedClothing} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
