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
    <div className="resumezy-root">
      {children}
    </div>
  );
}
