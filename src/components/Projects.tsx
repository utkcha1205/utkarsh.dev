"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const features = [
  {
    icon: "🗺️",
    title: "Live Map Rendering",
    desc: "Vector-tile rendering for fluid zooming across 20+ zoom levels with 0fps drop.",
    span: "md:col-span-2",
  },
  {
    icon: "🔗",
    title: "API Fabric",
    desc: "Seamless integration with global aviation feeds, processing JSON payloads at 5ms intervals.",
    span: "",
  },
  {
    icon: "⚡",
    title: "50% Memory Boost",
    desc: "Optimized WebGL buffer management to reduce memory overhead by half.",
    span: "",
  },
  {
    icon: "📡",
    title: "Real-time Telemetry",
    desc: "WebSocket clusters handling concurrent connections for the entire operations team.",
    span: "md:col-span-2",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 md:py-40 max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
      {/* Featured Project Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-card rounded-2xl md:rounded-3xl overflow-hidden inner-glow group">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 md:p-12 lg:p-20">
              <div className="flex items-center gap-2 text-primary font-mono text-sm mb-6 uppercase tracking-widest">
                ✈️ Featured Project
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-background mb-6 tracking-tight leading-tight">
                6eEye — Indigo Airlines
              </h2>
              <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
                A mission-critical flight tracking and monitoring platform. Built
                to handle massive real-time data streams from hundreds of aircraft
                simultaneously with zero lag.
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                {["Mapbox", "WebSockets", "Node.js", "React", "Kafka"].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-white/5 rounded font-mono text-xs text-primary border border-primary/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="px-6 py-3 border border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95"
                >
                  View Case Study
                </a>
              </div>
            </div>

            {/* Visual */}
            <div className="relative bg-surface-container-low min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 radar-sweep opacity-20" />
              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 md:w-64 md:h-64 border border-primary/30 rounded-full flex items-center justify-center"
                >
                  <div className="w-36 h-36 md:w-48 md:h-48 border border-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 border border-primary/10 rounded-full flex items-center justify-center">
                      <motion.span
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-5xl"
                      >
                        ✈️
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
                <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`glass-card p-8 md:p-10 rounded-xl md:rounded-2xl ${feat.span}`}
          >
            <div className="text-3xl mb-4">{feat.icon}</div>
            <h3 className="text-xl md:text-2xl font-semibold text-on-surface mb-2 tracking-tight">
              {feat.title}
            </h3>
            <p className="text-on-surface-variant">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Results */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { value: "3s", label: "Time to Interactive", sub: "Reduced from 6s" },
          { value: "300+", label: "Active Aircraft", sub: "Tracked simultaneously" },
          { value: "0", label: "Downtime Logged", sub: "99.99% availability" },
        ].map((result, i) => (
          <motion.div
            key={result.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            className="glass-card p-8 rounded-xl text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{result.value}</div>
            <div className="font-mono text-xs text-secondary uppercase tracking-widest mb-1">
              {result.label}
            </div>
            <div className="text-sm text-on-surface-variant">{result.sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
