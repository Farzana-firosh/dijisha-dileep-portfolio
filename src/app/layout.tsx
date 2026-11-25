import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Shantell_Sans, VT323 } from "next/font/google";
import { ChatLauncher } from "@/components/chat-launcher";
import { ContactPanel } from "@/components/contact-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ClickPing } from "@/components/click-ping";
import { curlScript, introScript, themeScript } from "@/components/shared";
import { profile, siteUrl } from "@/content/profile";
import { ld, website } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const ensureStatic = "navigation";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Marker-pen hand for notes and labels
const shantell = Shantell_Sans({
  variable: "--font-shantell",
  subsets: ["latin"],
  axes: ["INFM", "BNCE"],
  display: "swap",
});

// Pixel face for the CRT screen and the test report; not preloaded (below the name)
const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const title = `${profile.name} | QA Engineer & Software Tester in ${profile.city}`;

// The share image is drawn by app/opengraph-image.tsx; pages add their own canonical
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description: profile.seoDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  category: "portfolio",
  openGraph: {
    type: "profile",
    firstName: profile.firstName,
    lastName: profile.name.split(" ").slice(1).join(" "),
    siteName: profile.name,
    title,
    description: profile.seoDescription,
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description: profile.seoDescription },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Phone numbers are linked explicitly; stop iOS turning other digits (years, CGPA) into links
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1015" },
  ],
};

// The assistant shows only when the key exists at build time; the key itself never leaves the server
const askEnabled = Boolean(process.env.GEMINI_API_KEY);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${instrument.variable} ${shantell.variable} ${vt323.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + ";" + curlScript + ";" + introScript }} />
      </head>
      <body className="overflow-x-clip">
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader askEnabled={askEnabled} />
        <main id="main" className="overflow-x-clip">
          {children}
        </main>
        <SiteFooter />
        <ClickPing />
        <ContactPanel />
        <ChatLauncher />
        <script type="application/ld+json" dangerouslySetInnerHTML={ld(website)} />
        <Analytics />
      </body>
    </html>
  );
}
