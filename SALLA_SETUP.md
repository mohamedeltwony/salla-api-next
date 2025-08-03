# Salla API Integration Setup

## 1. Create a Salla App and Get Credentials

1.  **Log in** to the [Salla Partner Portal](https://partners.salla.sa/).
2.  Navigate to the **My Apps** section and click **Create New App**.
3.  Fill in the application details:
    *   **App Name**: Give your application a descriptive name.
    *   **App Link**: This can be your project's URL or a placeholder.
4.  Once the app is created, go to the **Credentials** tab. Here you will find your **Client ID** and **Client Secret**.
5.  Go to the **App Settings** tab and configure the **Redirect URI**. This is the URL that Salla will redirect to after a user authorizes your app. For local development, this should be:
    ```
    http://localhost:3001/api/webhook/salla
    ```
    > **Important**: This URL must exactly match the `SALLA_REDIRECT_URI` in your `.env.local` file.

## 2. Configure Environment Variables

Open the `.env.local` file in your project and update it with the credentials you obtained in the previous step. You will also need to set up Vercel KV for token storage.

1.  **Salla Credentials**:
    *   `SALLA_CLIENT_ID`: Your app's Client ID.
    *   `SALLA_CLIENT_SECRET`: Your app's Client Secret.
    *   `NEXT_PUBLIC_SALLA_CLIENT_ID`: The same Client ID, but accessible on the client-side.

2.  **Vercel KV Credentials**:
    *   Go to your project on [Vercel](https://vercel.com).
    *   Navigate to the **Storage** tab and create a new **KV (Redis)** database.
    *   Connect the database to your project.
    *   Go to the `.env.local` tab within the database view, click **Show secret**, and copy all the `KV_` variables into your local `.env.local` file.

Your `.env.local` file should look like this:

```env
# Salla OAuth 2.0 Credentials
SALLA_CLIENT_ID="your_client_id_here"
SALLA_CLIENT_SECRET="your_client_secret_here"
SALLA_REDIRECT_URI="http://localhost:3001/api/webhook/salla"

# Public variables (accessible on the client-side)
NEXT_PUBLIC_SALLA_CLIENT_ID="your_client_id_here"
NEXT_PUBLIC_SALLA_REDIRECT_URI="http://localhost:3001/api/webhook/salla"

# Vercel KV (Redis) Credentials
KV_URL="..."
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."

# Salla API URL
SALLA_API_URL=https://api.salla.dev/admin/v2
```

## 3. Authorize the Application

After configuring your environment variables, you need to authorize the application to access your Salla store data.

1.  **Restart your development server** to apply the new environment variables.
2.  Open your browser and navigate to:
    ```
    http://localhost:3001/auth
    ```
3.  Click the **Authorize with Salla** button.
4.  You will be redirected to Salla to log in and approve the requested permissions.
5.  After approval, Salla will redirect you back to your application's webhook, which will securely store the access and refresh tokens in your Vercel KV database.

## 4. Test the Integration

Once authorized, the application should be able to fetch data from the Salla API. Navigate to the homepage to see if your products are displayed. If you see products, the authentication flow is working correctly!

## 📋 Required Salla API Permissions

Make sure your app has these permissions:
- `products:read` - To fetch products
- `categories:read` - To fetch categories
- `orders:read` - To fetch orders (optional)
- `customers:read` - To fetch customers (optional)

## 🔧 Troubleshooting

### "Unauthorized" Error
- Check if your access token is correct
- Ensure your app has the required permissions
- Verify the token hasn't expired

### "No Products Found"
- Make sure your Salla store has products
- Check if products are published and active
- Verify the API endpoint is correct

### Network Errors
- Check your internet connection
- Ensure Salla API is accessible from your location
- Try testing with a different network

## 📚 Useful Links

- [Salla API Documentation](https://docs.salla.dev/)
- [Salla Partner Portal](https://salla.dev/)
- [API Reference](https://docs.salla.dev/api/)

---

**Note**: This integration is currently set up to use the real Salla API. All mock data has been removed to ensure accurate testing results.