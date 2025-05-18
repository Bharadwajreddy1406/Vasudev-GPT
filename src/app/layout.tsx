import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./responsive.css";
import "@fontsource-variable/lora";
import "@fontsource-variable/cinzel";
import PageTransition from "@/components/krishna-ui/PageTransition";
import ClientProviders from "@/components/providers/ClientProviders";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KrishnaGPT",
  description: "Divine guidance powered by AI",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
  },
  themeColor: "#031C3E",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KrishnaGPT",
    startupImage: [
      {
        url: "/startup-image.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  applicationName: "KrishnaGPT",
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "KrishnaGPT",
    description: "Divine guidance powered by AI",
    images: ["/social-image.jpg"],
  },
  openGraph: {
    type: "website",
    title: "KrishnaGPT",
    description: "Divine guidance powered by AI",
    siteName: "KrishnaGPT",
    images: [
      {
        url: "/social-image.jpg",
      },
    ],
  },
  // iOS webappp status bar
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "KrishnaGPT",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-900">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#031C3E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#031C3E" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-lora antialiased`}>
        <ClientProviders>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              className: 'mobile-responsive-toast',
              style: {
                background: "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                backdropFilter: "blur(12px) saturate(180%)",
                WebkitBackdropFilter: "blur(12px) saturate(180%)",
                boxShadow:
                  "0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px rgba(255, 255, 255, 0.15)",
                borderRadius: "18px",
                padding: "14px 22px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: "15px",
                fontWeight: "500",
                letterSpacing: "0.5px",
              },
            }}
          />
        </ClientProviders>
      </body>
    </html>
  );
}
