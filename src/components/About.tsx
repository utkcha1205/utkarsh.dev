"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const stats = [
  { value: "6+", label: "Years Experience", color: "text-primary" },
  { value: "14", label: "Team Members Led", color: "text-secondary" },
  { value: "3", label: "Industries", color: "text-tertiary" },
  { value: "40%", label: "UI Effort Reduced", color: "text-primary-container" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-40 max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5"
        >
          <div className="glass-card p-2 rounded-xl relative group">
            <div className="w-full aspect-[4/5] rounded-lg overflow-hidden relative">
              <Image
                src="/utkarsh.jpg"
                alt="Utkarsh Chaturvedi"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 blur-3xl -z-10 group-hover:bg-primary/40 transition-all" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-mono text-sm text-primary uppercase tracking-[0.2em] mb-4 block">
              Biography
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-on-background mb-8 leading-tight">
              Engineering with Precision
            </h2>
            <p className="text-lg text-on-surface-variant mb-12 leading-relaxed max-w-2xl">
              I specialize in creating high-performance web applications that
              demand extreme reliability. At Indigo Airlines, I lead a team of 14
              to build real-time tracking systems where every millisecond counts.
              My philosophy is simple: code should be as elegant as the systems it
              powers.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className={`text-3xl md:text-4xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
