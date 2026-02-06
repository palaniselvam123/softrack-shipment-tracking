import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { ZoomIn, ZoomOut, RotateCcw, Navigation, Maximize2, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WorldMapProps {
  shipmentNo?: string;
  isModal?: boolean;
  onClose?: () => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ shipmentNo, isModal = false, onClose }) => {
  const [mapRef, setMapRef] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Real coordinates for the shipment route
  const routeCoordinates: LatLngExpression[] = [
    [-31.9505, 115.8605], // Perth, Australia (origin)
    [-36.8485, 174.7633], // Auckland, New Zealand (port of loading)
    [19.0760, 72.8777],   // Mumbai, India (destination)
  ];

  // Current vessel position (simulated)
  const vesselPosition: LatLngExpression = [10.0, 90.0]; // Somewhere in Indian Ocean

  // Port locations
  const ports = [
    {
      name: 'Australian Fine Wines',
      location: 'Perth, Australia',
      coordinates: [-31.9505, 115.8605] as LatLngExpression,
      status: 'completed',
      type: 'origin'
    },
    {
      name: 'Auckland Port',
      location: 'Auckland, New Zealand',
      coordinates: [-36.8485, 174.7633] as LatLngExpression,
      status: 'completed',
      type: 'port',
      date: '09-Oct-2023 10:40'
    },
    {
      name: 'Current Position',
      location: 'Indian Ocean',
      coordinates: vesselPosition,
      status: 'current',
      type: 'vessel'
    },
    {
      name: 'Ennore Port',
      location: 'Ennore, India',
      coordinates: [13.0976, 80.2936] as LatLngExpression,
      status: 'pending',
      type: 'destination',
      eta: '29-Nov-2023 20:00'
    }
  ];

  // Custom icons for different marker types
  const createCustomIcon = (type: string, status: string) => {
    let color = '#6B7280'; // gray
    if (status === 'completed') color = '#10B981'; // green
    if (status === 'current') color = '#3B82F6'; // blue
    if (status === 'pending') color = '#F59E0B'; // yellow

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
          ${type === 'vessel' ? '<circle cx="12.5" cy="12.5" r="3" fill="' + color + '"/>' : ''}
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  const handleZoomIn = () => {
    if (mapRef) {
      mapRef.setZoom(mapRef.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef) {
      mapRef.setZoom(mapRef.getZoom() - 1);
    }
  };

  const handleReset = () => {
    if (mapRef) {
      mapRef.setView([0, 60], 3);
    }
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking && mapRef) {
      // Center on vessel position
      mapRef.setView(vesselPosition, 6);
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch actual vessel position from API
      console.log('Updating vessel position...');
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-sm ${isModal ? 'w-full h-full' : ''}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
          <div className="flex items-center space-x-2">
            {!isModal && (
              <button 
                onClick={() => {/* This will be handled by parent component */}}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Expand Map"
              >
                <Maximize2 className="w-4 h-4 text-gray-500" />
              </button>
            )}
            {isModal && onClose && (
              <button 
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <button 
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-gray-500" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-gray-500" />
            </button>
            <button 
              onClick={handleReset}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4 text-gray-500" />
            </button>
            <button 
              onClick={toggleTracking}
              className={`p-1 rounded transition-colors ${
                isTracking 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              title="Track Vessel"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className={`relative ${isModal ? 'h-96' : 'h-80'}`}>
        <MapContainer
          center={[0, 60]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
          ref={setMapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route line */}
          <Polyline
            positions={routeCoordinates}
            color="#3B82F6"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
          
          {/* Port markers */}
          {ports.map((port, index) => (
            <Marker
              key={index}
              position={port.coordinates}
              icon={createCustomIcon(port.type, port.status)}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-gray-900">{port.name}</h4>
                  <p className="text-sm text-gray-600">{port.location}</p>
                  {port.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Departed: {port.date}
                    </p>
                  )}
                  {port.eta && (
                    <p className="text-xs text-gray-500 mt-1">
                      ETA: {port.eta}
                    </p>
                  )}
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    port.status === 'completed' ? 'bg-green-100 text-green-800' :
                    port.status === 'current' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {port.status === 'completed' ? 'Completed' :
                     port.status === 'current' ? 'In Transit' : 'Pending'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Live tracking status */}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Tracking Active</span>
        </div>
        
        {/* Vessel info overlay */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">MSC Alabama III</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Speed: 18.5 knots</div>
            <div>Course: 285°</div>
            <div>ETA Mumbai: 29-Jan-2026</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;