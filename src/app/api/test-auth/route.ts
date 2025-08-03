import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/auth';

export async function GET() {
  console.log('[DEBUG] Test Auth API: Starting authentication test');
  
  try {
    // Test environment variables
    console.log('[DEBUG] Environment check:', {
      hasClientId: !!process.env.SALLA_CLIENT_ID,
      hasClientSecret: !!process.env.SALLA_CLIENT_SECRET,
      hasKvUrl: !!process.env.KV_REST_API_URL,
      hasKvToken: !!process.env.KV_REST_API_TOKEN,
      hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN
    });
    
    // Test token retrieval
    const accessToken = await getValidAccessToken();
    
    if (!accessToken) {
      console.log('[DEBUG] Test Auth API: No access token available');
      return NextResponse.json({
        success: false,
        message: 'No access token available. OAuth flow may be required.',
        hasToken: false,
        environmentOk: !!process.env.SALLA_CLIENT_ID && !!process.env.SALLA_CLIENT_SECRET
      });
    }
    
    console.log('[DEBUG] Test Auth API: Access token retrieved successfully');
    
    // Test basic Salla API call
    const testResponse = await fetch('https://api.salla.dev/admin/v2/products?per_page=1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('[DEBUG] Test Auth API: Salla API test response:', {
      status: testResponse.status,
      statusText: testResponse.statusText,
      ok: testResponse.ok
    });
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('[DEBUG] Test Auth API: Salla API error:', errorText);
      
      return NextResponse.json({
        success: false,
        message: 'Salla API test failed',
        hasToken: true,
        apiError: {
          status: testResponse.status,
          statusText: testResponse.statusText,
          body: errorText
        }
      });
    }
    
    const testData = await testResponse.json();
    console.log('[DEBUG] Test Auth API: Salla API test successful');
    
    return NextResponse.json({
      success: true,
      message: 'Authentication and API connectivity working',
      hasToken: true,
      tokenLength: accessToken.length,
      apiTest: {
        status: testResponse.status,
        dataReceived: !!testData.data
      }
    });
    
  } catch (error) {
    console.error('[DEBUG] Test Auth API: Error during test:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json({
      success: false,
      message: 'Authentication test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}