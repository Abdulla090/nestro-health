import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import FontLoader from "@/components/FontLoader";
import ClientProvider from "@/components/ClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata export for Next.js
export const metadata = {
  title: 'HealthTrack',
  description: 'Your complete health and wellness tracking application'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Apply RTL and Kurdish language attributes directly in the HTML tag
  return (
    <html lang="ku" dir="rtl" className="font-sorani">
      <head>
        <title>HealthTrack - Complete Health Calculators</title>
        <meta name="description" content="Track and calculate your health metrics easily with HealthTrack" />
        {/* Preload fonts to ensure they load quickly */}
        <link 
          rel="preload" 
          href="/fonts/NizarBukraRegular.ttf" 
          as="font" 
          type="font/ttf" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preload" 
          href="/fonts/NizarBukraBold.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
        {/* Add inline style to enforce Kurdish font */}
        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: 'NizarBukra';
            src: url('/fonts/NizarBukraRegular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: 'NizarBukra';
            src: url('/fonts/NizarBukraBold.woff2') format('woff2');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }
          
          html[dir="rtl"] * {
            font-family: 'NizarBukra', sans-serif !important;
          }
          
          .font-sorani {
            font-family: 'NizarBukra', sans-serif !important;
          }
          
          /* Force all kurdish elements to use the correct font */
          [lang="ku"] *,
          html[dir="rtl"] button,
          html[dir="rtl"] a,
          html[dir="rtl"] p,
          html[dir="rtl"] span,
          html[dir="rtl"] h1,
          html[dir="rtl"] h2,
          html[dir="rtl"] h3,
          html[dir="rtl"] div {
            font-family: 'NizarBukra', sans-serif !important;
          }
        ` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sorani`}
        dir="rtl"
        lang="ku"
      >
        <FontLoader />
        <LanguageProvider>
          <AuthProvider>
            <ClientProvider>
              {children}
            </ClientProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}