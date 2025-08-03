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
          src="https://cdn.salla.network/stores/twilight/js/salla.min.js"
          async
          onLoad={() => console.log('[DEBUG] Salla SDK loaded successfully')}
          onError={() => console.error('[DEBUG] Failed to load Salla SDK - CORS or network error')}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                console.log('[DEBUG] Window loaded, checking Salla SDK availability');
                if (window.salla) {
                  console.log('[DEBUG] Salla SDK is available:', typeof window.salla);
                  console.log('[DEBUG] Salla SDK methods:', Object.keys(window.salla));
                } else {
                  console.error('[DEBUG] Salla SDK is not available on window object');
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
