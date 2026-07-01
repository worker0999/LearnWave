import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { UIProvider } from "@/contexts/UIContext";
import { Analytics } from "@vercel/analytics/next";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
        suppressHydrationWarning
        className={`${urbanist.variable} font-sans antialiased bg-background text-foreground`}
        style={{ fontFamily: 'var(--font-urbanist), sans-serif' }}
      >
        <AuthProvider>
          <UIProvider>
            {children}
            <Toaster />
            <Analytics />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
