import { kv } from '@vercel/kv';

const TOKENS_KEY = 'salla_tokens';

export interface SallaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
}

// Helper to find the correct KV environment variables
function getKvCredentials() {
  const prefixes = ['', 'STORAGE_'];
  for (const prefix of prefixes) {
    const url = process.env[`${prefix}KV_REST_API_URL`];
    const token = process.env[`${prefix}KV_REST_API_TOKEN`];
    if (url && token) {
      return { url, token };
    }
  }
  return null;
}

// Save tokens to Vercel KV
export async function saveTokens(tokens: SallaTokens): Promise<void> {
  console.log('Attempting to save tokens...');
  const credentials = getKvCredentials();
  if (!credentials) {
    console.error('❌ Missing Vercel KV environment variables. Cannot save tokens.');
    throw new Error('Vercel KV is not configured.');
  }
  try {
    await kv.set(TOKENS_KEY, tokens);
    console.log('✅ Salla tokens saved successfully to Vercel KV');
  } catch (error) {
    console.error('❌ Error saving tokens to Vercel KV:', error);
    throw new Error('Failed to save tokens.');
  }
}

// Load tokens from Vercel KV
export async function loadTokens(): Promise<SallaTokens | null> {
  console.log('Attempting to load tokens...');
  const credentials = getKvCredentials();
  if (!credentials) {
    console.error('❌ Missing Vercel KV environment variables. Cannot load tokens.');
    return null;
  }

  try {
    const tokens = await kv.get<SallaTokens>(TOKENS_KEY);
    if (tokens) {
      console.log('✅ Tokens loaded successfully from Vercel KV.');
    } else {
      console.log('ℹ️ No tokens found in Vercel KV for the key.');
    }
    return tokens;
  } catch (error) {
    console.error('❌ Error loading tokens from Vercel KV:', error);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(tokens: SallaTokens): boolean {
  // Add a 60-second buffer to be safe
  return Date.now() >= tokens.expires_at - 60000;
}

// Refresh access token
export async function refreshAccessToken(): Promise<SallaTokens | null> {
  const currentTokens = await loadTokens();
  if (!currentTokens) {
    console.error('❌ No refresh token found to refresh the access token.');
    return null;
  }

  try {
    const response = await fetch('https://accounts.salla.sa/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: currentTokens.refresh_token,
        client_id: process.env.SALLA_CLIENT_ID,
        client_secret: process.env.SALLA_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('❌ Failed to refresh token:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const newTokens: SallaTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || currentTokens.refresh_token, // Salla might not return a new refresh token
      expires_at: Date.now() + (data.expires_in * 1000),
      token_type: data.token_type,
      scope: data.scope,
    };

    await saveTokens(newTokens);
    return newTokens;
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    // If refresh fails, clear the invalid tokens
    await kv.del(TOKENS_KEY);
    return null;
  }
}

// Get a valid access token, refreshing if necessary
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await loadTokens();

  if (!tokens) {
    console.log('⚠️ No tokens found. Please initiate the OAuth flow.');
    return null;
  }

  if (isTokenExpired(tokens)) {
    console.log('🔄 Token expired, refreshing...');
    const newTokens = await refreshAccessToken();
    return newTokens?.access_token || null;
  }

  return tokens.access_token;
}