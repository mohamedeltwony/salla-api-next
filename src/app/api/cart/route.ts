import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/auth';

// Salla Cart Types
export interface SallaCartItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: {
      amount: number;
      currency: string;
    };
    images: {
      url: string;
      alt?: string;
    }[];
  };
  quantity: number;
  price: {
    amount: number;
    currency: string;
  };
  total: {
    amount: number;
    currency: string;
  };
}

export interface SallaCart {
  id: string;
  items: SallaCartItem[];
  total: {
    amount: number;
    currency: string;
  };
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface SallaApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
}

class SallaCartService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SALLA_API_URL || 'https://api.salla.dev/admin/v2';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<SallaApiResponse<T>> {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error('Authentication failed: No valid access token available');
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
        const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error body' }));
        console.error(`Salla Cart API Error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Salla Cart API request failed:', error);
      throw error;
    }
  }

  // Get current cart
  async getCart(): Promise<SallaApiResponse<SallaCart>> {
    return this.makeRequest<SallaCart>('/cart');
  }

  // Add item to cart
  async addToCart(productId: number, quantity: number, options?: any): Promise<SallaApiResponse<SallaCart>> {
    return this.makeRequest<SallaCart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity,
        options,
      }),
    });
  }

  // Update cart item quantity
  async updateCartItem(itemId: number, quantity: number): Promise<SallaApiResponse<SallaCart>> {
    return this.makeRequest<SallaCart>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        quantity,
      }),
    });
  }

  // Remove item from cart
  async removeFromCart(itemId: number): Promise<SallaApiResponse<SallaCart>> {
    return this.makeRequest<SallaCart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Clear cart
  async clearCart(): Promise<SallaApiResponse<SallaCart>> {
    return this.makeRequest<SallaCart>('/cart', {
      method: 'DELETE',
    });
  }
}

const cartService = new SallaCartService();

// GET /api/cart - Get current cart
export async function GET() {
  try {
    const cart = await cartService.getCart();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to get cart:', error);
    return NextResponse.json(
      { error: 'Failed to get cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, quantity = 1, options } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const cart = await cartService.addToCart(product_id, quantity, options);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE() {
  try {
    const cart = await cartService.clearCart();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}