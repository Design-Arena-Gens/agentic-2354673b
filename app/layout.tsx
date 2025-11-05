import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IT Asset Verification CRM",
  description: "Track and verify IT assets across your organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
