'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, MapPin, Upload, X, Check, AlertTriangle } from 'lucide-react';
import GoogleMapsPicker from '../../components/GoogleMapsPicker';

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { lat: latitude, lng: longitude }
            }
          }));
          
          // Reverse geocoding would go here (requires Google Maps API)
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter manually.');
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
    setFormData(prev => ({
      ...prev,
      location: {
        address: location.address,
        coordinates: location.coordinates
      }
    }));
    setShowLocationPicker(false);
  };

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
    } catch (error) {
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
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as any }))}
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
            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                placeholder="Enter the location of the issue"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
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

            {/* Google Maps Preview */}
            <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
              {formData.location.coordinates ? (
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Location Selected</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.location.coordinates.lat.toFixed(4)}, {formData.location.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Select location to preview on map</p>
                </div>
              )}
            </div>

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
                      <img
                        src={image}
                        alt={`Captured ${index}`}
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