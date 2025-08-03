# Salla SDK Setup Guide

## 🚀 Complete Setup Instructions for Salla Integration

This guide will help you properly set up the Salla SDK and authentication for your Next.js application.

## 📋 Prerequisites

1. **Salla Partners Account**: Create an account at [Salla Partners Portal](https://salla.partners)
2. **Demo Store or Real Store**: You'll need access to a Salla store for testing
3. **Salla App**: Create an app in the Partners Portal

## 🔧 Step 1: Create Salla App

1. **Login to Salla Partners Portal**
   - Go to [https://salla.partners](https://salla.partners)
   - Login with your credentials

2. **Create New App**
   - Click "My Apps" from the left menu
   - Click "Create App"
   - Choose "Private App" for development/testing
   - Fill in the basic information:
     - **Name**: Your app name (English & Arabic)
     - **Category**: General App
     - **Description**: Brief description
     - **App Website**: Your app URL
     - **Support Email**: Your support email

3. **Configure App Settings**
   - **Client ID & Secret**: Copy these from the App Keys section
   - **OAuth Redirect URI**: Set to `http://localhost:3000/auth/callback`
   - **App Scope**: Select required permissions (at minimum: `offline_access`)

## 🏪 Step 2: Create Demo Store

1. **Create Demo Store**
   - Go to "Demo Stores" in the left menu
   - Click "Create Demo Store"
   - Fill in:
     - **Store Name**: Choose a name for your demo store
     - **Password**: Set a password for store management
   - Click "Create Demo Store"

2. **Install App to Demo Store**
   - Go back to your app details
   - Scroll to "Test Your App" section
   - Click "Install App" next to your demo store
   - Authorize the app when prompted

3. **Get Store Information**
   - After installation, note down:
     - **Store ID**: Found in the store URL or dashboard
     - **Store URL**: The demo store URL (e.g., `https://demo-store-name.salla.sa`)

## ⚙️ Step 3: Update Environment Variables

Update your `.env.local` file with the actual credentials:

```env
# Salla API Configuration
SALLA_CLIENT_ID=your_actual_client_id_here
SALLA_CLIENT_SECRET=your_actual_client_secret_here
SALLA_REDIRECT_URI=http://localhost:3000/auth/callback

# Salla Store Configuration for SDK
NEXT_PUBLIC_SALLA_STORE_ID=your_actual_store_id_here
NEXT_PUBLIC_SALLA_STORE_URL=https://your-actual-demo-store.salla.sa
NEXT_PUBLIC_SALLA_API_URL=https://api.salla.dev/admin/v2

# Other configurations...
```

## 🔐 Step 4: Set Up Authentication

1. **OAuth Flow**
   - The app needs to go through Salla's OAuth flow to get access tokens
   - Visit: `http://localhost:3000/auth/login` (you'll need to implement this)
   - This will redirect to Salla for authorization
   - After authorization, you'll get access tokens

2. **Token Storage**
   - Access tokens should be stored securely (database/Redis)
   - Tokens expire after 14 days
   - Use refresh tokens to get new access tokens

## 🛠️ Step 5: Implementation Status

### ✅ **Currently Working:**
- Salla SDK loading and initialization
- Cart functionality structure
- Error handling and debugging
- Environment configuration

### 🔄 **Needs Implementation:**
- OAuth authentication flow (`/auth/login`, `/auth/callback`)
- Access token management
- Product fetching with proper authentication
- Customer authentication for cart operations

## 🚨 **Current Issues & Solutions**

### Issue 1: "Authentication failed: No valid access token available"
**Solution**: Implement OAuth flow to get valid access tokens

### Issue 2: "Salla SDK not available"
**Solution**: ✅ **FIXED** - SDK now loads properly with retry mechanism

### Issue 3: Cart operations failing
**Solution**: ✅ **FIXED** - Now uses proper Salla SDK integration

### Issue 4: "Authentication Failed - No Valid Access Token"
**Problem**: Using placeholder credentials and no OAuth flow completed
**Solution**: 
1. **Update Salla API Credentials**: Replace placeholder values with real credentials from Salla Partners Portal
2. **Configure Token Storage**: Set up Upstash Redis or Vercel KV for token storage
3. **Complete OAuth Flow**: Visit `/auth/salla` to authorize and get access tokens
4. **Update Store Configuration**: Use real demo store details

**Critical Steps:**
```env
# Replace with REAL Salla app credentials
SALLA_CLIENT_ID=your_real_client_id_from_salla_partners
SALLA_CLIENT_SECRET=your_real_client_secret_from_salla_partners

# Configure token storage (choose one)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Use real store details
NEXT_PUBLIC_SALLA_STORE_ID=your_actual_demo_store_id
NEXT_PUBLIC_SALLA_STORE_URL=https://your-actual-demo-store-name.salla.sa
```

## 📚 **Next Steps**

1. **Implement OAuth Authentication**
   ```bash
   # Create auth pages
   mkdir -p src/app/auth/login
   mkdir -p src/app/auth/callback
   ```

2. **Add Authentication Routes**
   - `/auth/login` - Redirect to Salla OAuth
   - `/auth/callback` - Handle OAuth callback
   - Token storage and management

3. **Test with Real Store Data**
   - Once authenticated, test product fetching
   - Test cart operations with customer authentication
   - Verify all functionality works end-to-end

## 🔧 **IMMEDIATE FIX: Current Authentication Error**

### You're seeing "Authentication failed: No valid access token available" - Here's how to fix it:

#### Step 1: Get Real Salla Credentials
1. Go to [Salla Partners Portal](https://salla.partners/)
2. Create/login to your account
3. Create a new app or use existing one
4. Copy your **Client ID** and **Client Secret**

#### Step 2: Set Up Token Storage (Quick Option)
1. Go to [Upstash](https://upstash.com)
2. Sign up for free account
3. Create a new Redis database
4. Copy the **REST URL** and **REST TOKEN**

#### Step 3: Update Your `.env.local` File
Replace the placeholder values with your real credentials:
```env
# Replace these with your REAL Salla app credentials
SALLA_CLIENT_ID=salla_your_real_client_id
SALLA_CLIENT_SECRET=sk_your_real_client_secret
SALLA_REDIRECT_URI=http://localhost:3000/auth/callback

# Replace with your REAL Upstash Redis credentials
UPSTASH_REDIS_REST_URL=https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXyour_real_token

# Keep these for now (will update after OAuth)
NEXT_PUBLIC_SALLA_STORE_ID=1305146709
NEXT_PUBLIC_SALLA_STORE_URL=https://demo-store.salla.sa
```

#### Step 4: Complete OAuth Flow
1. Save your `.env.local` file
2. Restart your development server: `npm run dev`
3. Visit: `http://localhost:3000/auth/salla`
4. Authorize your app with Salla
5. You'll be redirected back with access tokens stored

#### Step 5: Test the Application
1. Visit `http://localhost:3000`
2. You should now see real products loading
3. Cart functionality will work with your authorized store

### ⚠️ **Important Notes:**
- **Don't skip the OAuth step** - this is what gets your access tokens
- **Use real credentials** - placeholder values will never work
- **Restart the server** after updating `.env.local`
- **Check the console** for any remaining errors

---

## 🔗 **Useful Resources**

- [Salla Partners Portal](https://salla.partners)
- [Salla API Documentation](https://docs.salla.dev)
- [Twilight SDK Documentation](https://docs.salla.dev/doc-422610)
- [OAuth2 Setup Guide](https://docs.salla.dev/doc-421117)
- [Demo Store Testing](https://salla.dev/blog/how-to-test-your-app-using-salla-demo-stores/)
- [Upstash Redis Setup](https://upstash.com)

## 💡 **Tips**

1. **Use Demo Stores**: Always test with demo stores before using real stores
2. **Monitor Logs**: Check browser console for detailed debugging information
3. **Token Management**: Implement proper token refresh mechanisms
4. **Error Handling**: The app now provides detailed error messages in Arabic and English
5. **SDK Readiness**: The app waits for SDK to be fully ready before allowing operations

---

**Note**: The current implementation follows AI Agent Rules by using real API integration without mock data. All cart operations now require proper Salla SDK authentication and store configuration.