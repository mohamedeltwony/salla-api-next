import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Salla Integration Test App",
  description: "Testing Salla API integration with Next.js, Motion Primitives, and Magic UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@salla.sa/twilight@latest/dist/@salla.sa/twilight.min.js" async></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[DEBUG] Initializing Salla SDK loading');
              
              // Wait for SDK to load and initialize
              function initializeSallaSDK() {
                if (typeof salla !== 'undefined') {
                  console.log('[DEBUG] Salla SDK found, initializing...');
                  
                  try {
                    // Initialize with store configuration
                    salla.init({
                      debug: true,
                      language_code: 'ar',
                      store: {
                        id: ${process.env.NEXT_PUBLIC_SALLA_STORE_ID || 1305146709},
                        url: '${process.env.NEXT_PUBLIC_SALLA_STORE_URL || 'https://demo-store.salla.sa'}'
                      }
                    });
                    
                    console.log('[DEBUG] Salla SDK initialized successfully');
                    
                    // Verify cart functionality is available
                    setTimeout(() => {
                      if (salla.cart && salla.cart.addItem) {
                        console.log('[DEBUG] Salla cart functionality is available');
                        window.sallaSDKReady = true;
                      } else {
                        console.log('[DEBUG] Salla cart functionality not available yet');
                      }
                    }, 1000);
                    
                  } catch (error) {
                    console.error('[DEBUG] Error initializing Salla SDK:', error);
                  }
                } else {
                  console.log('[DEBUG] Salla SDK not loaded yet, retrying...');
                  setTimeout(initializeSallaSDK, 500);
                }
              }
              
              // Start initialization when DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeSallaSDK);
              } else {
                initializeSallaSDK();
              }
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
