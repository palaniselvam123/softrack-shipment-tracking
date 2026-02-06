import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Search, Download, Filter, Settings, Ship, Plane, Truck, MapPin, Globe, List, Eye, ArrowLeft, ZoomIn } from 'lucide-react';
import { mockShipments } from '../data/mockData';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ShipmentsMapViewProps {
  onViewShipment: (shipmentNo: string) => void;
}

// Country center coordinates for grouping
const countryCoordinates: { [key: string]: [number, number] } = {
  'IN': [20.5937, 78.9629], // India
  'US': [39.8283, -98.5795], // United States
  'DE': [51.1657, 10.4515], // Germany
  'AE': [23.4241, 53.8478], // UAE
  'VN': [14.0583, 108.2772], // Vietnam
  'BE': [50.5039, 4.4699], // Belgium
  'FR': [46.2276, 2.2137], // France
  'SG': [1.3521, 103.8198], // Singapore
  'HK': [22.3193, 114.1694], // Hong Kong
  'CN': [35.8617, 104.1954], // China
  'JP': [36.2048, 138.2529], // Japan
  'KR': [35.9078, 127.7669], // South Korea
  'AU': [-25.2744, 133.7751], // Australia
  'BR': [-14.2350, -51.9253], // Brazil
  'CL': [-35.6751, -71.5430], // Chile
  'ZA': [-30.5595, 22.9375], // South Africa
  'EG': [26.0975, 30.0444], // Egypt
  'TH': [15.8700, 100.9925], // Thailand
  'MY': [4.2105, 101.9758], // Malaysia
  'ID': [-0.7893, 113.9213], // Indonesia
  'BD': [23.6850, 90.3563], // Bangladesh
  'LK': [7.8731, 80.7718], // Sri Lanka
  'GB': [55.3781, -3.4360], // United Kingdom
  'NL': [52.1326, 5.2913], // Netherlands
  'IT': [41.8719, 12.5674], // Italy
  'QA': [25.3548, 51.1839], // Qatar
  'KW': [29.3117, 47.4818] // Kuwait
};

// Location coordinates mapping
const locationCoordinates: { [key: string]: [number, number] } = {
  // India
  'Mumbai': [19.0760, 72.8777],
  'Nhava Sheva': [18.9480, 72.9500],
  'Nhava Sheva Port': [18.9480, 72.9500],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Delhi': [28.7041, 77.1025],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Kochi': [9.9312, 76.2673],
  'Kandla': [23.0333, 70.2167],
  'Chhatrapati Shivaji Airport': [19.0896, 72.8656],
  'Indira Gandhi Airport': [28.5562, 77.1000],
  'Chennai Airport': [12.9941, 80.1709],
  'Kempegowda Airport': [13.1986, 77.7066],
  'Rajiv Gandhi International Airport': [17.2403, 78.4294],
  
  // International
  'New York': [40.7128, -74.0060],
  'New York Port': [40.6892, -74.0445],
  'John F Kennedy Airport': [40.6413, -73.7781],
  'Hamburg': [53.5511, 9.9937],
  'Hamburg Port': [53.5438, 9.9739],
  'Dubai': [25.2048, 55.2708],
  'Dubai International Airport': [25.2532, 55.3657],
  'Hanoi': [21.0285, 105.8542],
  'Noi Bai International Airport': [21.2187, 105.8072],
  'Brussels': [50.8503, 4.3517],
  'Brussels Airport': [50.9010, 4.4844],
  'Frankfurt': [50.1109, 8.6821],
  'Frankfurt Airport': [50.0379, 8.5622],
  'Dhaka': [23.8103, 90.4125],
  'Hazrat Shahjalal Airport': [23.8433, 90.3978],
  'Santos': [23.9608, 46.3331],
  'Santos Port': [23.9608, 46.3331],
  'London': [51.5074, -0.1278],
  'Heathrow Airport': [51.4700, -0.4543],
  'Paris': [48.8566, 2.3522],
  'Charles de Gaulle Airport': [49.0097, 2.5479],
  'Singapore': [1.3521, 103.8198],
  'Singapore Changi Airport': [1.3644, 103.9915],
  'Port of Singapore': [1.2966, 103.8591],
  'Rotterdam': [51.9244, 4.4777],
  'Port of Rotterdam': [51.9244, 4.4777],
  'Los Angeles': [34.0522, -118.2437],
  'Port of Los Angeles': [33.7361, -118.2644],
  'Los Angeles International Airport': [33.9425, -118.4081],
  'Sydney': [-33.8688, 151.2093],
  'Sydney Kingsford Smith Airport': [-33.9399, 151.1753],
  'Port of Sydney': [-33.8688, 151.2093],
  'Perth': [-31.9505, 115.8605],
  'East Perth': [-31.9505, 115.8605],
  'Perth Airport': [-31.9403, 115.9669],
  'Port of Fremantle': [-32.0569, 115.7439],
  
  // Additional locations from mock data
  'Ho Chi Minh City': [10.8231, 106.6297],
  'Tan Son Nhat International Airport': [10.8188, 106.6519],
  'Melbourne': [-37.8136, 144.9631],
  'Melbourne Airport': [-37.6690, 144.8410],
  'Port of Melbourne': [-37.8136, 144.9631]
};

const ShipmentsMapView: React.FC<ShipmentsMapViewProps> = ({ onViewShipment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFilters, setShowFilters] = useState(false);
  const [mapView, setMapView] = useState<'country' | 'location'>('country');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [mapRef, setMapRef] = useState<any>(null);

  // Extract location from address string
  const extractLocation = (address: string): string => {
    const parts = address.split(',');
    let location = parts[0].trim();
    
    // Handle specific location patterns
    if (location.includes('Airport')) {
      return location;
    }
    if (location.includes('Port')) {
      return location;
    }
    
    // For locations like "Nhava Sheva Port, MH" - keep the port name
    if (parts.length > 1 && parts[1].trim().length <= 3) {
      return location;
    }
    
    return location;
  };

  // Get coordinates for a location
  const getCoordinates = (location: string): [number, number] | null => {
    const cleanLocation = extractLocation(location);
    
    // Try exact match first
    if (locationCoordinates[cleanLocation]) {
      return locationCoordinates[cleanLocation];
    }
    
    // Try partial matches for common variations
    const locationKeys = Object.keys(locationCoordinates);
    const partialMatch = locationKeys.find(key => 
      key.toLowerCase().includes(cleanLocation.toLowerCase()) ||
      cleanLocation.toLowerCase().includes(key.toLowerCase())
    );
    
    if (partialMatch) {
      return locationCoordinates[partialMatch];
    }
    
    console.warn(`No coordinates found for location: ${cleanLocation}`);
    return null;
  };

  // Get country code from address
  const getCountryCode = (address: string): string => {
    const parts = address.split(',');
    const countryPart = parts[parts.length - 1]?.trim();
    
    // Map country names/codes to standardized codes
    const countryMap: { [key: string]: string } = {
      'IN': 'IN', 'India': 'IN',
      'US': 'US', 'USA': 'US', 'United States': 'US',
      'DE': 'DE', 'Germany': 'DE',
      'AE': 'AE', 'UAE': 'AE', 'United Arab Emirates': 'AE',
      'VN': 'VN', 'Vietnam': 'VN',
      'BE': 'BE', 'Belgium': 'BE',
      'FR': 'FR', 'France': 'FR',
      'AU': 'AU', 'Australia': 'AU',
      'BR': 'BR', 'Brazil': 'BR',
      'GB': 'GB', 'UK': 'GB', 'United Kingdom': 'GB',
      'NL': 'NL', 'Netherlands': 'NL',
      'SG': 'SG', 'Singapore': 'SG',
      'HK': 'HK', 'Hong Kong': 'HK',
      'CN': 'CN', 'China': 'CN',
      'JP': 'JP', 'Japan': 'JP'
    };
    
    return countryMap[countryPart] || countryPart;
  };

  // Group shipments by country or location based on current view
  const groupedShipments = useMemo(() => {
    console.log('Recalculating groupedShipments with:', { mapView, selectedCountryCode, searchTerm });
    
    const filtered = mockShipments.filter(shipment => {
      const matchesSearch = Object.values(shipment).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesCountry = !selectedCountry || 
        shipment.departure.toLowerCase().includes(selectedCountry.toLowerCase()) ||
        shipment.arrivalPort.toLowerCase().includes(selectedCountry.toLowerCase());
      const matchesTransport = !selectedTransport || 
        shipment.transport.toLowerCase() === selectedTransport.toLowerCase();
      const matchesStatus = !selectedStatus || 
        shipment.status.toLowerCase().includes(selectedStatus.toLowerCase());

      return matchesSearch && matchesCountry && matchesTransport && matchesStatus;
    });

    console.log('Filtered shipments count:', filtered.length);
    if (mapView === 'country') {
      console.log('Grouping by country');
      // Group by country
      const grouped: { [key: string]: any[] } = {};
      
      filtered.forEach(shipment => {
        const originCountry = getCountryCode(shipment.departure);
        const destCountry = getCountryCode(shipment.arrivalPort);
        
        // Group by origin country
        if (!grouped[originCountry]) {
          grouped[originCountry] = [];
        }
        grouped[originCountry].push({ ...shipment, locationType: 'origin' });
        
        // Group by destination country (if different from origin)
        if (destCountry !== originCountry) {
          if (!grouped[destCountry]) {
            grouped[destCountry] = [];
          }
          grouped[destCountry].push({ ...shipment, locationType: 'destination' });
        }
      });
      
      console.log('Country grouped result:', Object.keys(grouped));
      return grouped;
    } else {
      console.log('Grouping by location for country:', selectedCountryCode);
      // Group by specific locations (when drilled down)
      const grouped: { [key: string]: any[] } = {};
      
      const countryFiltered = selectedCountryCode ? 
        filtered.filter(shipment => 
          getCountryCode(shipment.departure) === selectedCountryCode ||
          getCountryCode(shipment.arrivalPort) === selectedCountryCode
        ) : filtered;
      
      console.log('Country filtered shipments:', countryFiltered.length);
      countryFiltered.forEach(shipment => {
        const originLocation = extractLocation(shipment.departure);
        const destLocation = extractLocation(shipment.arrivalPort);
        
        // Only show locations from selected country
        if (!selectedCountryCode || getCountryCode(shipment.departure) === selectedCountryCode) {
          if (!grouped[originLocation]) {
            grouped[originLocation] = [];
          }
          grouped[originLocation].push({ ...shipment, locationType: 'origin' });
        }
        
        if (!selectedCountryCode || getCountryCode(shipment.arrivalPort) === selectedCountryCode) {
          if (destLocation !== originLocation) {
            if (!grouped[destLocation]) {
              grouped[destLocation] = [];
            }
            grouped[destLocation].push({ ...shipment, locationType: 'destination' });
          }
        }
      });

      console.log('Location grouped result:', Object.keys(grouped));
      return grouped;
    }
  }, [mockShipments, searchTerm, selectedCountry, selectedTransport, selectedStatus, mapView, selectedCountryCode]);

  // Group shipments by location
  const originalGroupedShipments = useMemo(() => {
    const filtered = mockShipments.filter(shipment => {
      const matchesSearch = Object.values(shipment).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesCountry = !selectedCountry || 
        shipment.departure.toLowerCase().includes(selectedCountry.toLowerCase()) ||
        shipment.arrivalPort.toLowerCase().includes(selectedCountry.toLowerCase());
      const matchesTransport = !selectedTransport || 
        shipment.transport.toLowerCase() === selectedTransport.toLowerCase();
      const matchesStatus = !selectedStatus || 
        shipment.status.toLowerCase().includes(selectedStatus.toLowerCase());

      return matchesSearch && matchesCountry && matchesTransport && matchesStatus;
    });

    const grouped: { [key: string]: any[] } = {};
    
    filtered.forEach(shipment => {
      const originLocation = extractLocation(shipment.departure);
      const destLocation = extractLocation(shipment.arrivalPort);
      
      // Group by origin location
      if (!grouped[originLocation]) {
        grouped[originLocation] = [];
      }
      grouped[originLocation].push({ ...shipment, locationType: 'origin' });
      
      // Group by destination location (if different from origin)
      if (destLocation !== originLocation) {
        if (!grouped[destLocation]) {
          grouped[destLocation] = [];
        }
        grouped[destLocation].push({ ...shipment, locationType: 'destination' });
      }
    });

    return grouped;
  }, [mockShipments, searchTerm, selectedCountry, selectedTransport, selectedStatus]);

  // Get unique countries
  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    mockShipments.forEach(shipment => {
      const originCountry = shipment.departure.split(',').pop()?.trim();
      const destCountry = shipment.arrivalPort.split(',').pop()?.trim();
      if (originCountry) countrySet.add(originCountry);
      if (destCountry) countrySet.add(destCountry);
    });
    return Array.from(countrySet).sort();
  }, []);

  // Handle country marker click - drill down to locations
  const handleCountryClick = (countryCode: string) => {
    console.log('Drilling down to country:', countryCode);
    setSelectedCountryCode(countryCode);
    setMapView('location');
    
    // Zoom to country
    if (mapRef && countryCoordinates[countryCode]) {
      const coords = countryCoordinates[countryCode];
      console.log('Zooming to coordinates:', coords);
      mapRef.setView(coords, 6);
      
      // Small delay to ensure map has updated
      setTimeout(() => {
        mapRef.invalidateSize();
      }, 100);
    }
  };

  // Handle back to country view
  const handleBackToCountryView = () => {
    console.log('Returning to country view');
    console.log('Current state before reset:', { mapView, selectedCountryCode });
    setMapView('country');
    setSelectedCountryCode('');
    
    // Reset map view
    if (mapRef) {
      console.log('Resetting map to world view');
      mapRef.setView([20, 0], 2);
      
      // Small delay to ensure map has updated
      setTimeout(() => {
        mapRef.invalidateSize();
        console.log('Map invalidated and reset complete');
      }, 100);
    }
  };

  // Create custom marker icon with count
  const createMarkerIcon = (count: number, color: string = '#3B82F6', isCountry: boolean = false) => {
    const size = isCountry ? [50, 50] : [40, 40];
    const fontSize = isCountry ? '14' : '12';
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="${size[0]}" height="${size[1]}" viewBox="0 0 ${size[0]} ${size[1]}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${size[0]/2}" cy="${size[1]/2}" r="${size[0]/2 - 3}" fill="${color}" stroke="white" stroke-width="3"/>
          <text x="${size[0]/2}" y="${size[1]/2 + 5}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold">${count}</text>
        </svg>
      `)}`,
      iconSize: size,
      iconAnchor: [size[0]/2, size[1]/2],
      popupAnchor: [0, -20],
    });
  };

  const getTransportIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'road':
        return <Truck className="w-4 h-4 text-green-700" />;
      case 'air':
        return <Plane className="w-4 h-4 text-pink-600" />;
      case 'sea':
        return <Ship className="w-4 h-4 text-indigo-700" />;
      default:
        return <Ship className="w-4 h-4 text-gray-700" />;
    }
  };

  const getTransportColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'road':
        return 'bg-green-100 text-green-800';
      case 'air':
        return 'bg-pink-100 text-pink-800';
      case 'sea':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit':
        return 'bg-blue-100 text-blue-800';
      case 'loaded on vessel':
        return 'bg-green-100 text-green-800';
      case 'customs clearance':
        return 'bg-yellow-100 text-yellow-800';
      case 'billing':
        return 'bg-amber-100 text-amber-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadExcel = () => {
    const allShipments = Object.values(groupedShipments).flat();
    const headers = ['Shipment No', 'Container No', 'Shipper', 'Consignee', 'Origin', 'Destination', 'Transport', 'Status', 'ETD'];
    
    const csvContent = [
      headers.join(','),
      ...allShipments.map(shipment => [
        shipment.shipmentNo,
        shipment.containerNo,
        shipment.shipper,
        shipment.consignee,
        shipment.departure,
        shipment.arrivalPort,
        shipment.transport,
        shipment.status,
        shipment.etd
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shipments_map_view_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalShipments = Object.values(groupedShipments).reduce((sum, shipments) => sum + shipments.length, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Shipments Overview</h1>
              <p className="text-sm text-gray-600 mt-1">Global shipment tracking with location-based grouping</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Map View</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>List View</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={downloadExcel}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
                <select 
                  value={selectedTransport}
                  onChange={(e) => setSelectedTransport(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Modes</option>
                  <option value="sea">Sea</option>
                  <option value="air">Air</option>
                  <option value="road">Road</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="in transit">In Transit</option>
                  <option value="loaded">Loaded</option>
                  <option value="customs">Customs Clearance</option>
                  <option value="billing">Billing</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div className="flex items-end">
                {mapView === 'location' && (
                  <button 
                    onClick={handleBackToCountryView}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors mr-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Countries</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    setSelectedCountry('');
                    setSelectedTransport('');
                    setSelectedStatus('');
                    setSearchTerm('');
                    // Also reset map view if needed
                    if (mapView === 'location') {
                      handleBackToCountryView();
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-800">
                {mapView === 'country' ? 'Country View' : `Location View - ${selectedCountryCode || 'Unknown'}`} - Showing {totalShipments} of {mockShipments.length} Shipments
              </span>
            </div>
            <div className="text-sm text-yellow-700">
              {Object.keys(groupedShipments).length} {mapView === 'country' ? 'countries' : 'locations'}
            </div>
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="relative">
            <div className="h-96">
              <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                className="rounded-b-lg"
                ref={setMapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {mapView === 'country' ? (
                  // Show country markers
                  Object.entries(groupedShipments).map(([countryCode, shipments]) => {
                    const coordinates = countryCoordinates[countryCode];
                    if (!coordinates) {
                      console.warn(`No coordinates found for country: ${countryCode}`);
                      return null;
                    }

                    return (
                      <Marker
                        key={countryCode}
                        position={coordinates}
                        icon={createMarkerIcon(shipments.length, '#2563EB', true)}
                        eventHandlers={{
                          click: () => handleCountryClick(countryCode)
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h4 className="font-semibold text-gray-900 mb-2">{countryCode}</h4>
                            <p className="text-sm text-gray-600 mb-2">{shipments.length} shipments</p>
                            <button
                              onClick={() => handleCountryClick(countryCode)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              <ZoomIn className="w-3 h-3" />
                              <span>View Locations</span>
                            </button>
                            <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                              {shipments.slice(0, 3).map((shipment, index) => (
                                <div key={index} className="text-xs">
                                  <span className="font-medium">{shipment.shipmentNo}</span>
                                  <span className="text-gray-500 ml-2">{shipment.status}</span>
                                </div>
                              ))}
                              {shipments.length > 3 && (
                                <div className="text-xs text-gray-500">
                                  +{shipments.length - 3} more...
                                </div>
                              )}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })
                ) : (
                  // Show location markers (when drilled down)
                  Object.entries(groupedShipments).map(([location, shipments]) => {
                    const coordinates = getCoordinates(location);
                    if (!coordinates) {
                      console.warn(`No coordinates found for location: ${location}`);
                      return null;
                    }

                    return (
                      <Marker
                        key={location}
                        position={coordinates}
                        icon={createMarkerIcon(shipments.length, '#059669', false)}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h4 className="font-semibold text-gray-900 mb-2">{location}</h4>
                            <p className="text-sm text-gray-600 mb-2">{shipments.length} shipments</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {shipments.slice(0, 5).map((shipment, index) => (
                                <div key={index} className="text-xs">
                                  <span className="font-medium">{shipment.shipmentNo}</span>
                                  <span className="text-gray-500 ml-2">{shipment.status}</span>
                                </div>
                              ))}
                              {shipments.length > 5 && (
                                <div className="text-xs text-gray-500">
                                  +{shipments.length - 5} more...
                                </div>
                              )}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })
                )}
              </MapContainer>
            </div>
          </div>
        )}

        {/* Shipments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  House Bill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origin Port
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination Port
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupedShipments).map(([location, shipments]) =>
                shipments.map((shipment, index) => (
                  <tr 
                    key={`${location}-${index}`}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onViewShipment(shipment.shipmentNo)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{shipment.houseNo || shipment.shipmentNo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {extractLocation(shipment.departure)} → {extractLocation(shipment.arrivalPort)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{extractLocation(shipment.departure)}</span>
                        <span className="text-xs text-gray-500">({shipment.departure.split(',').pop()?.trim()})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{extractLocation(shipment.arrivalPort)}</span>
                        <span className="text-xs text-gray-500">({shipment.arrivalPort.split(',').pop()?.trim()})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getTransportColor(shipment.transport)}`}>
                        {getTransportIcon(shipment.transport)}
                        <span className="text-sm font-medium">{shipment.transport}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{shipment.eta}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewShipment(shipment.shipmentNo);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {totalShipments} shipments across {Object.keys(groupedShipments).length} {mapView === 'country' ? 'countries' : 'locations'}
            </p>
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">‹ Previous</button>
              <span className="px-3 py-1 text-sm">Page 1 of 1</span>
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Next ›</button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsMapView;