import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HandyAndy | Recovery Guide",
  description: "NHS and GDS-aligned rehabilitation recovery guide built with Next.js."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
