"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

/*
  OPTION 5: "ZEN EDITORIAL"
  ─────────────────────────
  Inspired by linusrogge.com. Dark, editorial, personal.
  Split layout: bio text on left, large image area on right.
  Inline highlighted words reveal floating image clusters on hover.
  Experience as clean rows. "What I like" section. Music player
  at bottom left. Feels like a magazine spread meets personal diary.

  Layout is fundamentally different: asymmetric columns, modal
  information panel, text-image interplay.
*/

const EXPERIENCE = [
  { company: "PwC", role: "Senior Software Engineer, AI", period: "Aug 2025–Now" },
  { company: "Honeywell", role: "Software Engineer, Agentic AI", period: "Jun–Sep 2025" },
  { company: "ArangoDB", role: "Software Engineer, AI/ML", period: "Oct 2024–Jun 2025" },
  { company: "Qualcomm", role: "ML Engineer", period: "Dec 2021–Jun 2024" },
];

const EXPERIENCE_DETAILS: Record<string, string[]> = {
  PwC: [
    "AI-enabled opportunity tracking for firm leadership",
    "Semantic search pipeline across proposals & knowledge assets",
    "Deep Research Agent for client intelligence synthesis",
    "Full-stack TypeScript features aligned with Figma design systems",
  ],
  Honeywell: [
    "LangGraph-orchestrated chatbot for Databricks",
    "SQL, GraphRAG & visualization agents via natural language",
    "AKS deployment with zero-downtime blue-green releases",
  ],
  ArangoDB: [
    "Open-source GraphRAG: 50% → 90% answer accuracy",
    "RL-finetuned LLM for Arango Query Language (+50% accuracy)",
    "langchain-arangodb package adopted by NVIDIA",
  ],
  Qualcomm: [
    "Petabyte-scale CV pipelines for facial modeling",
    "16x speedup via distributed computing",
    "87-camera photogrammetry rig ($35K savings)",
    "4000 hours saved through QC automation",
  ],
};

const THINGS_I_LIKE = [
  "Building things that think",
  "Graph databases",
  "Long walks in SF",
  "Distributed systems",
  "Good coffee",
  "Open source",
  "Teaching",
  "Pixel art",
  "Quiet mornings",
];

// Hover-reveal images that float near the highlighted word
function HoverRevealWord({
  word,
  imagePlaceholder,
  color = "#e5654b",
}: {
  word: string;
  imagePlaceholder: string;
  color?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span className="relative inline-block">
      <span
        ref={ref}
        className="border-b border-dashed cursor-pointer transition-colors"
        style={{ borderColor: hovered ? color : "rgba(255,255,255,0.2)", color: hovered ? color : "inherit" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {word}
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute z-50 -top-32 left-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {/* Image placeholder cluster */}
            <div className="relative w-48 h-28">
              <div
                className="absolute inset-0 rounded-sm flex items-center justify-center text-xs font-mono"
                style={{ backgroundColor: color + "15", border: `1px solid ${color}30`, color: color }}
              >
                {imagePlaceholder}
              </div>
              {/* Decorative offset card behind */}
              <div
                className="absolute -top-2 -right-2 w-full h-full rounded-sm -z-10"
                style={{ backgroundColor: color + "08", border: `1px solid ${color}15` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

function ExperienceRow({
  exp,
  index,
  onSelect,
  isSelected,
}: {
  exp: typeof EXPERIENCE[0];
  index: number;
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <motion.button
      className="w-full flex justify-between items-center py-4 border-t border-white/5 cursor-pointer group text-left"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onClick={onSelect}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            backgroundColor: isSelected ? "#e5654b" : "rgba(255,255,255,0.1)",
          }}
        />
        <span
          className={`text-sm transition-colors ${
            isSelected ? "text-[#e5654b]" : "text-white/80 group-hover:text-white"
          }`}
        >
          {exp.company}
        </span>
        <span className="text-xs text-white/20 hidden sm:inline">{exp.role}</span>
      </div>
      <span className="text-xs text-white/20 font-mono">{exp.period}</span>
    </motion.button>
  );
}

function NowPlaying() {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer group"
      onClick={() => setPlaying(!playing)}
      whileHover={{ x: 2 }}
    >
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
        {playing ? (
          <div className="flex gap-0.5 items-end h-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-[#e5654b]"
                animate={{ height: [4, 10, 6, 12, 4] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="w-0 h-0 border-l-[6px] border-l-white/40 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
        )}
      </div>
      <div>
        <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
          lofi focus beats
        </p>
        <p className="text-[10px] text-white/20">ambient · studying</p>
      </div>
    </motion.div>
  );
}

export default function Option5() {
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="min-h-screen bg-[#111110] text-white/80 relative">
      {/* Main layout: asymmetric two-column */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] relative">
        {/* LEFT COLUMN — Bio text */}
        <div className="px-8 md:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-between relative z-10">
          <div>
            <motion.h1
              className="text-lg font-normal text-white/90 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Ajay Kallepalli
            </motion.h1>

            <motion.div
              className="text-[15px] leading-[1.8] text-white/50 max-w-md space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p>
                I build{" "}
                <HoverRevealWord word="AI systems" imagePlaceholder="🤖 AI Architecture" /> with a
                focus on making intelligence accessible and useful. For me, engineering is a craft—where{" "}
                <HoverRevealWord word="deep technical work" imagePlaceholder="⚡ Systems Design" color="#8b9cf7" />{" "}
                meets real-world impact.
              </p>
              <p>
                Subtle, but with great impact.
              </p>
              <p>
                From{" "}
                <HoverRevealWord word="computer vision" imagePlaceholder="👁 CV Pipelines" color="#7cc5a0" />{" "}
                pipelines processing petabytes of facial data, to{" "}
                <HoverRevealWord word="knowledge graphs" imagePlaceholder="🔗 GraphRAG" color="#d4a056" />{" "}
                that turn messy data into understanding, to{" "}
                <HoverRevealWord word="agentic AI" imagePlaceholder="🧠 Agent Systems" color="#c77dba" />{" "}
                that reasons and acts autonomously—I like building systems that{" "}
                <span className="text-white/70 italic">think</span>.
              </p>
            </motion.div>

            <motion.button
              className="mt-8 text-xs tracking-wider text-white/30 border border-white/10 px-4 py-2 hover:border-white/30 hover:text-white/60 transition-all cursor-pointer"
              onClick={() => setInfoOpen(!infoOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ x: 2 }}
            >
              Information
            </motion.button>
          </div>

          {/* Bottom left: location + music */}
          <motion.div
            className="mt-12 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <NowPlaying />
            <div className="text-xs text-white/20">
              <p>San Francisco, CA</p>
              <p className="text-[10px] text-white/10 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN — Visual / image area */}
        <motion.div
          className="relative min-h-[60vh] lg:min-h-screen overflow-hidden"
          style={{ y: bgY }}
        >
          {/* Placeholder for hero image - gradient for now */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1918] via-[#1f1e1c] to-[#141413]">
            {/* Geometric decorations simulating a workspace photo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-64">
                {/* Monitor shape */}
                <motion.div
                  className="absolute inset-0 border border-white/5 rounded-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {/* Screen content lines */}
                  <div className="p-6 space-y-3">
                    {[0.6, 0.8, 0.4, 0.7, 0.5, 0.9, 0.3].map((w, i) => (
                      <motion.div
                        key={i}
                        className="h-px bg-white/5"
                        style={{ width: `${w * 100}%` }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Floating accent dots */}
                <motion.div
                  className="absolute -top-8 -right-8 w-4 h-4 rounded-full bg-[#e5654b]/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-2 h-2 rounded-full bg-[#8b9cf7]/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                />
              </div>
            </div>

            {/* Add your photo note */}
            <div className="absolute bottom-8 right-8 text-[10px] text-white/10 font-mono">
              [ your photo here ]
            </div>
          </div>
        </motion.div>
      </div>

      {/* INFORMATION PANEL — slides up from bottom like linusrogge */}
      <AnimatePresence>
        {infoOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#111110] border-t border-white/10 max-h-[85vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="max-w-3xl mx-auto px-8 md:px-12 py-10">
                {/* Handle */}
                <div className="flex justify-center mb-8">
                  <div className="w-8 h-0.5 bg-white/10 rounded-full" />
                </div>

                <h2 className="text-sm text-white/90 mb-6">Information</h2>

                {/* Bio blurb */}
                <p className="text-[15px] leading-[1.8] text-white/40 mb-10 max-w-lg">
                  A career full of{" "}
                  <span className="text-white/70">building intelligent systems</span>,{" "}
                  <span className="text-white/70">scaling ML pipelines</span>, and{" "}
                  <span className="text-white/70">pushing the boundaries of AI</span>—influenced
                  deeply by open source, distributed systems, and the
                  belief that the best tools feel effortless.
                </p>

                {/* Experience rows */}
                <div className="mb-10">
                  {EXPERIENCE.map((exp, i) => (
                    <ExperienceRow
                      key={exp.company}
                      exp={exp}
                      index={i}
                      isSelected={selectedExp === exp.company}
                      onSelect={() =>
                        setSelectedExp(selectedExp === exp.company ? null : exp.company)
                      }
                    />
                  ))}
                </div>

                {/* Selected experience details */}
                <AnimatePresence>
                  {selectedExp && EXPERIENCE_DETAILS[selectedExp] && (
                    <motion.div
                      className="mb-10 pl-6 border-l border-[#e5654b]/20"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="text-xs text-[#e5654b] mb-3 tracking-wider">{selectedExp}</p>
                      {EXPERIENCE_DETAILS[selectedExp].map((item, i) => (
                        <motion.p
                          key={i}
                          className="text-sm text-white/40 mb-2 flex items-start gap-2"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <span className="text-white/10">—</span>
                          {item}
                        </motion.p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Education */}
                <div className="mb-10">
                  <h3 className="text-xs text-white/30 tracking-wider mb-4">EDUCATION</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-white/50">
                      <span className="text-white/70">USF</span> — M.S. Data Science{" "}
                      <span className="text-white/20 font-mono text-xs">2025</span>
                    </p>
                    <p className="text-sm text-white/50">
                      <span className="text-white/70">UCLA</span> — B.S. Statistics · B.A.
                      Economics{" "}
                      <span className="text-white/20 font-mono text-xs">2021</span>
                    </p>
                  </div>
                </div>

                {/* What I like */}
                <div className="mb-10">
                  <h3 className="text-xs text-white/30 tracking-wider mb-4">WHAT I LIKE</h3>
                  <div className="space-y-1.5">
                    {THINGS_I_LIKE.map((thing, i) => (
                      <motion.p
                        key={thing}
                        className="text-sm text-white/40 hover:text-white/70 transition-colors cursor-default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        {thing}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* Close button */}
                <div className="flex justify-center pb-4">
                  <motion.button
                    className="text-xs text-white/30 border border-white/10 px-6 py-2 hover:border-white/30 hover:text-white/50 transition-all cursor-pointer"
                    onClick={() => setInfoOpen(false)}
                    whileHover={{ y: -1 }}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom bar nav */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 z-30 flex justify-between items-center px-8 md:px-12 py-4 bg-gradient-to-t from-[#111110] to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div />
        <div className="flex gap-8">
          {["Email", "LinkedIn", "GitHub"].map((link) => (
            <motion.a
              key={link}
              href="#"
              className="text-xs text-white/20 hover:text-white/60 transition-colors"
              whileHover={{ y: -1 }}
            >
              {link}
            </motion.a>
          ))}
        </div>
      </motion.footer>
    </div>
  );
}
