"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categoryStyles: Record<string, { gradient: string; icon: string; accent: string }> = {
  REACT: {
    gradient: "from-blue-600/30 via-cyan-500/20 to-blue-900/40",
    icon: "⚛️",
    accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  "NEXT.JS": {
    gradient: "from-slate-600/30 via-violet-500/20 to-slate-900/40",
    icon: "▲",
    accent: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  TYPESCRIPT: {
    gradient: "from-blue-700/30 via-blue-400/20 to-indigo-900/40",
    icon: "TS",
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
};

const posts = [
  {
    category: "REACT",
    date: "May 1, 2024",
    title: "Hooks in React",
    desc: "In the realm of modern web development, React's introduction of Hooks marked a significant shift in how developers approach building user interfaces — from useState to useTransition.",
    href: "https://medium.com/@utkcha1205/hooks-in-reacts-8a3db53d5785",
    featured: true,
  },
  {
    category: "NEXT.JS",
    date: "Aug 21, 2023",
    title: "Reasons Why Enterprises Can Use Next.js",
    desc: "Exploring why Next.js is becoming the go-to framework for enterprise-grade web applications — SSR, SSG, ISR, i18n routing and more.",
    href: "https://medium.com/@utkcha1205/reasons-why-enterprise-can-use-nextjs-3e6d7314c10b",
  },
  {
    category: "TYPESCRIPT",
    date: "Aug 21, 2023",
    title: "Why TypeScript is Essential for Modern Web",
    desc: "JavaScript is the most popular programming language for front-end development. However, TypeScript has gained massive traction with type safety and better DX.",
    href: "https://medium.com/@utkcha1205/reasons-why-typescript-is-essential-for-modern-web-408b3e864c2b",
  },
  {
    category: "NEXT.JS",
    date: "Aug 3, 2023",
    title: "Build Your Own Next.js Application: A Beginner's Guide",
    desc: "A step-by-step walkthrough covering project setup, file-based routing, SSR, SSG, getStaticProps, getServerSideProps and deployment.",
    href: "https://medium.com/@utkcha1205/build-your-own-nextjs-application-a-beginners-guide-9fe8e549e739",
  },
  {
    category: "REACT",
    date: "Aug 3, 2023",
    title: "What Are React Hooks?",
    desc: "React Hooks are special functions introduced in React 16.8 — useState, useEffect, useContext, useReducer, useCallback, useMemo, and useRef explained.",
    href: "https://medium.com/@utkcha1205/what-are-react-hooks-b02069f7b66f",
  },
  {
    category: "REACT",
    date: "Jul 7, 2023",
    title: "Mastering API Data Fetching in React",
    desc: "A comprehensive guide covering Fetch API, Axios, async/await, custom hooks, and React Query for efficient data fetching patterns.",
    href: "https://medium.com/@utkcha1205/mastering-api-data-fetching-in-react-a-comprehensive-guide-1f0f0776e3b3",
  },
];

function CategoryBanner({ category, large }: { category: string; large?: boolean }) {
  const style = categoryStyles[category] || categoryStyles.REACT;
  return (
    <div className={`relative w-full ${large ? "min-h-[250px] md:min-h-[350px]" : "h-44"} bg-gradient-to-br ${style.gradient} overflow-hidden flex items-center justify-center`}>
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Floating glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
      {/* Icon */}
      <span className={`relative z-10 ${large ? "text-7xl md:text-8xl" : "text-5xl"} opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500 select-none`}>
        {style.icon}
      </span>
      {/* Code lines decoration */}
      <div className="absolute bottom-4 left-4 space-y-1.5 opacity-20">
        <div className="h-1 w-16 bg-white/40 rounded" />
        <div className="h-1 w-24 bg-white/30 rounded" />
        <div className="h-1 w-12 bg-white/20 rounded" />
      </div>
    </div>
  );
}

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featured = posts.find((p) => p.featured);
  const recent = posts.filter((p) => !p.featured);

  return (
    <section id="blog" className="py-24 md:py-40 max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <span className="font-mono text-sm text-secondary uppercase tracking-widest mb-3 block">
          Latest Insights
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-background tracking-tight">
          Engineering Log.
        </h2>
        <p className="text-lg text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
          Deep dives into React, real-time systems, and frontend architecture.
        </p>
      </motion.div>

      <div className="custom-divider mb-16" />

      {/* Featured Post */}
      {featured && (
        <motion.a
          href={featured.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="glass-card rounded-xl overflow-hidden cursor-pointer group mb-16 block"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className={`font-mono text-xs px-3 py-1 rounded-full border ${categoryStyles[featured.category]?.accent || "text-secondary bg-secondary/10 border-secondary/20"}`}>
                    {featured.category}
                  </span>
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">
                    {featured.date}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors tracking-tight">
                  {featured.title}
                </h3>
                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                  {featured.desc}
                </p>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-widest mt-8 group-hover:gap-3 transition-all">
                Read on Medium
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
            <CategoryBanner category={featured.category} large />
          </div>
        </motion.a>
      )}

      {/* Recent Articles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <h3 className="text-2xl font-semibold text-white tracking-tight">Recent Articles</h3>
        <a
          href="https://medium.com/@utkcha1205"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-primary uppercase tracking-widest hover:underline whitespace-nowrap"
        >
          View all on Medium →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recent.map((post, i) => {
          const style = categoryStyles[post.category] || categoryStyles.REACT;
          return (
            <motion.a
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card flex flex-col rounded-xl cursor-pointer overflow-hidden group"
            >
              {/* Banner */}
              <CategoryBanner category={post.category} />

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`font-mono text-[10px] px-2.5 py-1 rounded-full border ${style.accent}`}>
                    {post.category}
                  </span>
                  <span className="font-mono text-[10px] text-outline uppercase tracking-widest">
                    {post.date}
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-white mb-3 leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 flex-1">
                  {post.desc}
                </p>

                <div className="pt-5 mt-auto flex justify-between items-center border-t border-white/5">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest group-hover:gap-2 flex items-center gap-1 transition-all">
                    Read article
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="text-outline text-xs">↗</span>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
