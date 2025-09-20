'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, MapPin, Upload, X, Check, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import GoogleMapsPicker from '../../components/GoogleMapsPicker';
import LocationPreviewMap from '../../components/LocationPreviewMap';
import { loadGoogleMapsAPI } from '../../lib/googleMapsLoader';

interface IssueFormData {
  title: string;
  category: string;
  description: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  priority: 'low' | 'medium' | 'high';
  images: File[];
}

const issueCategories = [
  { value: 'potholes', label: 'Potholes & Road Damage', icon: '🕳️' },
  { value: 'streetlights', label: 'Street Lighting Issues', icon: '💡' },
  { value: 'waste', label: 'Waste Management', icon: '🗑️' },
  { value: 'water', label: 'Water Supply Issues', icon: '💧' },
  { value: 'drainage', label: 'Drainage Problems', icon: '🌊' },
  { value: 'traffic', label: 'Traffic Signals', icon: '🚦' },
  { value: 'public-transport', label: 'Public Transportation', icon: '🚌' },
  { value: 'parks', label: 'Parks & Recreation', icon: '🌳' },
  { value: 'noise', label: 'Noise Pollution', icon: '🔊' },
  { value: 'other', label: 'Other Issues', icon: '⚠️' }
];

export default function RaiseIssue() {
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    category: '',
    description: '',
    location: {
      address: '',
      coordinates: undefined
    },
    priority: 'medium',
    images: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Array<{ place_id: string; description: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImages(prev => [...prev, imageDataUrl]);
        
        // Convert to File object for form data
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `issue-photo-${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, file]
            }));
          }
        }, 'image/jpeg', 0.8);
      }
    }
    stopCamera();
  }, [stopCamera]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));

      // Create preview URLs
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setCapturedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Get current location
  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates = { lat: latitude, lng: longitude };
          
          // Set coordinates immediately
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: coordinates
            }
          }));
          
          // Try reverse geocoding if Google Maps is available
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          if (apiKey && apiKey !== 'demo_key_replace_with_actual_key' && typeof window.google !== 'undefined' && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: coordinates },
              (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === 'OK' && results && results[0]) {
                  setFormData(prev => ({
                    ...prev,
                    location: {
                      address: results[0].formatted_address,
                      coordinates: coordinates
                    }
                  }));
                } else {
                  // Fallback to coordinates if reverse geocoding fails
                  setFormData(prev => ({
                    ...prev,
                    location: {
                      address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
                      coordinates: coordinates
                    }
                  }));
                }
              }
            );
          } else {
            // Fallback when Google Maps is not available
            setFormData(prev => ({
              ...prev,
              location: {
                address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
                coordinates: coordinates
              }
            }));
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please check location permissions and try again.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Open map picker
  const openMapPicker = () => {
    setShowLocationPicker(true);
  };

  // Handle location selection from map
  const handleLocationSelect = (location: { address: string; coordinates: { lat: number; lng: number } }) => {
    console.log('Location received from map picker:', location);
    setFormData(prev => ({
      ...prev,
      location: {
        address: location.address,
        coordinates: location.coordinates
      }
    }));
    setShowLocationPicker(false);
    console.log('Location updated in form data');
  };

  // Initialize Google Maps services
  const initializeGoogleMaps = async () => {
    try {
      setIsLoadingGoogle(true);
      await loadGoogleMapsAPI();
      
      if (window.google?.maps?.places) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService() as any;
        geocoderRef.current = new window.google.maps.Geocoder() as any;
        console.log('Google Maps services initialized');
      }
    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  // Handle search input change for autocomplete
  const handleSearchChange = async (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, address: value }
    }));

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Initialize Google Maps if not already done
    if (!autocompleteServiceRef.current) {
      await initializeGoogleMaps();
    }

    if (autocompleteServiceRef.current) {
      try {
        (autocompleteServiceRef.current as any).getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: 'in' }, // Restrict to India
          },
          (predictions: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              const formattedSuggestions = predictions.map((prediction: any) => ({
                place_id: prediction.place_id,
                description: prediction.description,
              }));
              setSuggestions(formattedSuggestions);
              setShowSuggestions(true);
            } else {
              setSuggestions([]);
              setShowSuggestions(false);
            }
          }
        );
      } catch (error) {
        console.error('Error getting place predictions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: { place_id: string; description: string }) => {
    console.log('Suggestion selected:', suggestion);
    
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, address: suggestion.description }
    }));
    setSuggestions([]);
    setShowSuggestions(false);

    // Get coordinates for the selected place
    if (geocoderRef.current) {
      try {
        (geocoderRef.current as any).geocode(
          { placeId: suggestion.place_id },
          (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location;
              const coordinates = {
                lat: location.lat(),
                lng: location.lng()
              };
              
              setFormData(prev => ({
                ...prev,
                location: {
                  address: suggestion.description,
                  coordinates: coordinates
                }
              }));
              console.log('Coordinates updated:', coordinates);
            }
          }
        );
      } catch (error) {
        console.error('Error geocoding place:', error);
      }
    }
  };

  // Handle clicks outside suggestions to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  // Submit form
  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.description || !formData.location.address) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Issue reported successfully! You will receive updates on the progress.');
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        location: { address: '' },
        priority: 'medium',
        images: []
      });
      setCapturedImages([]);
      setCurrentStep(1);
    } catch {
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">Help improve your community</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Issue Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Issue Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {issueCategories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={`p-3 border rounded-md text-left text-sm ${
                      formData.category === category.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <div className="text-lg mb-1">{category.icon}</div>
                    <div className="font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority Level</label>
              <div className="flex gap-2">
                {[
                  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
                  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
                  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
                ].map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as 'low' | 'medium' | 'high' }))}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      formData.priority === priority.value
                        ? priority.color
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the issue"
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Enter the location of the issue"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              {/* Autocomplete suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.place_id}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur
                        e.stopPropagation(); // Prevent event bubbling
                      }}
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-800">{suggestion.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Loading indicator */}
              {isLoadingGoogle && (
                <div className="absolute right-3 top-9 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                Current Location
              </button>
              <button
                type="button"
                onClick={openMapPicker}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-md text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                Choose on Map
              </button>
            </div>

            {formData.location.coordinates && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">GPS Coordinates:</p>
                <p className="text-sm text-muted-foreground">
                  Lat: {formData.location.coordinates.lat.toFixed(6)}, 
                  Lng: {formData.location.coordinates.lng.toFixed(6)}
                </p>
              </div>
            )}

            {/* Location Preview Map */}
            {formData.location.coordinates ? (
              <LocationPreviewMap 
                coordinates={formData.location.coordinates}
                address={formData.location.address}
                className="w-full h-48 rounded-md border"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Select a location to see it on the map</p>
                </div>
              </div>
            )}

            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'demo_key_replace_with_actual_key' && (
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                <div className="flex">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Setup Required:</strong> Google Maps API key not configured.
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      See GOOGLE_MAPS_SETUP.md for instructions. The app will use a coordinate input fallback.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Photos */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Add Photos</label>
              <p className="text-sm text-muted-foreground mb-4">
                Photos help authorities understand the issue better
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-md hover:bg-muted"
                >
                  <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Take Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-md hover:bg-muted"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Upload Photo</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Captured Images */}
              {capturedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {capturedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Captured ${index}`}
                        width={80}
                        height={80}
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex-1 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-4 bg-black flex items-center justify-center gap-4">
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-primary rounded-full"></div>
              </button>
            </div>
          </div>
        )}

        {/* Google Maps Picker */}
        {showLocationPicker && (
          <GoogleMapsPicker
            isVisible={showLocationPicker}
            onLocationSelect={handleLocationSelect}
            onClose={() => setShowLocationPicker(false)}
            defaultLocation={formData.location.coordinates || { lat: 28.6139, lng: 77.2090 }}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && (!formData.title || !formData.category || !formData.description)) ||
                (currentStep === 2 && !formData.location.address)
              }
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}