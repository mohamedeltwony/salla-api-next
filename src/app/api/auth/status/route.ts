import { NextResponse } from 'next/server';
import { loadTokens, isTokenExpired } from '@/lib/auth';

export async function GET() {
  try {
    console.log('🔍 Checking authentication status...');
    
    const tokens = await loadTokens();
    
    if (!tokens) {
      console.log('❌ No tokens found');
      return NextResponse.json({
        authenticated: false,
        message: 'No authentication tokens found. Please complete OAuth flow.',
        needsAuth: true
      });
    }
    
    if (isTokenExpired(tokens)) {
      console.log('⚠️ Tokens expired');
      return NextResponse.json({
        authenticated: false,
        message: 'Authentication tokens have expired. Please re-authenticate.',
        needsAuth: true,
        expired: true
      });
    }
    
    console.log('✅ User is authenticated');
    return NextResponse.json({
      authenticated: true,
      message: 'Successfully authenticated with Salla',
      tokenInfo: {
        scope: tokens.scope,
        expiresAt: new Date(tokens.expires_at).toISOString(),
        tokenType: tokens.token_type
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking auth status:', error);
    return NextResponse.json({
      authenticated: false,
      message: 'Error checking authentication status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}