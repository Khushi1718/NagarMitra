'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { loadGoogleMapsAPI, isGoogleMapsAPILoaded } from '../lib/googleMapsLoader';

interface LocationPreviewMapProps {
  coordinates: { lat: number; lng: number };
  address?: string;
  className?: string;
}

export default function LocationPreviewMap({ 
  coordinates, 
  address, 
  className = "w-full h-48 rounded-md border" 
}: LocationPreviewMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!coordinates || !mapRef.current) return;

    // Reset loading state when coordinates change
    setIsLoading(true);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'demo_key_replace_with_actual_key') {
      console.log('Google Maps API key not configured, using fallback');
      setIsLoading(false);
      return;
    }

    const initMap = () => {
      try {
        if (typeof window.google === 'undefined' || !window.google.maps) {
          throw new Error('Google Maps API not loaded');
        }

        setIsLoading(false);

        // Create map instance
        const mapInstance = new window.google.maps.Map(mapRef.current!, {
          center: coordinates,
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: 'cooperative',
          disableDefaultUI: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Create marker
        const markerInstance = new window.google.maps.Marker({
          position: coordinates,
          map: mapInstance,
          title: address || 'Selected Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        // Store references
        mapInstanceRef.current = mapInstance;
        markerInstanceRef.current = markerInstance;

        // Add info window if address is provided
        if (address) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <div style="font-weight: bold; margin-bottom: 4px;">Selected Location</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${address}</div>
                <div style="font-size: 11px; color: #888;">
                  ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}
                </div>
              </div>
            `
          });

          // Show info window on marker click
          markerInstance.addListener('click', () => {
            infoWindow.open(mapInstance, markerInstance);
          });

          // Also show info window on map load (auto-open)
          setTimeout(() => {
            infoWindow.open(mapInstance, markerInstance);
          }, 500);
        }

      } catch (error) {
        console.error('Error initializing preview map:', error);
        setIsLoading(false);
      }
    };

    // Use centralized Google Maps loader
    if (isGoogleMapsAPILoaded()) {
      // API already loaded, initialize immediately
      initMap();
    } else {
      // Load API using centralized loader
      loadGoogleMapsAPI()
        .then(() => {
          initMap();
        })
        .catch((error) => {
          console.error('Failed to load Google Maps API for preview:', error);
          setIsLoading(false);
        });
    }

    return () => {
      // Cleanup
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
      markerInstanceRef.current = null;
    };
  }, [coordinates, address]);

  // Update map when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerInstanceRef.current && coordinates) {
      mapInstanceRef.current.setCenter(coordinates);
      markerInstanceRef.current.setPosition(coordinates);
    }
  }, [coordinates]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isMapAvailable = apiKey && apiKey !== 'demo_key_replace_with_actual_key';

  if (!isMapAvailable) {
    // Fallback when Google Maps is not available
    return (
      <div className={`${className} bg-muted flex items-center justify-center`}>
        <div className="text-center p-4">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-sm font-medium">Location Selected</p>
          <p className="text-xs text-muted-foreground">
            {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </p>
          {address && (
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {address}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-md z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-md" />
    </div>
  );
}