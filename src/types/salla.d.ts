// Salla SDK Type Declarations

interface SallaCartEventHandlers {
  onItemAdded: (callback: (response: any, product_id?: any) => void) => void;
  onItemAddedFailed: (callback: (errorMessage: any, product_id?: any) => void) => void;
}

interface SallaCart {
  addItem: (options: {
    id: number;
    quantity: number;
    options?: Record<string, any>;
    notes?: string;
  }) => Promise<any>;
  event: SallaCartEventHandlers;
}

interface SallaSDK {
  init: (config: {
    debug: boolean;
    language_code: string;
    store: {
      id: number;
      url: string;
    };
  }) => void;
  cart: SallaCart;
}

declare global {
  interface Window {
    salla: SallaSDK;
    sallaSDKReady?: boolean;
  }
}

export {};