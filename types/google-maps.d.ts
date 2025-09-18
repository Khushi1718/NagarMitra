declare global {
  interface Window {
    google?: {
      maps?: {
        Map: any;
        Marker: any;
        Geocoder: any;
        LatLng: any;
      };
    };
  }
}

export {};