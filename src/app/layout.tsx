import type { Metadata, Viewport } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f3ede7",
};

export const metadata: Metadata = {
  title: "BorrowIQ",
  description: "Free, private loan assessment for Indian borrowers. Get your safe borrowing limit, fair interest rate, and a one-page negotiation card — no login, no credit bureau pull.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BorrowIQ",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
