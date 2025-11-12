import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnWave - AI-Powered Academic Platform for VTU Students",
  description: "Empowering VTU Students Through AI-Driven Learning & Collaboration. Centralize all academic resources, streamline communication, and enhance learning through intelligent automation.",
  keywords: ["LearnWave", "VTU", "AI Learning", "Education", "Students", "Mentorship", "Academic Platform"],
  authors: [{ name: "LearnWave Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "LearnWave - AI-Powered Academic Platform",
    description: "Empowering VTU Students Through AI-Driven Learning & Collaboration",
    url: "https://learnwave.example.com",
    siteName: "LearnWave",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnWave - AI-Powered Academic Platform",
    description: "Empowering VTU Students Through AI-Driven Learning & Collaboration",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
