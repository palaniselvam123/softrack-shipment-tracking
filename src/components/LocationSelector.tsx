import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Plane, Ship, Building, X } from 'lucide-react';
import { portsAndCities, searchPorts, formatPortDisplay, Port } from '../data/portsAndCities';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  transportMode?: 'sea' | 'air' | 'road' | 'all';
  label?: string;
  required?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  placeholder = "Search for port, airport, or city...",
  transportMode = 'all',
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPorts, setFilteredPorts] = useState<Port[]>([]);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isValidSelection, setIsValidSelection] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find selected port based on current value
    const port = portsAndCities.find(p => formatPortDisplay(p) === value);
    setSelectedPort(port || null);
    setIsValidSelection(!!port || value === '');
    
    // If there's a value but no matching port, it's invalid
    if (value && !port) {
      setIsValidSelection(false);
    }
  }, [value]);

  useEffect(() => {
    let results = searchQuery ? searchPorts(searchQuery) : portsAndCities;
    
    // Filter by transport mode
    if (transportMode !== 'all') {
      if (transportMode === 'sea') {
        results = results.filter(port => port.type === 'seaport' || port.type === 'city');
      } else if (transportMode === 'air') {
        results = results.filter(port => port.type === 'airport' || port.type === 'city');
      } else if (transportMode === 'road') {
        results = results.filter(port => port.type === 'city');
      }
    }
    
    // Sort by relevance and limit results
    setFilteredPorts(results.slice(0, 20));
    setHighlightedIndex(-1);
  }, [searchQuery, transportMode]);

  const handlePortSelect = (port: Port) => {
    const displayValue = formatPortDisplay(port);
    onChange(displayValue);
    setSelectedPort(port);
    setSearchQuery('');
    setIsOpen(false);
    setIsValidSelection(true);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);
    
    // If input is cleared, clear the selection
    if (inputValue === '') {
      onChange('');
      setSelectedPort(null);
      setIsValidSelection(true);
    } else {
      // Check if the input matches any port exactly
      const exactMatch = portsAndCities.find(p => 
        formatPortDisplay(p).toLowerCase() === inputValue.toLowerCase()
      );
      
      if (exactMatch) {
        setSelectedPort(exactMatch);
        setIsValidSelection(true);
      } else {
        setSelectedPort(null);
        setIsValidSelection(false);
      }
    }
    
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // If there's a selected port, show its name in search for editing
    if (selectedPort && !searchQuery) {
      setSearchQuery(selectedPort.name);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't close if clicking on dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setTimeout(() => {
      setIsOpen(false);
      
      // If no valid selection and there's text, clear it
      if (!isValidSelection && searchQuery) {
        setSearchQuery('');
        onChange('');
        setSelectedPort(null);
      } else if (selectedPort) {
        // Reset search query to show selected port display
        setSearchQuery('');
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredPorts.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredPorts.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredPorts[highlightedIndex]) {
          handlePortSelect(filteredPorts[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  const clearSelection = () => {
    onChange('');
    setSelectedPort(null);
    setSearchQuery('');
    setIsValidSelection(true);
    inputRef.current?.focus();
  };

  const getPortIcon = (port: Port) => {
    switch (port.type) {
      case 'seaport':
        return <Ship className="w-4 h-4 text-blue-600" />;
      case 'airport':
        return <Plane className="w-4 h-4 text-pink-600" />;
      case 'city':
        return <Building className="w-4 h-4 text-green-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPortTypeLabel = (type: string) => {
    switch (type) {
      case 'seaport':
        return 'Port';
      case 'airport':
        return 'Airport';
      case 'city':
        return 'City';
      default:
        return '';
    }
  };

  const displayValue = isOpen ? searchQuery : (selectedPort ? formatPortDisplay(selectedPort) : '');

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {selectedPort ? getPortIcon(selectedPort) : <Search className="w-4 h-4 text-gray-400" />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            !isValidSelection && value ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          required={required}
          autoComplete="off"
        />

        {selectedPort && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isValidSelection && value && (
        <p className="mt-1 text-sm text-red-600">
          Please select a valid location from the dropdown
        </p>
      )}

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredPorts.length > 0 ? (
            <div className="py-1">
              {filteredPorts.map((port, index) => (
                <button
                  key={port.code}
                  type="button"
                  onClick={() => handlePortSelect(port)}
                  className={`w-full px-4 py-2 text-left focus:outline-none ${
                    index === highlightedIndex 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'hover:bg-gray-100 focus:bg-gray-100'
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex items-center space-x-3">
                    {getPortIcon(port)}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {port.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {port.city}, {port.country} • {getPortTypeLabel(port.type)} • {port.code}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              {searchQuery ? `No locations found matching "${searchQuery}"` : 'Start typing to search locations...'}
            </div>
          )}
          
          {searchQuery && filteredPorts.length > 0 && (
            <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-200">
              {filteredPorts.length} location{filteredPorts.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;