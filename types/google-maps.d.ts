declare global {
  interface Window {
    google?: {
      maps?: typeof google.maps & {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          PlacesService: new (map: google.maps.Map) => google.maps.places.PlacesService;
        };
      };
      translate?: {
        TranslateElement: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

declare namespace google.maps.places {
  interface AutocompleteOptions {
    types?: string[];
    componentRestrictions?: {
      country?: string | string[];
    };
    fields?: string[];
  }

  interface Autocomplete {
    addListener(eventName: string, handler: () => void): void;
    getPlace(): PlaceResult;
    setBounds(bounds: google.maps.LatLngBounds): void;
  }

  interface PlaceResult {
    geometry?: {
      location?: google.maps.LatLng;
    };
    formatted_address?: string;
    name?: string;
    place_id?: string;
  }

  interface AutocompleteService {
    getPlacePredictions(
      request: AutocompletionRequest,
      callback: (
        predictions: QueryAutocompletePrediction[] | null,
        status: string
      ) => void
    ): void;
    getQueryPredictions(
      request: AutocompletionRequest,
      callback: (
        predictions: QueryAutocompletePrediction[] | null,
        status: string
      ) => void
    ): void;
  }

  interface AutocompletionRequest {
    input: string;
    location?: google.maps.LatLng;
    radius?: number;
    types?: string[];
    componentRestrictions?: {
      country?: string | string[];
    };
  }

  interface QueryAutocompletePrediction {
    description: string;
    place_id?: string;
    structured_formatting?: {
      main_text: string;
      secondary_text: string;
    };
  }

  interface PlacesService {
    getDetails(
      request: PlaceDetailsRequest,
      callback: (result: PlaceResult | null, status: string) => void
    ): void;
  }

  interface PlaceDetailsRequest {
    placeId: string;
    fields: string[];
  }
}

export {};