import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Log all environment variables for debugging
    console.log('🔍 Debug endpoint - Checking all environment variables:');
    console.log('KV_REST_API_URL:', process.env.KV_REST_API_URL ? '[SET]' : '[NOT SET]');
    console.log('KV_REST_API_TOKEN:', process.env.KV_REST_API_TOKEN ? '[SET]' : '[NOT SET]');
    console.log('KV_URL:', process.env.KV_URL ? '[SET]' : '[NOT SET]');
    console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? '[SET]' : '[NOT SET]');
    console.log('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? '[SET]' : '[NOT SET]');
    
    // Return the environment variable status
    const envStatus = {
      KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'NOT SET',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'NOT SET',
      KV_URL: process.env.KV_URL ? 'SET' : 'NOT SET',
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'NOT SET',
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL ? 'SET' : 'NOT SET'
    };
    
    return NextResponse.json({
      message: 'Debug endpoint - Environment variables status',
      environment: envStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Debug endpoint failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}