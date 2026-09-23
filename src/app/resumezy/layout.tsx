import type { Metadata, Viewport } from "next";
import "./resumezy.css";
import "./resume-print.css";
import PwaRegister from "@/components/resumezy/PwaRegister";

export const viewport: Viewport = {
  themeColor: "#080c16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Resumezy ⚡ | Maxx Your Resume & Slay the ATS",
  description: "AI-powered ATS screening shield that guarantees your resume passes Workday, Greenhouse & Lever filters while strictly locking your format with zero surprise changes.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Resumezy",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function ResumezyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <div className="resumezy-root">
        <PwaRegister />
        {children}
      </div>
    </>
  );
}
