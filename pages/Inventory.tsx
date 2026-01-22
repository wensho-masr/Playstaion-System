
import React, { useState } from 'react';
import { Package, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Drink } from '../types';

interface InventoryProps {
  drinks: Drink[];
  setDrinks: React.Dispatch<React.SetStateAction<Drink[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ drinks, setDrinks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const accentColor = 'text-blue-500 bg-blue-500/10 border-blue-500/20';

  const filteredDrinks = drinks.filter(d => d.name.includes(searchTerm));

  const updateStock = (id: string, amount: number) => {
    setDrinks(prev => prev.map(d => d.id === id ? { ...d, stock: Math.max(0, d.stock + amount) } : d));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white">المخزون</h2>
          <p className="text-gray-500 text-sm mt-1">إدارة المشاريب والكميات المتوفرة</p>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl shadow-xl transition-all font-black">
          <Plus size={20} />
          <span>إضافة منتج</span>
        </button>
      </div>

      <div className="relative group">
         <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-500 transition-colors" size={20} />
         <input 
          type="text" 
          placeholder="ابحث عن منتج..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pr-12 pl-4 text-white outline-none focus:ring-2 ring-blue-500"
         />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDrinks.map(drink => (
          <div key={drink.id} className="bg-gray-900/50 rounded-[32px] border border-gray-800 p-6 shadow-xl flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 ${drink.stock < 10 ? 'bg-red-500/10 text-red-500' : accentColor}`}>
              <Package size={30} />
            </div>
            <h3 className="text-xl font-black text-white mb-1">{drink.name}</h3>
            <p className="text-emerald-500 font-black mb-6 text-sm">{drink.price} ج.م</p>
            
            <div className="w-full bg-black/40 rounded-2xl p-4 mb-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <button onClick={() => updateStock(drink.id, -1)} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-red-500/10 text-red-500 border border-gray-700 flex items-center justify-center font-black transition-colors">-</button>
                <span className={`text-2xl font-black ${drink.stock < 10 ? 'text-red-500' : 'text-white'}`}>{drink.stock}</span>
                <button onClick={() => updateStock(drink.id, 1)} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-emerald-500/10 text-emerald-500 border border-gray-700 flex items-center justify-center font-black transition-colors">+</button>
              </div>
            </div>

            {drink.stock < 10 && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase mb-6 bg-red-500/5 px-3 py-1 rounded-full border border-red-500/10">
                <AlertCircle size={14} />
                <span>أوشك على الانتهاء</span>
              </div>
            )}

            <button className="p-3 rounded-xl bg-red-900/20 text-red-500 border border-red-500/10 hover:bg-red-900/40 mt-auto">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
