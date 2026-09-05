import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Borrower Copilot — Indian Loan Decision Engine & Negotiation Card",
  description: "Independent loan decision engine protecting Indian borrowers. Contrasts lender sanction vs safe borrowing, computes all-in APR, and generates shareable negotiation cards without bureau pulls or logins.",
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
