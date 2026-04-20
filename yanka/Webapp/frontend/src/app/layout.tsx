import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./aws-auth-config";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yanka - AI Educational Assistant",
  description: "AI-Powered Multilingual Educational Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}