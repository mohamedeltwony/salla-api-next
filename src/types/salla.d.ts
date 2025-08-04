// Salla SDK Type Declarations

export interface SallaCartResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

interface SallaCartEventHandlers {
  onItemAdded: (callback: (response: SallaCartResponse, product_id?: number | string) => void) => void;
  onItemAddedFailed: (callback: (errorMessage: string | Error, product_id?: number | string) => void) => void;
}

interface SallaCart {
  addItem: (options: {
    id: number;
    quantity: number;
    options?: Record<string, unknown>;
    notes?: string;
  }) => Promise<SallaCartResponse>;
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