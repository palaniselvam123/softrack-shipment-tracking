import React from 'react';
import { Plus, X, Package, ChevronDown, Weight, Boxes, Cuboid as Cube } from 'lucide-react';
import { BookingData, cargoTypes } from './bookingData';

interface Props {
  data: BookingData;
  onChange: (field: string, value: unknown) => void;
}

export default function StepCargo({ data, onChange }: Props) {
  const addGoods = () => {
    onChange('goods', [...data.goods, { id: Date.now().toString(), description: '', packages: 0, weight: 0, volume: 0 }]);
  };

  const updateGoods = (id: string, field: string, value: unknown) => {
    onChange('goods', data.goods.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const removeGoods = (id: string) => {
    onChange('goods', data.goods.filter(g => g.id !== id));
  };

  const totalPackages = data.goods.reduce((s, g) => s + g.packages, 0);
  const totalWeight = data.goods.reduce((s, g) => s + g.weight, 0);
  const totalVolume = data.goods.reduce((s, g) => s + g.volume, 0);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo Type</label>
        <div className="relative max-w-md">
          <select
            value={data.cargoType}
            onChange={e => onChange('cargoType', e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 appearance-none transition-colors"
          >
            <option value="">Select cargo type</option>
            {cargoTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Goods Items</h3>
          <button
            onClick={addGoods}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {data.goods.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500 font-medium">No goods added yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-5">Click "Add Item" to describe the cargo</p>
            <button onClick={addGoods} className="px-5 py-2.5 bg-sky-50 text-sky-600 rounded-xl text-sm font-semibold hover:bg-sky-100 transition-colors border border-sky-200">
              <Plus className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Add First Item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.goods.map((item, idx) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase">Item {idx + 1}</span>
                  <button onClick={() => removeGoods(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => updateGoods(item.id, 'description', e.target.value)}
                      placeholder="Describe the goods"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      <Boxes className="w-3 h-3 inline-block mr-1 -mt-0.5" />Packages
                    </label>
                    <input
                      type="number"
                      value={item.packages || ''}
                      onChange={e => updateGoods(item.id, 'packages', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      <Weight className="w-3 h-3 inline-block mr-1 -mt-0.5" />Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={item.weight || ''}
                      onChange={e => updateGoods(item.id, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}

            {data.goods.length > 0 && (
              <div className="flex items-center justify-end gap-6 px-5 py-3 bg-gray-50 rounded-xl text-xs font-semibold text-gray-500">
                <span>Total: <span className="text-gray-900">{totalPackages}</span> pkgs</span>
                <span>|</span>
                <span><span className="text-gray-900">{totalWeight.toLocaleString()}</span> kg</span>
                <span>|</span>
                <span><span className="text-gray-900">{totalVolume.toFixed(2)}</span> cbm</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
