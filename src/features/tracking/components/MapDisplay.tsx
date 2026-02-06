import { useEffect, useRef, useState } from 'react';
import { VesselHistory, VesselInRadius } from '../types';

interface MapDisplayProps {
  vessels: VesselHistory[];
  nearbyVessels: VesselInRadius[];
  highlightIMO?: string | null;   // ⭐ last leg vessel
  pulseHighlight?: boolean;       // ⭐ visual focus
}

declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
    googleMapsCallbacks?: (() => void)[];
    initGoogleMapsCallback?: () => void;
  }
}

const safeNum = (n: any): number | null => {
  const num = Number(n);
  return Number.isFinite(num) ? num : null;
};

const MapDisplay = ({
  vessels,
  nearbyVessels,
  highlightIMO,
  pulseHighlight = false
}: MapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapRefInstance = useRef<any | null>(null);

  const polylinesRef = useRef<any[]>([]);
  const markersRef = useRef<any[]>([]);
  const nearbyMarkersRef = useRef<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= LOAD + DRAW ROUTES ================= */
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key missing');
      setLoading(false);
      return;
    }

    if (!vessels.length) {
      clearAll();
      setLoading(false);
      return;
    }

    loadGoogleMaps(() => drawRoutes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vessels, highlightIMO]);

  const drawRoutes = () => {
    if (!mapRef.current || !window.google?.maps) return;

    if (!mapRefInstance.current) {
      mapRefInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 3,
        mapTypeId: 'terrain'
      });
    }

    clearRoutesOnly();

    const bounds = new window.google.maps.LatLngBounds();
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#9333ea'];

    vessels.forEach((vessel, idx) => {
      const points = (vessel.positions || [])
        .map(p => ({
          lat: safeNum(p.lat),
          lng: safeNum(p.lon),
          ts: p.timestamp
        }))
        .filter(p => p.lat !== null && p.lng !== null) as {
          lat: number;
          lng: number;
        }[];

      if (!points.length) return;

      const path = [...points].reverse();
      path.forEach(p => bounds.extend(p));

      const isHighlighted = highlightIMO && vessel.imo === highlightIMO;

      const polyline = new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: isHighlighted ? '#e11d48' : colors[idx % colors.length],
        strokeOpacity: isHighlighted ? 1 : 0.8,
        strokeWeight: isHighlighted ? 5 : 3,
        zIndex: isHighlighted ? 100 : 10,
        map: mapRefInstance.current
      });

      polylinesRef.current.push(polyline);

      const last = path[path.length - 1];
      const marker = new window.google.maps.Marker({
        position: last,
        map: mapRefInstance.current,
        title: vessel.name,
        zIndex: isHighlighted ? 200 : 20,
        icon: isHighlighted
          ? {
              url: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png',
              scaledSize: new window.google.maps.Size(36, 36)
            }
          : undefined
      });

      markersRef.current.push(marker);

      if (isHighlighted && pulseHighlight) {
        pulseMarker(marker);
      }
    });

    if (!bounds.isEmpty()) {
      mapRefInstance.current.fitBounds(bounds, {
        top: 80,
        bottom: 80,
        left: 80,
        right: 80
      });

      // Prevent over-zoom
      setTimeout(() => {
        const z = mapRefInstance.current.getZoom();
        if (z > 6) mapRefInstance.current.setZoom(6);
      }, 300);
    }

    setLoading(false);
  };

  /* ================= NEARBY VESSELS ================= */
  useEffect(() => {
    if (!mapRefInstance.current || !window.google?.maps) return;

    nearbyMarkersRef.current.forEach(m => m.setMap(null));
    nearbyMarkersRef.current = [];

    nearbyVessels.forEach(v => {
      const lat = safeNum(v.lat);
      const lng = safeNum(v.lon);
      if (lat === null || lng === null) return;

      const m = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRefInstance.current,
        title: v.name || `IMO ${v.imo}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#f97316',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2
        },
        zIndex: 50
      });

      nearbyMarkersRef.current.push(m);
    });
  }, [nearbyVessels]);

  /* ================= HELPERS ================= */
  const pulseMarker = (marker: any) => {
    let grow = true;
    let size = 36;

    setInterval(() => {
      size += grow ? 1 : -1;
      if (size >= 42) grow = false;
      if (size <= 36) grow = true;

      marker.setIcon({
        url: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png',
        scaledSize: new window.google.maps.Size(size, size)
      });
    }, 300);
  };

  const clearRoutesOnly = () => {
    polylinesRef.current.forEach(p => p.setMap(null));
    markersRef.current.forEach(m => m.setMap(null));
    polylinesRef.current = [];
    markersRef.current = [];
  };

  const clearAll = () => {
    clearRoutesOnly();
    nearbyMarkersRef.current.forEach(m => m.setMap(null));
    nearbyMarkersRef.current = [];
  };

  const loadGoogleMaps = (cb: () => void) => {
    if (window.googleMapsLoaded && window.google?.maps) {
      cb();
      return;
    }

    if (!window.googleMapsCallbacks) window.googleMapsCallbacks = [];
    window.googleMapsCallbacks.push(cb);

    if (document.querySelector('script[src*="maps.googleapis.com"]')) return;

    window.initGoogleMapsCallback = () => {
      window.googleMapsLoaded = true;
      window.googleMapsCallbacks?.forEach(fn => fn());
      window.googleMapsCallbacks = [];
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setError('Failed to load Google Maps');
      setLoading(false);
    };

    document.head.appendChild(script);
  };

  /* ================= RENDER ================= */
  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full rounded-lg border"
        style={{ height: '70vh', minHeight: '520px' }}
      />

      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
