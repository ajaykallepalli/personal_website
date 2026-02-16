"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/*
  OPTION 2: "PIXEL DOJO"
  ──────────────────────
  Karateka-inspired. Warm cream/paper background, pixel-style
  accents, chunky geometric shapes. Sections separated by
  horizontal rules that draw themselves. Experience entries
  unfold like game level descriptions. Earthy palette with
  a single punch of red-orange. Motion is snappy & decisive
  like karate moves.
*/

const RESUME = {
  name: "AJAY KALLEPALLI",
  subtitle: "SENIOR SOFTWARE ENGINEER, AI",
  location: "SAN FRANCISCO, CA",
  experience: [
    { company: "PwC", role: "Senior Software Engineer, AI", period: "2025—PRESENT", description: "Architected AI-enabled opportunity tracking. Built semantic search pipelines. Prototyped Deep Research Agents for firm leadership. $50M+ pipeline visibility.", level: "05" },
    { company: "Honeywell", role: "Software Engineer, Agentic AI", period: "2025", description: "LangGraph-orchestrated chatbot for Databricks. SQL, GraphRAG, and visualization agents. AKS deployment with blue-green releases.", level: "04" },
    { company: "ArangoDB", role: "Software Engineer, AI/ML", period: "2024—2025", description: "Open-source GraphRAG: 50% → 90% accuracy. RL-finetuned LLM for graph queries. Drove adoption by NVIDIA's team.", level: "03" },
    { company: "Qualcomm", role: "ML Engineer", period: "2021—2024", description: "Petabyte-scale CV pipelines. 16x processing speedup. 87-camera photogrammetry rig. Saved $35K consulting + 4000 engineering hours.", level: "02" },
  ],
  education: [
    { school: "USF", degree: "M.S. Data Science", year: "2025" },
    { school: "UCLA", degree: "B.S. Statistics, B.A. Economics", year: "2021" },
  ],
  skills: ["Python", "TypeScript", "PyTorch", "TensorFlow", "LangChain", "Docker", "Kubernetes", "AWS", "React", "GraphRAG"],
};

function PixelBorder({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`h-1 bg-[#c1440e] ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ originX: 0, imageRendering: "pixelated" }}
    />
  );
}

function LevelCard({ exp, index }: { exp: typeof RESUME.experience[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Level number */}
      <motion.div
        className="absolute -left-16 top-0 font-mono text-6xl font-black text-[#c1440e]/10 select-none"
        animate={{ opacity: hovered ? 0.3 : 0.1, scale: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {exp.level}
      </motion.div>

      <div className="border-l-4 border-[#c1440e]/20 group-hover:border-[#c1440e] transition-colors pl-6 py-4">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="font-mono text-xl font-bold text-[#1a1a18] tracking-tight">{exp.company}</h3>
          <span className="font-mono text-xs text-[#1a1a18]/40 tracking-widest">{exp.period}</span>
        </div>
        <p className="font-mono text-xs text-[#c1440e] tracking-wider mt-1">{exp.role}</p>

        <motion.div
          className="overflow-hidden"
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-mono text-sm text-[#1a1a18]/60 mt-3 leading-relaxed max-w-lg">
            {exp.description}
          </p>
        </motion.div>
      </div>

      {/* Pixel decoration on hover */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-px"
        animate={{ opacity: hovered ? 1 : 0 }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-[#c1440e]"
            animate={{ scale: hovered ? 1 : 0 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function SkillPixel({ skill, index }: { skill: string; index: number }) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.span
        className="inline-block font-mono text-xs tracking-wider px-4 py-2 bg-[#1a1a18] text-[#f5f0e8] cursor-default"
        whileHover={{
          scale: 1.1,
          backgroundColor: "#c1440e",
          transition: { duration: 0.1 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        {skill}
      </motion.span>
    </motion.div>
  );
}

export default function Option2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  // Pixel grid cursor effect
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Snap to 8px grid for pixel feel
      cursorX.set(Math.round(e.clientX / 8) * 8);
      cursorY.set(Math.round(e.clientY / 8) * 8);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorX, cursorY]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f5f0e8] text-[#1a1a18] relative selection:bg-[#c1440e] selection:text-[#f5f0e8]">
      {/* Pixel cursor follower */}
      <motion.div
        className="pointer-events-none fixed w-4 h-4 border-2 border-[#c1440e] z-50 mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Top progress pixels */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-[#1a1a18]/5">
        <motion.div className="h-full bg-[#c1440e] origin-left" style={{ scaleX: smoothProgress }} />
      </div>

      {/* Fixed nav */}
      <nav className="fixed top-0 right-0 z-40 p-8">
        <div className="flex gap-6">
          {["work", "skills", "education"].map((section) => (
            <motion.a
              key={section}
              href={`#${section}`}
              className="font-mono text-xs tracking-widest uppercase text-[#1a1a18]/40 hover:text-[#c1440e] transition-colors"
              whileHover={{ y: -2 }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {section}
            </motion.a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <motion.section
        className="min-h-screen flex flex-col justify-center px-8 md:px-24 lg:px-32 relative"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="max-w-3xl">
          {/* Decorative pixel block */}
          <motion.div
            className="flex gap-1 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-[#c1440e]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 500 }}
              />
            ))}
          </motion.div>

          <motion.h1
            className="font-mono text-5xl md:text-8xl font-black tracking-tighter leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {RESUME.name}
          </motion.h1>

          <motion.div
            className="mt-6 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-8 h-px bg-[#c1440e]" />
            <p className="font-mono text-sm tracking-widest text-[#1a1a18]/50">
              {RESUME.subtitle}
            </p>
          </motion.div>

          <motion.p
            className="font-mono text-xs tracking-widest text-[#1a1a18]/30 mt-2 ml-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {RESUME.location}
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-8 md:left-24 lg:left-32"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-px h-12 bg-[#c1440e]/30" />
        </motion.div>
      </motion.section>

      {/* WORK / EXPERIENCE */}
      <section id="work" className="px-8 md:px-24 lg:px-32 py-24 max-w-4xl">
        <PixelBorder className="mb-12" />
        <motion.p
          className="font-mono text-xs tracking-[0.3em] text-[#c1440e] mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          CHAPTER
        </motion.p>
        <motion.h2
          className="font-mono text-4xl font-black tracking-tight mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          WORK
        </motion.h2>

        <div className="space-y-8 ml-16">
          {RESUME.experience.map((exp, i) => (
            <LevelCard key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="px-8 md:px-24 lg:px-32 py-24 max-w-4xl">
        <PixelBorder className="mb-12" />
        <motion.p
          className="font-mono text-xs tracking-[0.3em] text-[#c1440e] mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          INVENTORY
        </motion.p>
        <motion.h2
          className="font-mono text-4xl font-black tracking-tight mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          SKILLS
        </motion.h2>

        <div className="flex flex-wrap gap-2">
          {RESUME.skills.map((skill, i) => (
            <SkillPixel key={skill} skill={skill} index={i} />
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="px-8 md:px-24 lg:px-32 py-24 max-w-4xl">
        <PixelBorder className="mb-12" />
        <motion.p
          className="font-mono text-xs tracking-[0.3em] text-[#c1440e] mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          TRAINING
        </motion.p>
        <motion.h2
          className="font-mono text-4xl font-black tracking-tight mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          EDUCATION
        </motion.h2>

        <div className="space-y-6">
          {RESUME.education.map((edu, i) => (
            <motion.div
              key={edu.school}
              className="flex items-baseline gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="font-mono text-2xl font-black">{edu.school}</span>
              <span className="font-mono text-xs text-[#1a1a18]/40 tracking-wider">{edu.degree}</span>
              <span className="font-mono text-xs text-[#c1440e]">{edu.year}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <section className="px-8 md:px-24 lg:px-32 py-24">
        <PixelBorder className="mb-8" />
        <div className="flex justify-between items-end">
          <div>
            <p className="font-mono text-sm text-[#1a1a18]/60">ajay.r.kallepalli@gmail.com</p>
            <div className="flex gap-4 mt-2">
              {["LinkedIn", "GitHub"].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  className="font-mono text-xs text-[#c1440e] tracking-wider hover:underline"
                  whileHover={{ x: 4 }}
                >
                  {link} →
                </motion.a>
              ))}
            </div>
          </div>
          <p className="font-mono text-xs text-[#1a1a18]/20">{new Date().getFullYear()}</p>
        </div>
      </section>
    </div>
  );
}
