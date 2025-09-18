declare global {
  interface Window {
    google?: {
      maps?: typeof google.maps;
      translate?: {
        TranslateElement: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export {};