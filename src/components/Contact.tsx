"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const channels = [
  { icon: "🚀", label: "support@guidezy.in", href: "mailto:support@guidezy.in", tag: "Guidezy Support" },
  { icon: "👤", label: "utkarsh@guidezy.in", href: "mailto:utkarsh@guidezy.in", tag: "Personal" },
  { icon: "🏢", label: "founder@guidezy.in", href: "mailto:founder@guidezy.in", tag: "Founder" },
  { icon: "💼", label: "LinkedIn", href: "https://www.linkedin.com/in/utkarsh-chaturvedi-8b4690150/" },
  { icon: "💻", label: "GitHub", href: "https://github.com/utkcha1205" },
  { icon: "📝", label: "Medium Blog", href: "https://medium.com/@utkcha1205" },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  return (
    <section id="contact" className="py-24 md:py-40 max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-background tracking-tight mb-4">
          Let&apos;s build something{" "}
          <span className="text-primary">remarkable.</span>
        </h2>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
          Currently open to high-impact opportunities in frontend architecture,
          systems design, and creative engineering.
        </p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="col-span-12 lg:col-span-7 glass-card p-8 md:p-10 rounded-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-8 tracking-tight">
            Send a Message
          </h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs text-secondary uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-secondary uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-secondary uppercase tracking-widest">
                Project Brief
              </label>
              <textarea
                placeholder="Tell me about what you're building..."
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50 resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary font-mono text-sm uppercase tracking-widest inner-glow hover:brightness-110 transition-all rounded-lg font-bold"
            >
              Transmit Signal
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="col-span-12 lg:col-span-5 flex flex-col gap-6"
        >
          {/* Social Links */}
          <div className="glass-card p-6 md:p-8 rounded-xl flex-grow">
            <h3 className="font-mono text-xs text-secondary uppercase tracking-widest mb-6">
              Direct Channels
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {channels.map((ch, i) => (
                <motion.a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{ch.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-on-surface text-sm">{ch.label}</span>
                      {"tag" in ch && ch.tag && (
                        <span className="text-[10px] font-mono text-primary/70 uppercase tracking-wider">{ch.tag}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-outline group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="glass-card rounded-xl overflow-hidden h-[200px] relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-primary/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 z-10">
              <p className="font-mono text-xs text-primary uppercase mb-1 tracking-wider">
                Current Base
              </p>
              <p className="text-2xl font-semibold text-white">Gurgaon, India</p>
            </div>
            <div className="absolute top-6 right-6 z-10">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(173,198,255,0.8)]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Info */}
      <div className="mt-16 custom-divider" />
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { label: "Availability", value: "Immediate" },
          { label: "Local Time", value: "IST (UTC +5:30)" },
          { label: "Language", value: "English, Hindi" },
          { label: "Status", value: "Open to Work" },
        ].map((info) => (
          <div key={info.label} className="space-y-1">
            <p className="font-mono text-xs text-secondary uppercase tracking-widest">
              {info.label}
            </p>
            <p className="text-on-surface text-sm">{info.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
