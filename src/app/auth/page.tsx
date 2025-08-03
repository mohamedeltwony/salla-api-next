'use client';



const SallaAuthPage = () => {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SALLA_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SALLA_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      alert('Configuration error: Salla client ID or redirect URI is not set.');
      return;
    }

    const scopes = 'settings.read customers.read_write orders.read_write carts.read branches.read_write categories.read_write brands.read_write products.read_write webhooks.read_write payments.read taxes.read_write dns-records.read_write specialoffers.read_write countries.read marketing.read_write reviews.read_write metadata.read_write transactions.read_write settlements.read_write store-settings.read_write exports.read_write offline_access'; // Define the scopes you need
    const state = 'random_string_for_security'; // Optional: for CSRF protection

    const authUrl = `https://accounts.salla.sa/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}`;

    window.location.href = authUrl;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Salla App Authorization</h1>
      <p>Click the button below to authorize the application with your Salla store.</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Authorize with Salla
      </button>
    </div>
  );
};

export default SallaAuthPage;