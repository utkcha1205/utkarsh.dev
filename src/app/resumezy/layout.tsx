import type { Metadata } from "next";
import "./resumezy.css";
import "./resume-print.css";

export const metadata: Metadata = {
  title: "Resumezy ⚡ | Maxx Your Resume & Slay the ATS",
  description: "AI-powered ATS screening shield that guarantees your resume passes Workday, Greenhouse & Lever filters while strictly locking your format with zero surprise changes.",
};

export default function ResumezyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/fonts.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      <div className="resumezy-root">
        {children}
      </div>
    </>
  );
}
