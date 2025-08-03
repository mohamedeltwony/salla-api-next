import { NextResponse } from 'next/server';
import { sallaApi } from '@/services/salla-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '12', 10);

  try {
    const response = await sallaApi.getProducts(page, perPage);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/products:', error);
    // The error from sallaApi service already contains a good message.
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}