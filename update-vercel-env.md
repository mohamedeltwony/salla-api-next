# Update Vercel Environment Variables

To fix the cart functionality, you need to update the environment variables in your Vercel dashboard with your actual store details.

## Steps to Update Production Environment Variables:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `salla-test-app`
3. **Go to Settings > Environment Variables**
4. **Update these variables**:

### Current Store Information (from your authentication):
```
NEXT_PUBLIC_SALLA_STORE_ID=996181096
NEXT_PUBLIC_SALLA_STORE_URL=https://demostore.salla.sa/dev-9cqg77rz0iq1kk2h
```

### Variables to Update in Vercel:
- `NEXT_PUBLIC_SALLA_STORE_ID` → `996181096`
- `NEXT_PUBLIC_SALLA_STORE_URL` → `https://demostore.salla.sa/dev-9cqg77rz0iq1kk2h`

## After Updating:
1. **Redeploy** the application (Vercel will automatically redeploy when you save environment variables)
2. **Test cart functionality** at https://salla-test-app.vercel.app/
3. **Check browser console** for any remaining errors

## Why This Fixes the Issue:
- The Salla SDK was using demo store URLs (`demo-store.salla.sa`)
- Your actual store is `demostore.salla.sa/dev-9cqg77rz0iq1kk2h`
- Cart API calls will now go to your real store instead of the demo store
- This should resolve the `net::ERR_NAME_NOT_RESOLVED` and cart functionality issues

## Verification:
After updating, the cart functionality should work properly and you should see successful API calls to your actual store in the browser's Network tab.