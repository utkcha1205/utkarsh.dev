"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-8 h-16 md:h-20">
        <Link
          href="/"
          className="text-lg md:text-xl font-bold tracking-tighter text-white"
        >
          Utkarsh Chaturvedi
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-400 font-medium text-sm tracking-tight hover:text-white transition-colors hover:bg-white/5 rounded-md px-3 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/resumezy"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
          >
            <span>✨</span>
            <span>Resumezy AI</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold">New</span>
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg text-sm font-semibold inner-glow hover:brightness-110 active:scale-95 transition-all"
          >
            Resume
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10"
      >
        <nav className="flex flex-col px-6 py-4 gap-2">
          <Link
            href="/resumezy"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-sm font-semibold mb-1"
          >
            <span className="flex items-center gap-2">
              <span>✨</span>
              <span>Resumezy AI (ATS Shield)</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">New</span>
          </Link>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-slate-300 hover:text-white py-3 border-b border-white/5 text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            className="mt-2 bg-primary-container text-on-primary-container px-5 py-3 rounded-lg text-sm font-semibold text-center"
          >
            Resume
          </a>
        </nav>
      </motion.div>
    </motion.header>
  );
}
