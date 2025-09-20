'use client';

import { useRef, useState, useEffect } from 'react';

// Using eslint-disable to avoid Google Maps type conflicts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleMapsAutocompleteService = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleMapsPlacesService = any;
import { loadGoogleMapsAPI } from '../lib/googleMapsLoader';

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{
    place_id: string; 
    description: string;
    main_text?: string;
    secondary_text?: string;
  }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteServiceRef = useRef<GoogleMapsAutocompleteService | null>(null);
  const placesServiceRef = useRef<GoogleMapsPlacesService | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Reset state when component becomes visible
    setSelectedLocation(defaultLocation);
    setMapError(false);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);

    // Check for API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'demo_key_replace_with_actual_key') {
      console.warn('Google Maps API key not configured. Using fallback interface.');
      setMapError(true);
      return;
    }

    if (!mapRef.current) return;

    // Initialize Google Maps using centralized loader
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

        // Initialize Places services for search functionality
        if (window.google.maps.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService() as GoogleMapsAutocompleteService;
          placesServiceRef.current = new window.google.maps.places.PlacesService(mapInstance) as GoogleMapsPlacesService;
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    };

    // Load Google Maps API using centralized loader
    loadGoogleMapsAPI()
      .then(() => {
        initMap();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps API:', error);
        setMapError(true);
      });

    return () => {
      // Cleanup
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
      markerInstanceRef.current = null;
    };
  }, [isVisible, defaultLocation]);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.length > 2 && autocompleteServiceRef.current) {
      const request = {
        input: value,
        location: selectedLocation ? new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng) : new window.google.maps.LatLng(defaultLocation.lat, defaultLocation.lng),
        radius: 50000, // 50km radius
        types: ['establishment', 'geocode']
      };

      autocompleteServiceRef.current.getPlacePredictions(request, (predictions: google.maps.places.QueryAutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === 'OK' && predictions) {
          setSuggestions(predictions.filter(p => p.place_id).map(p => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const structured = (p as any)?.structured_formatting;
            return {
              place_id: p.place_id!,
              description: p.description,
              main_text: structured?.main_text,
              secondary_text: structured?.secondary_text
            };
          }));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (placeId: string, description: string) => {
    console.log('handleSuggestionSelect called with:', { placeId, description });
    
    if (!placesServiceRef.current) {
      console.error('Places service not available');
      return;
    }

    console.log('Getting place details for:', placeId);

    const request = {
      placeId: placeId,
      fields: ['geometry', 'formatted_address', 'name', 'place_id']
    };

    placesServiceRef.current.getDetails(request, (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
      console.log('Place details response:', { place, status });
      
      if (status === 'OK' && place && place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        const address = place.formatted_address || place.name || description;
        
        console.log('Setting selected location:', {
          address: address,
          coordinates: location,
          placeId: place.place_id
        });
        
        // Set the selected location first
        setSelectedLocation(location);
        
        // Update search input with the selected place name
        setSearchQuery(address);
        setShowSuggestions(false);
        
        // Update map and marker
        if (mapInstanceRef.current && markerInstanceRef.current) {
          console.log('Updating map and marker');
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(16);
          markerInstanceRef.current.setPosition(location);
        } else {
          console.warn('Map or marker instance not available');
        }
        
        console.log('Location successfully selected from suggestion');
        
      } else {
        console.error('Place details request failed:', status, place);
        // Fallback - still set the search query and hide suggestions
        setSearchQuery(description);
        setShowSuggestions(false);
        
        // Try to use the description as a fallback for geocoding
        if (typeof window.google !== 'undefined' && window.google.maps) {
          console.log('Attempting fallback geocoding for:', description);
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: description }, (results: google.maps.GeocoderResult[] | null, geocodeStatus: google.maps.GeocoderStatus) => {
            console.log('Geocoding results:', { results, geocodeStatus });
            if (geocodeStatus === 'OK' && results && results[0]) {
              const location = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              };
              console.log('Setting location from geocoding:', location);
              setSelectedLocation(location);
              
              if (mapInstanceRef.current && markerInstanceRef.current) {
                mapInstanceRef.current.setCenter(location);
                mapInstanceRef.current.setZoom(16);
                markerInstanceRef.current.setPosition(location);
              }
            }
          });
        }
      }
    });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if the click is outside both the search input and the suggestions dropdown
      if (searchInputRef.current && 
          !searchInputRef.current.contains(target) &&
          suggestionsRef.current &&
          !suggestionsRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConfirmLocation = async () => {
    console.log('Confirm location clicked. Current state:', {
      selectedLocation,
      searchQuery,
      mapError
    });
    
    if (!selectedLocation) {
      console.error('No location selected');
      alert('Please select a location first');
      return;
    }

    try {
      // If we have a search query (from place selection), use it as the address
      if (searchQuery && searchQuery.trim() && !searchQuery.includes('Lat:')) {
        console.log('Using search query as address:', searchQuery.trim());
        onLocationSelect({
          address: searchQuery.trim(),
          coordinates: selectedLocation
        });
        onClose();
        return;
      }

      // Otherwise, try reverse geocoding to get address if Google Maps is available
      if (typeof window.google !== 'undefined' && window.google.maps && !mapError) {
        console.log('Attempting reverse geocoding for coordinates:', selectedLocation);
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: selectedLocation },
          (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results && results[0]) {
              console.log('Reverse geocoding successful:', results[0].formatted_address);
              onLocationSelect({
                address: results[0].formatted_address,
                coordinates: selectedLocation
              });
            } else {
              console.log('Reverse geocoding failed, using coordinates');
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
        console.log('Using coordinates as fallback address');
        onLocationSelect({
          address: `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`,
          coordinates: selectedLocation
        });
        onClose();
      }
    } catch (error) {
      console.error('Error in handleConfirmLocation:', error);
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
          <h3 className="font-semibold mb-2">Select Issue Location</h3>
          {!mapError && (
            <div className="relative mb-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search for a location..."
                className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="suggestions-dropdown absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-md shadow-lg max-h-48 overflow-y-auto z-10"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.place_id || index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Suggestion clicked:', suggestion.description);
                        if (suggestion.place_id) {
                          handleSuggestionSelect(suggestion.place_id, suggestion.description);
                        }
                      }}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-black"
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {suggestion.main_text || suggestion.description}
                      </div>
                      {suggestion.secondary_text && (
                        <div className="text-xs text-gray-600">{suggestion.secondary_text}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <p className="text-sm text-gray-600">
            {mapError ? 'Enter coordinates manually' : 
             selectedLocation ? 'Location selected! Search, tap map, or drag marker to change' : 
             'Search, tap on the map, or drag the marker'}
          </p>
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mt-1">
              Debug: {suggestions.length} suggestions, showSuggestions: {showSuggestions.toString()}
              {suggestions.length > 0 && (
                <div>First suggestion: {suggestions[0]?.description || 'No description'}</div>
              )}
            </div>
          )}
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
        
        {/* Selected Location Preview */}
        {selectedLocation && (
          <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-blue-800">Selected Location:</p>
                <p className="text-xs text-blue-600 truncate">
                  {searchQuery && !searchQuery.includes('Lat:') ? 
                    searchQuery : 
                    `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 border-t flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedLocation 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedLocation ? (
              searchQuery && !searchQuery.includes('Lat:') ? 
              'Confirm Selected Location' : 
              'Confirm Location'
            ) : 'Select Location First'}
          </button>
        </div>
      </div>
    </div>
  );
}