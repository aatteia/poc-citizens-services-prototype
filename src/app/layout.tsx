import type { Metadata } from "next";
import localFont from "next/font/local";
import { ListenBar } from "@/components/layout/listen-bar";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToolRail } from "@/components/layout/tool-rail";
import { BRAND_NAME } from "@/lib/brand";
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
  title: `Parenting Payment — ${BRAND_NAME} (prototype)`,
  // Description intentionally keeps the real role/department context — it
  // describes the portfolio piece, not the in-prototype brand.
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
      <head>
        {/* Pre-paint theme application — keeps the dark/light class in sync
            with the user's stored preference before React hydrates, so the
            first paint never flashes the wrong palette. Kept tiny on purpose. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sa-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <MobileMenu />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <ToolRail />
        <ListenBar />
        <SiteFooter />
      </body>
    </html>
  );
}
