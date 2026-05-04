"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    company: "Statusneo / Indigo Airlines",
    role: "Lead Frontend Engineer",
    period: "May 2022 — Present",
    color: "primary",
    bullets: [
      "Architected 6eEye, a next-gen flight tracking platform processing real-time aviation data.",
      "Led a cross-functional team of 14 frontend developers to deliver high-availability systems.",
      "Optimized application performance, reducing TTI from 6s to 3s for critical dashboards.",
      "Built and maintained a unified internal Design System used across 5 sub-products.",
    ],
  },
  {
    company: "Publicis Sapient",
    role: "Frontend Developer",
    period: "Aug 2021 — May 2022",
    color: "secondary",
    bullets: [
      "Developed high-fidelity automotive user interfaces for global manufacturing clients.",
      "Implemented strict WCAG 2.1 accessibility compliance across enterprise portals.",
    ],
  },
  {
    company: "83Incs",
    role: "Frontend Developer",
    period: "Mar 2020 — Aug 2021",
    color: "tertiary",
    bullets: [
      "Engineered IoT monitoring dashboards with real-time data visualization using D3.js.",
      "Optimized production bundle sizes by 40% through code splitting and tree shaking.",
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-24 md:py-40 max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-semibold mb-16 tracking-tight"
      >
        The Journey
      </motion.h2>

      <div className="relative space-y-16 md:space-y-24 before:absolute before:left-[11px] before:top-4 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-secondary before:to-transparent">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="relative pl-12 group"
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-background border-2 z-10 ${
                i === 0
                  ? "border-primary shadow-[0_0_15px_rgba(173,198,255,0.5)]"
                  : i === 1
                  ? "border-secondary/50"
                  : "border-tertiary/50"
              }`}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-on-background tracking-tight">
                  {exp.company}
                </h3>
                <p className={`font-mono text-sm uppercase tracking-widest text-${exp.color}`}>
                  {exp.role}
                </p>
              </div>
              <span className="text-on-surface-variant font-mono text-xs bg-white/5 px-3 py-1 rounded mt-2 md:mt-0 w-fit">
                {exp.period}
              </span>
            </div>

            <ul className="space-y-3 text-on-surface-variant max-w-3xl">
              {exp.bullets.map((bullet, j) => (
                <motion.li
                  key={j}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.2 + j * 0.1 }}
                  className="flex gap-3"
                >
                  <span className={`text-${exp.color} font-bold`}>/</span>
                  {bullet}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
