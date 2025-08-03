import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/auth';

// Salla Cart Types (reusing from parent route)
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
}

const cartService = new SallaCartService();

// PUT /api/cart/[itemId] - Update cart item quantity
export async function PUT(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const resolvedParams = await params;
    const itemId = parseInt(resolvedParams.itemId);
    
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    const cart = await cartService.updateCartItem(itemId, quantity);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to update cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const resolvedParams = await params;
    const itemId = parseInt(resolvedParams.itemId);
    
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const cart = await cartService.removeFromCart(itemId);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}