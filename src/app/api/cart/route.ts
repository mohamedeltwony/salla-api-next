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
    // Note: Cart operations should typically use Salla's storefront APIs, not admin APIs
    // Admin API is for merchant store management, not customer cart operations
    // For now, we'll create a mock implementation since cart operations require
    // customer authentication and storefront context
    this.baseUrl = process.env.NEXT_PUBLIC_SALLA_API_URL || 'https://api.salla.dev/admin/v2';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<SallaApiResponse<T>> {
    console.log('[DEBUG] SallaCartService: Making request to:', {
      endpoint,
      method: options.method || 'GET',
      hasBody: !!options.body
    });
    
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      console.error('[DEBUG] SallaCartService: No valid access token available');
      throw new Error('Authentication failed: No valid access token available');
    }
    
    console.log('[DEBUG] SallaCartService: Access token obtained, length:', accessToken.length);

    const url = `${this.baseUrl}${endpoint}`;
    console.log('[DEBUG] SallaCartService: Full URL:', url);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };
    
    const requestOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    console.log('[DEBUG] SallaCartService: Request options:', {
      method: requestOptions.method,
      headers: Object.keys(requestOptions.headers),
      body: requestOptions.body
    });

    try {
      const response = await fetch(url, requestOptions);
      
      console.log('[DEBUG] SallaCartService: Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error body' }));
        console.error('[DEBUG] SallaCartService: Error response body:', errorBody);
        console.error(`Salla Cart API Error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[DEBUG] SallaCartService: Success response data:', data);
      return data;
    } catch (error) {
      console.error('[DEBUG] SallaCartService: Request failed with error:', error);
      console.error('Salla Cart API request failed:', error);
      throw error;
    }
  }

  // Get current cart
  async getCart(): Promise<SallaApiResponse<SallaCart>> {
    console.log('[DEBUG] SallaCartService: Cart operations must be handled by Salla SDK on frontend');
    
    // Cart operations are not available through backend APIs
    // Customer cart functionality requires frontend Salla SDK integration
    // with customer authentication and session management
    throw new Error('Cart operations must be handled by Salla Twilight SDK on the frontend. Backend cart APIs are not available for customer operations.');
  }

  // Add item to cart
  async addToCart(productId: number, quantity: number, options?: Record<string, unknown>): Promise<SallaApiResponse<SallaCart>> {
    console.log('[DEBUG] SallaCartService: Cart operations must be handled by Salla SDK on frontend');
    console.log('[DEBUG] Attempted to add product:', { productId, quantity, options });
    
    // Cart operations are not available through backend APIs
    // Customer cart functionality requires frontend Salla SDK integration
    // with customer authentication and session management
    throw new Error('Cart operations must be handled by Salla Twilight SDK on the frontend. Backend cart APIs are not available for customer operations.');
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
  console.log('[DEBUG] Cart API GET: Starting cart fetch request');
  
  try {
    const cart = await cartService.getCart();
    console.log('[DEBUG] Cart API GET: Successfully fetched cart:', {
      cartId: cart.data?.id,
      itemsCount: cart.data?.items_count,
      status: cart.status
    });
    return NextResponse.json(cart.data);
  } catch (error) {
    console.error('[DEBUG] Cart API GET: Error fetching cart:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  console.log('[DEBUG] Cart API POST: Starting add to cart request');
  
  try {
    const requestBody = await request.json();
    console.log('[DEBUG] Cart API POST: Request body:', requestBody);
    
    const { product_id, quantity = 1, options } = requestBody;
    
    if (!product_id) {
      console.error('[DEBUG] Cart API POST: Missing required fields:', {
        product_id: product_id,
        quantity: quantity
      });
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    console.log('[DEBUG] Cart API POST: Calling cartService.addToCart with:', {
      product_id,
      quantity,
      options
    });
    
    const cart = await cartService.addToCart(product_id, quantity, options);
    console.log('[DEBUG] Cart API POST: Successfully added to cart:', {
      cartId: cart.data?.id,
      itemsCount: cart.data?.items_count,
      status: cart.status
    });
    
    return NextResponse.json(cart.data);
  } catch (error) {
    console.error('[DEBUG] Cart API POST: Error adding to cart:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
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