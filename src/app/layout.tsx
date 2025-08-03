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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Load Salla SDK with debugging
              (function() {
                console.log('[DEBUG] Starting Salla SDK loading process');
                var script = document.createElement('script');
                script.src = 'https://cdn.salla.network/stores/twilight/js/salla.min.js';
                script.async = true;
                
                script.onload = function() {
                  console.log('[DEBUG] Salla SDK script loaded successfully');
                  setTimeout(function() {
                    if (window.salla) {
                      console.log('[DEBUG] Salla SDK is available:', typeof window.salla);
                      console.log('[DEBUG] Salla SDK methods:', Object.keys(window.salla));
                      if (window.salla.cart) {
                        console.log('[DEBUG] Salla cart methods:', Object.keys(window.salla.cart));
                      }
                    } else {
                      console.error('[DEBUG] Salla SDK is not available on window object after loading');
                    }
                  }, 100);
                };
                
                script.onerror = function(error) {
                  console.error('[DEBUG] Failed to load Salla SDK - CORS or network error:', error);
                };
                
                document.head.appendChild(script);
              })();
              
              // Additional check on window load
              window.addEventListener('load', function() {
                console.log('[DEBUG] Window fully loaded, final Salla SDK check');
                setTimeout(function() {
                  if (window.salla) {
                    console.log('[DEBUG] Final check: Salla SDK is available');
                  } else {
                    console.error('[DEBUG] Final check: Salla SDK is still not available');
                  }
                }, 500);
              });
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
