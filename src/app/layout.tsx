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
              console.log('[DEBUG] Initializing Salla SDK loading');
              
              // Simple script loading without event handlers during SSR
              if (typeof window !== 'undefined') {
                var script = document.createElement('script');
                script.src = 'https://cdn.salla.network/stores/twilight/js/salla.min.js';
                script.async = true;
                document.head.appendChild(script);
                
                // Check SDK availability after page load
                setTimeout(function() {
                  if (window.salla) {
                    console.log('[DEBUG] Salla SDK loaded successfully');
                  } else {
                    console.log('[DEBUG] Salla SDK not available - using API fallback');
                  }
                }, 2000);
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
