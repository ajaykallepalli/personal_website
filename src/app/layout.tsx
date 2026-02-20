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
  title: "Ajay Kallepalli",
  description: "Senior Software Engineer, AI — San Francisco",
  openGraph: {
    title: "Ajay Kallepalli",
    description: "Senior Software Engineer, AI — San Francisco",
    images: [{ url: "/og.jpg", width: 1536, height: 860 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajay Kallepalli",
    description: "Senior Software Engineer, AI — San Francisco",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
