import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeftRight, Ship, Plane, Package, Calendar, ChevronDown } from 'lucide-react';
import { SearchParams } from '../types/quotation';
import { getPortsByMode, Port } from '../data/ports';
import { getAvailableRoutes } from '../data/scheduleGenerator';

interface ScheduleSearchProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: Partial<SearchParams>;
}

interface PortInputProps {
  label: string;
  value: string;
  ports: Port[];
  onChange: (code: string) => void;
  placeholder: string;
}

const PortInput: React.FC<PortInputProps> = ({ label, value, ports, onChange, placeholder }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedPort = ports.find(p => p.code === value);

  const filtered = query.length > 0
    ? ports.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.code.toLowerCase().includes(query.toLowerCase()) ||
        p.country.toLowerCase().includes(query.toLowerCase()) ||
        p.fullName.toLowerCase().includes(query.toLowerCase())
      )
    : ports;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-sky-400 focus:border-sky-500 focus:outline-none transition-all duration-200"
      >
        <div className="text-left">
          {selectedPort ? (
            <>
              <div className="font-semibold text-gray-900 text-sm">{selectedPort.name}</div>
              <div className="text-xs text-gray-500">{selectedPort.country} · {selectedPort.code}</div>
            </>
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-72 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search port or country..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-sky-400"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-400 text-center">No ports found</div>
            ) : (
              filtered.map(port => (
                <button
                  key={port.code}
                  type="button"
                  onClick={() => { onChange(port.code); setOpen(false); setQuery(''); }}
                  className={`w-full text-left px-4 py-3 hover:bg-sky-50 transition-colors border-b border-gray-50 last:border-0 ${value === port.code ? 'bg-sky-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{port.name}</span>
                      <span className="ml-2 text-xs text-gray-400">{port.country}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{port.code}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">{port.fullName}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ScheduleSearch: React.FC<ScheduleSearchProps> = ({ onSearch, initialParams }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [direction, setDirection] = useState<'export' | 'import'>(initialParams?.direction || 'export');
  const [mode, setMode] = useState<'sea_fcl' | 'sea_lcl' | 'air'>(initialParams?.mode || 'sea_fcl');
  const [originPort, setOriginPort] = useState(initialParams?.originPort || '');
  const [destPort, setDestPort] = useState(initialParams?.destinationPort || '');
  const [etd, setEtd] = useState(initialParams?.etd || today);
  const [error, setError] = useState('');

  const indianPorts = getPortsByMode(mode, true);
  const foreignPorts = getPortsByMode(mode, false);

  const originPorts = direction === 'export' ? indianPorts : foreignPorts;
  const destPorts = direction === 'export' ? foreignPorts : indianPorts;

  const handleSwapDirection = () => {
    const newDir = direction === 'export' ? 'import' : 'export';
    setDirection(newDir);
    const temp = originPort;
    setOriginPort(destPort);
    setDestPort(temp);
  };

  const handleModeChange = (newMode: 'sea_fcl' | 'sea_lcl' | 'air') => {
    setMode(newMode);
    setOriginPort('');
    setDestPort('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!originPort) { setError('Please select origin port'); return; }
    if (!destPort) { setError('Please select destination port'); return; }
    if (!etd) { setError('Please select departure date'); return; }
    onSearch({ direction, mode, originPort, destinationPort: destPort, etd });
  };

  const routes = getAvailableRoutes(mode, direction);
  const availableOrigins = new Set(routes.map(r => r.origin));
  const availableDestinations = new Set(routes.map(r => r.destination));

  const filteredOriginPorts = originPorts.filter(p => availableOrigins.has(p.code));
  const filteredDestPorts = destPorts.filter(p => {
    if (!originPort) return availableDestinations.has(p.code);
    return routes.some(r => r.origin === originPort && r.destination === p.code);
  });

  return (
    <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Search Online Schedules</h2>
          <p className="text-sky-300 text-sm mt-0.5">Find the best freight rates from India</p>
        </div>
        <div className="flex gap-1 bg-white/10 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setDirection('export')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${direction === 'export' ? 'bg-sky-500 text-white shadow' : 'text-sky-200 hover:text-white'}`}
          >
            Export
          </button>
          <button
            type="button"
            onClick={() => setDirection('import')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${direction === 'import' ? 'bg-sky-500 text-white shadow' : 'text-sky-200 hover:text-white'}`}
          >
            Import
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {[
          { key: 'sea_fcl', icon: Ship, label: 'Sea FCL' },
          { key: 'sea_lcl', icon: Package, label: 'Sea LCL' },
          { key: 'air', icon: Plane, label: 'Air' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleModeChange(key as 'sea_fcl' | 'sea_lcl' | 'air')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === key
                ? 'bg-white text-sky-800 shadow-lg'
                : 'bg-white/10 text-sky-200 hover:bg-white/20 border border-white/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
          <div className="md:col-span-3">
            <PortInput
              label={direction === 'export' ? 'Origin Port (India)' : 'Origin Port'}
              value={originPort}
              ports={filteredOriginPorts.length > 0 ? filteredOriginPorts : originPorts}
              onChange={setOriginPort}
              placeholder={`Select ${direction === 'export' ? 'Indian' : 'foreign'} port`}
            />
          </div>

          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwapDirection}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all border border-white/20 text-white mb-6"
              title="Swap Origin/Destination"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-3">
            <PortInput
              label={direction === 'export' ? 'Destination Port' : 'Destination Port (India)'}
              value={destPort}
              ports={filteredDestPorts.length > 0 ? filteredDestPorts : destPorts}
              onChange={setDestPort}
              placeholder={`Select ${direction === 'export' ? 'foreign' : 'Indian'} port`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-sky-300 uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              Departure Date (ETD)
            </label>
            <input
              type="date"
              value={etd}
              min={today}
              onChange={e => setEtd(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-sky-400 focus:border-sky-500 focus:outline-none text-gray-900 font-semibold"
            />
          </div>

          <div className="md:col-span-2">
            {error && (
              <p className="text-red-300 text-sm mb-2 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-sky-500/25 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              Search Schedules
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ScheduleSearch;
