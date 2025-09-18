'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleMapsPickerProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
  defaultLocation?: { lat: number; lng: number };
  isVisible: boolean;
  onClose: () => void;
}

// Simple fallback component for when Google Maps is not available
function MapFallback({ 
  selectedLocation, 
  onLocationSelect, 
  defaultLocation 
}: {
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  defaultLocation: { lat: number; lng: number };
}) {
  const [inputLocation, setInputLocation] = useState(
    selectedLocation ? 
    `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}` : 
    `${defaultLocation.lat.toFixed(6)}, ${defaultLocation.lng.toFixed(6)}`
  );

  const handleLocationSubmit = () => {
    const [lat, lng] = inputLocation.split(',').map(coord => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      onLocationSelect({ lat, lng });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="text-center mb-4">
        <h3 className="font-semibold mb-2">Enter Location Coordinates</h3>
        <p className="text-sm text-gray-600">Format: latitude, longitude</p>
      </div>
      <input
        type="text"
        value={inputLocation}
        onChange={(e) => setInputLocation(e.target.value)}
        placeholder="28.6139, 77.2090"
        className="w-full px-3 py-2 border rounded-md mb-4"
      />
      <button
        onClick={handleLocationSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
      >
        Use This Location
      </button>
    </div>
  );
}

export default function GoogleMapsPicker({
  onLocationSelect,
  defaultLocation = { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  isVisible,
  onClose
}: GoogleMapsPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Reset state when component becomes visible
    setSelectedLocation(defaultLocation);
    setMapError(false);

    // Check for API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'demo_key_replace_with_actual_key') {
      console.warn('Google Maps API key not configured. Using fallback interface.');
      setMapError(true);
      return;
    }

    if (!mapRef.current) return;

    // Initialize Google Maps
    const initMap = () => {
      try {
        if (typeof window.google === 'undefined' || !window.google.maps) {
          throw new Error('Google Maps API not loaded');
        }

        const mapInstance = new window.google.maps.Map(mapRef.current!, {
          center: defaultLocation,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const markerInstance = new window.google.maps.Marker({
          position: defaultLocation,
          map: mapInstance,
          draggable: true,
          title: 'Issue Location'
        });

        // Handle marker drag
        markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          if (position) {
            const newLocation = {
              lat: position.lat(),
              lng: position.lng()
            };
            setSelectedLocation(newLocation);
          }
        });

        // Handle map click
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const newLocation = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            markerInstance.setPosition(event.latLng);
            setSelectedLocation(newLocation);
          }
        });

        mapInstanceRef.current = mapInstance;
        markerInstanceRef.current = markerInstance;
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    };

    // Check if Google Maps API is already loaded
    if (typeof window.google !== 'undefined' && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setMapError(true);
      };
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
      markerInstanceRef.current = null;
    };
  }, [isVisible, defaultLocation]);

  const handleConfirmLocation = async () => {
    if (!selectedLocation) return;

    try {
      // Try reverse geocoding to get address if Google Maps is available
      if (typeof window.google !== 'undefined' && window.google.maps && !mapError) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: selectedLocation },
          (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results && results[0]) {
              onLocationSelect({
                address: results[0].formatted_address,
                coordinates: selectedLocation
              });
            } else {
              onLocationSelect({
                address: `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`,
                coordinates: selectedLocation
              });
            }
            onClose();
          }
        );
      } else {
        // Fallback without geocoding
        onLocationSelect({
          address: `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`,
          coordinates: selectedLocation
        });
        onClose();
      }
    } catch {
      // Fallback to coordinates
      onLocationSelect({
        address: `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`,
        coordinates: selectedLocation
      });
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Select Issue Location</h3>
          <p className="text-sm text-gray-600">
            {mapError ? 'Enter coordinates manually' : 'Tap on the map or drag the marker'}
          </p>
        </div>
        
        <div className="flex-1">
          {mapError ? (
            <MapFallback 
              selectedLocation={selectedLocation}
              onLocationSelect={setSelectedLocation}
              defaultLocation={defaultLocation}
            />
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </div>
        
        <div className="p-4 border-t flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}