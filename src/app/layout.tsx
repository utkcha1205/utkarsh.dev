import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://utkarshchaturvedi.vercel.app"),
  title: {
    default: "Utkarsh Chaturvedi | Lead Frontend Engineer & Founder at Guidezy",
    template: "%s | Utkarsh Chaturvedi",
  },
  description:
    "Lead Frontend Engineer & Founder at Guidezy. 6+ years building high-performance React, Next.js & real-time aviation platforms. Open to impactful engineering roles.",
  keywords: [
    "Utkarsh Chaturvedi",
    "Frontend Engineer",
    "Lead Frontend Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "JavaScript",
    "Aviation Software",
    "Real-time Systems",
    "Guidezy",
    "UI Architecture",
    "Web Performance",
    "Framer Motion",
    "Tailwind CSS",
    "Software Engineer India",
  ],
  authors: [{ name: "Utkarsh Chaturvedi", url: "https://utkarshchaturvedi.vercel.app" }],
  creator: "Utkarsh Chaturvedi",
  publisher: "Utkarsh Chaturvedi",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://utkarshchaturvedi.vercel.app" },
  openGraph: {
    title: "Utkarsh Chaturvedi | Lead Frontend Engineer & Founder at Guidezy",
    description:
      "6+ years building high-performance React, Next.js & real-time aviation platforms. Founder at Guidezy.",
    url: "https://utkarshchaturvedi.vercel.app",
    siteName: "Utkarsh Chaturvedi Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utkarsh Chaturvedi | Lead Frontend Engineer & Founder at Guidezy",
    description:
      "6+ years building high-performance React, Next.js & real-time aviation platforms. Founder at Guidezy.",
    creator: "@utkcha1205",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Utkarsh Chaturvedi",
              url: "https://utkarshchaturvedi.vercel.app",
              jobTitle: "Lead Frontend Engineer",
              worksFor: { "@type": "Organization", name: "Guidezy" },
              sameAs: [
                "https://github.com/utkcha1205",
                "https://www.linkedin.com/in/utkarsh-chaturvedi-8b4690150/",
                "https://medium.com/@utkcha1205",
              ],
              knowsAbout: ["React", "Next.js", "TypeScript", "Aviation Software", "UI Architecture"],
              email: "support@guidezy.in",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
