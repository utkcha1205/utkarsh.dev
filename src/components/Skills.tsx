"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillGroups = [
  {
    title: "FRONTEND STACK",
    color: "text-secondary",
    borderColor: "border-secondary/20",
    skills: ["React", "Next.js", "TypeScript", "Redux Toolkit", "React Query", "React Native", "Webpack"],
  },
  {
    title: "REAL-TIME / BACKEND",
    color: "text-primary",
    borderColor: "border-primary/20",
    skills: ["WebSockets", "Kafka", "Node.js", "Express", "MongoDB"],
  },
  {
    title: "UI & STYLING",
    color: "text-tertiary",
    borderColor: "border-tertiary/20",
    skills: ["Tailwind CSS", "Material UI", "Shadcn", "SCSS"],
  },
  {
    title: "TOOLS & OPS",
    color: "text-on-surface",
    borderColor: "border-white/10",
    skills: ["GitHub", "Jenkins", "Figma", "Jira", "WCAG"],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-40 max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-semibold text-center mb-16 tracking-tight"
      >
        Technical Arsenal
      </motion.h2>

      <div className="space-y-12">
        {skillGroups.map((group, groupIdx) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: groupIdx * 0.15 }}
          >
            <h3 className={`font-mono text-sm ${group.color} mb-6 flex items-center gap-2 uppercase tracking-widest`}>
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {group.skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: groupIdx * 0.15 + i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`px-4 py-2 glass-card rounded-full ${group.color} font-mono text-sm border ${group.borderColor} cursor-default`}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
