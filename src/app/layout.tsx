import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource-variable/lora";
import "@fontsource-variable/cinzel";
import PageTransition from "@/components/krishna-ui/PageTransition";
import { AuthProvider } from "@/context/AuthContext";
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
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
