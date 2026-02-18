import React, { useState } from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { Schedule, CargoDetails as CargoDetailsType, ContainerType } from '../types/quotation';

interface CargoDetailsProps {
  schedule: Schedule;
  onNext: (cargo: CargoDetailsType) => void;
  onBack: () => void;
}

const CONTAINER_TYPES_FCL: ContainerType[] = ['20GP', '40GP', '40HC', '45HC'];
const INCOTERMS = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

const CargoDetails: React.FC<CargoDetailsProps> = ({ schedule, onNext, onBack }) => {
  const isAir = schedule.mode === 'air';
  const isLCL = schedule.mode === 'sea_lcl';
  const isFCL = schedule.mode === 'sea_fcl';

  const defaultContainerType: ContainerType = isAir ? 'AIR' : isLCL ? 'LCL' : '20GP';

  const [containerType, setContainerType] = useState<ContainerType>(defaultContainerType);
  const [quantity, setQuantity] = useState(1);
  const [commodity, setCommodity] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [volumeCbm, setVolumeCbm] = useState('');
  const [incoterm, setIncoterm] = useState('FOB');
  const [hsCode, setHsCode] = useState('');
  const [isDangerous, setIsDangerous] = useState(false);
  const [isRefrigerated, setIsRefrigerated] = useState(false);
  const [error, setError] = useState('');

  const selectedRate = schedule.freightRates.find(r => r.containerType === containerType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!commodity.trim()) { setError('Please enter commodity description'); return; }
    if (!weightKg || parseFloat(weightKg) <= 0) { setError('Please enter cargo weight'); return; }
    if ((isAir || isLCL) && (!volumeCbm || parseFloat(volumeCbm) <= 0)) {
      setError('Please enter cargo volume'); return;
    }

    onNext({
      containerType,
      quantity: isFCL ? quantity : 1,
      commodity,
      weightKg: parseFloat(weightKg),
      volumeCbm: parseFloat(volumeCbm || '0'),
      incoterm,
      hsCode,
      isDangerous,
      isRefrigerated,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Cargo Details</h3>
              <p className="text-slate-300 text-sm">
                {schedule.originPortName} → {schedule.destinationPortName} · {schedule.carrierName}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {isFCL && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Container Type</label>
              <div className="grid grid-cols-4 gap-2">
                {CONTAINER_TYPES_FCL.map(ct => {
                  const rate = schedule.freightRates.find(r => r.containerType === ct);
                  return (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => setContainerType(ct)}
                      disabled={!rate}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        containerType === ct
                          ? 'border-sky-500 bg-sky-50 shadow-sm'
                          : rate
                          ? 'border-gray-200 hover:border-sky-300 bg-white'
                          : 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-bold text-gray-900 text-sm">{ct}</div>
                      {rate && (
                        <div className="text-xs text-sky-600 mt-0.5 font-semibold">
                          ${rate.amount.toLocaleString()}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isFCL && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Containers
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-sky-400 flex items-center justify-center text-gray-600 font-bold text-lg transition-all"
                >−</button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={50}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center px-3 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900 focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(50, quantity + 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-sky-400 flex items-center justify-center text-gray-600 font-bold text-lg transition-all"
                >+</button>
                <span className="text-sm text-gray-500">{containerType} containers</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Commodity Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={commodity}
                onChange={e => setCommodity(e.target.value)}
                placeholder="e.g. Textiles, Auto Parts, Electronics"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">HS Code</label>
              <input
                type="text"
                value={hsCode}
                onChange={e => setHsCode(e.target.value)}
                placeholder="e.g. 6204.31.00"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gross Weight (KG) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={e => setWeightKg(e.target.value)}
                placeholder="Total gross weight in KG"
                min="0.1"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Volume (CBM) {(isAir || isLCL) && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                value={volumeCbm}
                onChange={e => setVolumeCbm(e.target.value)}
                placeholder="Total volume in CBM"
                min="0.01"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Incoterm</label>
            <div className="grid grid-cols-5 gap-2">
              {INCOTERMS.map(it => (
                <button
                  key={it}
                  type="button"
                  onClick={() => setIncoterm(it)}
                  className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    incoterm === it
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-200 text-gray-600 hover:border-sky-300'
                  }`}
                >
                  {it}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsDangerous(!isDangerous)}
                className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${isDangerous ? 'bg-red-500 border-red-500' : 'border-gray-300 hover:border-red-400'}`}
              >
                {isDangerous && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-sm text-gray-700">Dangerous Goods (IMO/DG)</span>
            </label>
            {!isAir && (
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setIsRefrigerated(!isRefrigerated)}
                  className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${isRefrigerated ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}
                >
                  {isRefrigerated && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm text-gray-700">Refrigerated / Reefer</span>
              </label>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Back to Results
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              Get Quotation <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargoDetails;
