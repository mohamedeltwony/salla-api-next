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
              console.log('[DEBUG] Initializing Salla SDK');
              
              // Initialize Salla SDK when DOM is ready
              document.addEventListener('DOMContentLoaded', function() {
                if (typeof salla !== 'undefined') {
                  console.log('[DEBUG] Salla SDK found, initializing...');
                  
                  // Initialize with basic configuration
                   salla.init({
                     debug: true,
                     language_code: 'ar',
                     store: {
                       // These should be replaced with actual store values
                       id: '${process.env.NEXT_PUBLIC_SALLA_STORE_ID || 1}',
                       url: '${process.env.NEXT_PUBLIC_SALLA_STORE_URL || 'https://demo-store.salla.sa'}'
                     }
                   });
                  
                  console.log('[DEBUG] Salla SDK initialized successfully');
                  
                  // Verify cart functionality is available
                  if (salla.cart && salla.cart.addItem) {
                    console.log('[DEBUG] Salla cart functionality is available');
                  } else {
                    console.log('[DEBUG] Salla cart functionality not available');
                  }
                } else {
                  console.error('[DEBUG] Salla SDK not loaded');
                }
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
