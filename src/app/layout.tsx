import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const roboto = localFont({
  src: [
    {
      path: "./fonts/Roboto-VariableFont_wdth_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-Italic-VariableFont_wdth_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

const openSans = localFont({
  src: [
    {
      path: "./fonts/OpenSans-VariableFont_wdth_wght.ttf",
      weight: "300 800",
      style: "normal",
    },
    {
      path: "./fonts/OpenSans-Italic-VariableFont_wdth_wght.ttf",
      weight: "300 800",
      style: "italic",
    },
  ],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parenting Payment — Services Australia (prototype)",
  description:
    "Check if you may be eligible for Parenting Payment. Prototype for the Services Australia Lead Interaction Designer role.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      data-theme="sa"
      suppressHydrationWarning
      className={`${roboto.variable} ${openSans.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
