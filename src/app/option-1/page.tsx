"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

/*
  OPTION 1: "AMBER TERMINAL"
  ──────────────────────────
  Retro CRT terminal aesthetic. Amber/green phosphor on dark.
  Text types itself. Scanline overlay. Sections appear like
  command outputs. Karateka-era computer vibes meets modern
  minimalism. Hidden interactions everywhere.
*/

const RESUME = {
  name: "Ajay Kallepalli",
  title: "Senior Software Engineer, AI",
  location: "San Francisco, CA",
  email: "ajay.r.kallepalli@gmail.com",
  experience: [
    { company: "PwC", role: "Senior Software Engineer, AI", date: "Aug 2025 - Present", detail: "Architected AI-enabled opportunity tracking, semantic search pipelines, and Deep Research Agents for firm leadership." },
    { company: "Honeywell", role: "Software Engineer, Agentic AI", date: "Jun - Sep 2025", detail: "Delivered LangGraph-orchestrated chatbot for Databricks users with SQL, GraphRAG, and visualization agents." },
    { company: "ArangoDB", role: "Software Engineer, AI/ML", date: "Oct 2024 - Jun 2025", detail: "Built open-source GraphRAG solution boosting accuracy from 50% to 90%. RL-finetuned LLM copilot for graph queries." },
    { company: "Qualcomm", role: "ML Engineer", date: "Dec 2021 - Jun 2024", detail: "Built CV pipelines for petabyte-scale facial modeling data. Achieved 16x speedup via distributed computing." },
  ],
  skills: ["Python", "TypeScript", "PyTorch", "LangChain", "Docker", "K8s", "AWS", "React", "GraphRAG", "vLLM"],
};

function TypeWriter({ text, speed = 30, delay = 0, className = "" }: { text: string; speed?: number; delay?: number; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      return () => clearTimeout(timeout);
    }
  }, [displayed, started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="animate-pulse">▊</span>
      )}
    </span>
  );
}

function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="h-full w-full opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
          backgroundSize: "100% 2px",
        }}
      />
      <div className="absolute inset-0 opacity-[0.02] animate-flicker bg-white" />
    </div>
  );
}

function NavDot({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="group flex items-center gap-3 cursor-pointer"
      whileHover={{ x: 4 }}
    >
      <motion.div
        className={`w-2 h-2 rounded-full border ${active ? "bg-amber-400 border-amber-400" : "border-amber-400/40"}`}
        animate={{ scale: active ? [1, 1.3, 1] : 1 }}
        transition={{ repeat: active ? Infinity : 0, duration: 2 }}
      />
      <span className={`font-mono text-xs tracking-widest uppercase transition-opacity ${active ? "opacity-100 text-amber-400" : "opacity-0 group-hover:opacity-60 text-amber-400/60"}`}>
        {label}
      </span>
    </motion.button>
  );
}

function ExperienceCard({ exp, index }: { exp: typeof RESUME.experience[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border border-amber-400/20 p-4 cursor-pointer group hover:border-amber-400/60 transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-amber-400 font-mono text-sm">{exp.company}</span>
          <span className="text-amber-400/40 font-mono text-xs ml-2">// {exp.role}</span>
        </div>
        <span className="text-amber-400/30 font-mono text-xs">{exp.date}</span>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-amber-400/60 font-mono text-xs mt-3 leading-relaxed overflow-hidden"
          >
            &gt; {exp.detail}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.div
        className="h-px bg-amber-400/20 mt-3 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
}

export default function Option1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [activeSection, setActiveSection] = useState("intro");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const glowOpacity = useTransform(scrollYProgress, [0, 0.1], [0.15, 0.05]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a08] text-amber-400 relative overflow-x-hidden">
      <Scanlines />

      {/* Mouse-following glow */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl bg-amber-400/10 z-0"
        animate={{ x: mousePos.x - 192, y: mousePos.y - 192 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        style={{ opacity: glowOpacity }}
      />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-px bg-amber-400 z-50 origin-left"
        style={{ scaleX: scrollYProgress, width: "100%" }}
      />

      {/* Side nav dots */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        {["intro", "experience", "skills", "contact"].map((s) => (
          <NavDot key={s} label={s} active={activeSection === s} onClick={() => scrollTo(s)} />
        ))}
      </nav>

      {/* INTRO */}
      <section id="intro" className="min-h-screen flex flex-col justify-center px-8 md:px-24 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="font-mono text-amber-400/40 text-xs mb-4">
            <TypeWriter text="$ whoami" speed={80} />
          </p>
          <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight">
            <TypeWriter text="Ajay Kallepalli" delay={800} speed={50} />
          </h1>
          <motion.p
            className="font-mono text-amber-400/60 text-lg mt-6 max-w-xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            Senior Software Engineer building AI systems in San Francisco.
            <br />
            From computer vision pipelines to agentic AI.
          </motion.p>
          <motion.div
            className="flex gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            {["email", "linkedin", "github"].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="font-mono text-xs text-amber-400/40 hover:text-amber-400 transition-colors uppercase tracking-widest border-b border-transparent hover:border-amber-400/40"
                whileHover={{ y: -2 }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-8 md:left-24 font-mono text-xs text-amber-400/20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↓ scroll
        </motion.div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="min-h-screen px-8 md:px-24 py-24 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-amber-400/40 text-xs mb-2">$ cat experience.log</p>
          <h2 className="text-3xl font-mono font-bold mb-12">Experience</h2>
        </motion.div>
        <div className="space-y-4">
          {RESUME.experience.map((exp, i) => (
            <ExperienceCard key={exp.company} exp={exp} index={i} />
          ))}
        </div>
        <motion.div
          className="mt-8 font-mono text-xs text-amber-400/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          // click to expand details
        </motion.div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="min-h-screen px-8 md:px-24 py-24 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-amber-400/40 text-xs mb-2">$ echo $SKILLS</p>
          <h2 className="text-3xl font-mono font-bold mb-12">Skills</h2>
        </motion.div>
        <div className="flex flex-wrap gap-3">
          {RESUME.skills.map((skill, i) => (
            <motion.span
              key={skill}
              className="font-mono text-sm px-4 py-2 border border-amber-400/20 hover:border-amber-400 hover:bg-amber-400/10 transition-all cursor-default"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="min-h-[50vh] px-8 md:px-24 py-24 max-w-4xl relative z-10 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-amber-400/40 text-xs mb-2">$ ping ajay</p>
          <h2 className="text-3xl font-mono font-bold mb-6">Get in Touch</h2>
          <p className="font-mono text-amber-400/60 text-sm">
            ajay.r.kallepalli@gmail.com
          </p>
          <p className="font-mono text-amber-400/30 text-xs mt-12">
            Built with Next.js · {new Date().getFullYear()}
          </p>
        </motion.div>
      </section>

      <style jsx global>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.04; }
        }
        .animate-flicker {
          animation: flicker 0.15s infinite;
        }
      `}</style>
    </div>
  );
}
