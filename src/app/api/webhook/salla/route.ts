import { NextRequest, NextResponse } from 'next/server';
import { saveTokens, SallaTokens } from '@/lib/auth';

// Webhook handler for Salla OAuth callback and other events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 Received Salla webhook:', body);

    // This is the OAuth callback
    if (body.event === 'app.installed' || body.code) {
      const authCode = body.code || body.data?.code;

      if (!authCode) {
        return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
      }

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://accounts.salla.sa/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: authCode,
          client_id: process.env.SALLA_CLIENT_ID,
          client_secret: process.env.SALLA_CLIENT_SECRET,
          redirect_uri: process.env.SALLA_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('❌ Token exchange failed:', errorText);
        return NextResponse.json({ error: 'Failed to exchange authorization code for token' }, { status: 400 });
      }

      const tokenData = await tokenResponse.json();
      const tokens: SallaTokens = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Date.now() + (tokenData.expires_in * 1000),
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      };

      await saveTokens(tokens);

      // You can redirect the user to a success page
      return NextResponse.json({ success: true, message: 'Authorization successful. Tokens stored.' });
    }

    // Handle other webhook events from Salla here
    // e.g., if (body.event === 'order.created') { ... }

    return NextResponse.json({ success: true, message: 'Webhook received', event: body.event });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle GET requests (for webhook verification and OAuth callback)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const challenge = searchParams.get('challenge');

  // OAuth2 callback handling
  if (code) {
    console.log('ℹ️ Received OAuth callback with authorization code.');
    console.log('🔍 Environment variables check:');
    console.log('SALLA_CLIENT_ID:', process.env.SALLA_CLIENT_ID ? `[SET: ${process.env.SALLA_CLIENT_ID.substring(0, 8)}...]` : '[NOT SET]');
    console.log('SALLA_CLIENT_SECRET:', process.env.SALLA_CLIENT_SECRET ? `[SET: ${process.env.SALLA_CLIENT_SECRET.substring(0, 8)}...]` : '[NOT SET]');
    console.log('SALLA_REDIRECT_URI:', process.env.SALLA_REDIRECT_URI || '[NOT SET]');
    console.log('NEXT_PUBLIC_SALLA_CLIENT_ID:', process.env.NEXT_PUBLIC_SALLA_CLIENT_ID ? `[SET: ${process.env.NEXT_PUBLIC_SALLA_CLIENT_ID.substring(0, 8)}...]` : '[NOT SET]');
    console.log('NEXT_PUBLIC_SALLA_REDIRECT_URI:', process.env.NEXT_PUBLIC_SALLA_REDIRECT_URI || '[NOT SET]');
    
    try {
      console.log('🔄 Exchanging authorization code for tokens...');
      const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.SALLA_CLIENT_ID!,
        client_secret: process.env.SALLA_CLIENT_SECRET!,
        redirect_uri: process.env.SALLA_REDIRECT_URI!,
      });
      console.log('📤 Token request body:', {
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.SALLA_CLIENT_ID,
        client_secret: '[HIDDEN]',
        redirect_uri: process.env.SALLA_REDIRECT_URI,
      });
      
      const tokenResponse = await fetch('https://accounts.salla.sa/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: requestBody.toString(),
      });

      console.log(`🚦 Token exchange response status: ${tokenResponse.status}`);
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('❌ Token exchange failed with status:', tokenResponse.status);
        console.error('❌ Error response:', errorText);
        console.error('❌ Response headers:', Object.fromEntries(tokenResponse.headers.entries()));
        return NextResponse.json({ 
          error: 'Failed to exchange authorization code for token',
          details: errorText,
          status: tokenResponse.status
        }, { status: 400 });
      }

      const tokenData = await tokenResponse.json();
      console.log('✅ Token exchange successful.');
      const tokens: SallaTokens = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Date.now() + (tokenData.expires_in * 1000),
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      };

      console.log('💾 Saving tokens to Vercel KV...');
      await saveTokens(tokens);
      console.log('✅ Tokens saved. Redirecting to homepage.');

      // Redirect to the homepage after successful authorization
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);

    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      return NextResponse.json({ error: 'Internal Server Error during OAuth callback' }, { status: 500 });
    }
  }

  // Webhook verification challenge
  if (challenge) {
    console.log('ℹ️ Responding to webhook verification challenge.');
    return new Response(challenge, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Default GET response
  console.log('ℹ️ GET request to webhook endpoint without code or challenge.');
  return NextResponse.json({
    status: 'Salla webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}