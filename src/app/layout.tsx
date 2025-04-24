import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-lora antialiased`}
      >
        <ClientProviders>
          <PageTransition>
            {children}
          </PageTransition>
          {/* <Toaster position="top-center" /> */}
          <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500, // Slightly longer duration for better user attention
            style: {
              background: "rgba(255, 255, 255, 0.08)", // Softer frosted effect
              color: "#ffffff", // Off-white text for a warmer feel
              backdropFilter: "blur(12px) saturate(180%)", // Enhanced frosty effect with saturation
              WebkitBackdropFilter: "blur(12px) saturate(180%)", // Safari compatibility
              boxShadow:
                "0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px rgba(255, 255, 255, 0.15)", // Outer shadow for depth + subtle inner glow
              borderRadius: "18px", // Slightly more rounded for smoothness
              padding: "14px 22px", // Comfortable spacing
              border: "1px solid rgba(255, 255, 255, 0.2)", // Crisp, minimal border
              fontSize: "15px", // Slightly larger for easy readability
              fontWeight: "500", // Medium weight for emphasis
              letterSpacing: "0.5px", // Subtle spacing for a polished look
            },
          }}
        />
        </ClientProviders>
      </body>
    </html>
  );
}
