import { getValidAccessToken } from '@/lib/auth';

// Salla API Types
export interface SallaProduct {
  id: number;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  sale_price?: {
    amount: number;
    currency: string;
  };
  images: {
    url: string;
    alt?: string;
  }[];
  status: string;
  quantity?: number;
  sku?: string;
  weight?: number;
  categories?: {
    id: number;
    name: string;
  }[];
}

export interface SallaApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
  pagination?: {
    count: number;
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface SallaCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  parent_id?: number;
}

class SallaApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SALLA_API_URL || 'https://api.salla.dev/admin/v2';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<SallaApiResponse<T>> {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error('Authentication failed: No valid access token available. Please authorize the application.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        // If a 401 occurs, it might mean the token was revoked server-side.
        // A more advanced implementation could trigger a re-authentication flow here.
        const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error body' }));
        console.error(`Salla API Error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Salla API request failed:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts(page: number = 1, perPage: number = 20): Promise<SallaApiResponse<SallaProduct[]>> {
    return this.makeRequest<SallaProduct[]>(`/products?page=${page}&per_page=${perPage}`);
  }

  // Get single product
  async getProduct(id: number): Promise<SallaApiResponse<SallaProduct>> {
    return this.makeRequest<SallaProduct>(`/products/${id}`);
  }

  // Get categories
  async getCategories(): Promise<SallaApiResponse<SallaCategory[]>> {
    return this.makeRequest<SallaCategory[]>('/categories');
  }

  // Search products
  async searchProducts(query: string, page: number = 1): Promise<SallaApiResponse<SallaProduct[]>> {
    return this.makeRequest<SallaProduct[]>(`/products?search=${encodeURIComponent(query)}&page=${page}`);
  }
}

export const sallaApi = new SallaApiService();
export default sallaApi;