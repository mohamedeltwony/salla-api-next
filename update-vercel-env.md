# Update Vercel Environment Variables

## Critical: Update Production Environment Variables

To complete the Salla CLI integration and resolve cart functionality issues, you **MUST** manually update the following environment variables in the Vercel Dashboard:

### Required Environment Variables

1. **SALLA_CLIENT_ID**
   - Value: `435c6d11-6cdf-4713-98e4-6a79d354e806`

2. **SALLA_CLIENT_SECRET**
   - Value: `b6954c22f598b49e7b451ccd431a0515`

3. **SALLA_APP_ID**
   - Value: `1735731275`

4. **SALLA_WEBHOOK_SECRET**
   - Value: `6863347be8a1a4fa98fd146bda020f5a`

5. **SALLA_REDIRECT_URI**
   - Value: `https://salla-test-app.vercel.app/auth/callback`

6. **NEXT_PUBLIC_SALLA_STORE_ID**
   - Value: `996181096`

7. **NEXT_PUBLIC_SALLA_STORE_URL**
   - Value: `https://demostore.salla.sa/dev-9cqg77rz0iq1kk2h`

8. **NEXT_PUBLIC_SALLA_API_URL**
   - Value: `https://api.salla.dev/admin/v2`

### How to Update:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `salla-test-app` project
3. Go to **Settings** → **Environment Variables**
4. Add/Update each variable above
5. **Important**: Redeploy the application after updating variables

### Why This is Critical:

- **Real Credentials**: These are the actual Salla app credentials from the CLI integration
- **OAuth Fix**: Proper redirect URI for production authentication
- **Cart Functionality**: Correct store ID and URL for cart operations
- **CORS Resolution**: Production URLs resolve the CORS issues encountered

### After Updating:

1. Trigger a new deployment (push any commit or redeploy manually)
2. Test authentication at: `https://salla-test-app.vercel.app/auth`
3. Test cart functionality with the real store data
4. Verify store information display works correctly

**Note**: The `.env.local` file has been updated locally but Vercel production requires manual environment variable configuration.