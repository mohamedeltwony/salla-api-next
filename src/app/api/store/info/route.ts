import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/auth';

export async function GET() {
  try {
    console.log('🏪 Fetching store information...');
    
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return NextResponse.json({
        error: 'No valid access token available. Please authenticate first.',
        needsAuth: true
      }, { status: 401 });
    }

    // Fetch store information from Salla API
    const response = await fetch('https://api.salla.dev/admin/v2/store', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch store info:', errorText);
      return NextResponse.json({
        error: 'Failed to fetch store information',
        details: errorText,
        status: response.status
      }, { status: response.status });
    }

    const storeData = await response.json();
    console.log('✅ Store information fetched successfully');
    
    return NextResponse.json({
      success: true,
      store: storeData.data,
      storeUrl: storeData.data?.domain || storeData.data?.url,
      storeId: storeData.data?.id
    });

  } catch (error) {
    console.error('❌ Error fetching store info:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}