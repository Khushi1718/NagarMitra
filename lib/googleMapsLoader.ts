'use client';

// Global state to track Google Maps API loading
let isGoogleMapsLoaded = false;
let isGoogleMapsLoading = false;
let googleMapsLoadPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isGoogleMapsLoaded && typeof window.google !== 'undefined' && window.google.maps) {
      resolve();
      return;
    }

    // If currently loading, return the existing promise
    if (isGoogleMapsLoading && googleMapsLoadPromise) {
      googleMapsLoadPromise.then(resolve).catch(reject);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'demo_key_replace_with_actual_key') {
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    // Check if script is already present
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkLoaded = () => {
        if (typeof window.google !== 'undefined' && window.google.maps) {
          isGoogleMapsLoaded = true;
          isGoogleMapsLoading = false;
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Mark as loading
    isGoogleMapsLoading = true;

    // Create the promise for other components to wait for
    googleMapsLoadPromise = new Promise<void>((promiseResolve, promiseReject) => {
      // Create and load the script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;
        console.log('Google Maps API loaded successfully');
        promiseResolve();
        resolve();
      };
      
      script.onerror = () => {
        isGoogleMapsLoading = false;
        const error = new Error('Failed to load Google Maps API');
        console.error(error);
        promiseReject(error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  });
};

// Check if Google Maps API is currently loaded
export const isGoogleMapsAPILoaded = (): boolean => {
  return isGoogleMapsLoaded && typeof window.google !== 'undefined' && !!window.google.maps;
};

// Get loading status
export const isGoogleMapsAPILoading = (): boolean => {
  return isGoogleMapsLoading;
};