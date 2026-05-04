"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const philosophies = [
  {
    icon: "🧠",
    title: "Mentorship First",
    desc: "Building autonomous teams by fostering radical transparency and continuous feedback loops.",
    color: "primary",
  },
  {
    icon: "🔄",
    title: "Systems Thinking",
    desc: "Designing for 10x growth by anticipating failures and building resilient, decoupled architectures.",
    color: "secondary",
    highlighted: true,
  },
  {
    icon: "✅",
    title: "Agile Mastery",
    desc: "Optimizing scrum cycles to balance technical debt with aggressive feature delivery roadmaps.",
    color: "tertiary",
  },
];

const metrics = [
  { value: "14", label: "Engineers Managed", icon: "👥" },
  { value: "40%", label: "Reduction in dev effort", icon: "📐" },
  { value: "60%", label: "Faster onboarding", icon: "🚀" },
  { value: "150%", label: "Velocity Increase", icon: "📈" },
];

export default function Leadership() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-40 max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <span className="font-mono text-sm text-primary uppercase tracking-[0.2em] mb-4 block">
          Executive Engineering
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient tracking-tight mb-4">
          Leadership & Vision
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card p-6 md:p-8 rounded-xl text-center"
          >
            <div className="text-3xl mb-3">{metric.icon}</div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{metric.value}</div>
            <div className="font-mono text-[10px] md:text-xs text-on-surface-variant uppercase tracking-wider">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Philosophy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {philosophies.map((phil, i) => (
          <motion.div
            key={phil.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
            whileHover={{ y: -6 }}
            className={`glass-card p-8 md:p-10 rounded-xl text-center ${
              phil.highlighted
                ? "border-primary/30 scale-[1.02] shadow-2xl shadow-primary/10"
                : ""
            }`}
          >
            <div className="text-5xl mb-6">{phil.icon}</div>
            <h3 className="text-xl md:text-2xl font-semibold text-on-background mb-4">
              {phil.title}
            </h3>
            <p className="text-on-surface-variant leading-relaxed">{phil.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
