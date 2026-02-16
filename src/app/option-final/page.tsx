"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════
// KARATEKA CHARACTER — small pixel fighter, easter egg trigger
// ═══════════════════════════════════════════
function KaratekaChar({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [frame, setFrame] = useState(0);

  // Idle animation — subtle breathing / stance shift
  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => f + 1), 600);
    return () => clearInterval(interval);
  }, []);

  const pose = frame % 3; // 0: standing, 1: shift weight, 2: arms up slightly

  return (
    <motion.div
      className="cursor-pointer relative group"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      title="?"
    >
      <svg
        width="24"
        height="32"
        viewBox="0 0 8 11"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Head */}
        <rect x="2" y="0" width="4" height="3" fill={hovered ? "#e5654b" : "#e5654b80"} />
        {/* Eye */}
        <rect x="4" y="1" width="1" height="1" fill="#0a0a08" />
        {/* Body */}
        <rect x="2" y="3" width="4" height="3" fill={hovered ? "#f5f0e8" : "#f5f0e880"} />
        {/* Belt */}
        <rect x="2" y="4" width="4" height="1" fill={hovered ? "#c1440e" : "#c1440e80"} />
        {/* Arms — karate stance */}
        {pose === 0 && (
          <>
            <rect x="0" y="3" width="2" height="1" fill={hovered ? "#e5654b" : "#e5654b60"} />
            <rect x="6" y="4" width="2" height="1" fill={hovered ? "#e5654b" : "#e5654b60"} />
          </>
        )}
        {pose === 1 && (
          <>
            <rect x="0" y="4" width="2" height="1" fill={hovered ? "#e5654b" : "#e5654b60"} />
            <rect x="6" y="3" width="2" height="1" fill={hovered ? "#e5654b" : "#e5654b60"} />
          </>
        )}
        {pose === 2 && (
          <>
            <rect x="0" y="3" width="2" height="1" fill={hovered ? "#e5654b" : "#e5654b60"} />
            <rect x="6" y="3" width="2" height="1" fill={hovered ? "#e5654b" : "#e5654b60"} />
          </>
        )}
        {/* Legs — wide karate stance */}
        <rect x="1" y="6" width="2" height="3" fill={hovered ? "#1a1a18" : "#1a1a1880"} />
        <rect x="5" y="6" width="2" height="3" fill={hovered ? "#1a1a18" : "#1a1a1880"} />
        {/* Feet spread */}
        <rect x="0" y="9" width="2" height="2" fill={hovered ? "#1a1a18" : "#1a1a1860"} />
        <rect x="6" y="9" width="2" height="2" fill={hovered ? "#1a1a18" : "#1a1a1860"} />
      </svg>
      {/* Tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] text-amber-400/40"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            fight?
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// CRT EFFECTS — scanlines + flicker
// ═══════════════════════════════════════════
function CRTOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {/* Scanlines */}
      <div
        className="h-full w-full opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
          backgroundSize: "100% 2px",
        }}
      />
      {/* Flicker */}
      <div className="absolute inset-0 opacity-[0.015] animate-flicker bg-white" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════
function TypeWriter({ text, speed = 30, delay = 0, className = "" }: {
  text: string; speed?: number; delay?: number; className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || displayed.length >= text.length) return;
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
    return () => clearTimeout(t);
  }, [displayed, started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && <span className="animate-pulse">▊</span>}
    </span>
  );
}

// ═══════════════════════════════════════════
// HOVER WORD
// ═══════════════════════════════════════════
function HoverWord({ word, detail }: { word: string; detail: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span className="relative inline-block">
      <span
        className={`border-b border-dashed cursor-help transition-colors duration-200 ${
          hovered ? "text-amber-400 border-amber-400" : "text-amber-400/70 border-amber-400/30"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {word}
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute z-50 -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-amber-400/60 bg-[#0a0a08] border border-amber-400/20 px-2 py-1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {detail}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ═══════════════════════════════════════════
// NAV DOT
// ═══════════════════════════════════════════
function NavDot({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button onClick={onClick} className="group flex items-center gap-3 cursor-pointer" whileHover={{ x: 4 }}>
      <motion.div
        className={`w-2 h-2 rounded-full border transition-colors ${active ? "bg-amber-400 border-amber-400" : "border-amber-400/30"}`}
        animate={{ scale: active ? [1, 1.3, 1] : 1 }}
        transition={{ repeat: active ? Infinity : 0, duration: 2 }}
      />
      <span className={`font-mono text-xs tracking-widest uppercase transition-all duration-200 ${
        active ? "opacity-100 text-amber-400" : "opacity-0 group-hover:opacity-60 text-amber-400/50"
      }`}>
        {label}
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const EXPERIENCE = [
  { company: "PwC", role: "Senior Software Engineer, AI", period: "Aug 2025–Now", items: ["AI opportunity tracking for firm leadership", "Semantic search across knowledge assets", "Deep Research Agent for client intelligence", "$50M+ pipeline visibility", "Full-stack TypeScript with Figma design systems"] },
  { company: "Honeywell", role: "Software Engineer, Agentic AI", period: "Jun–Sep 2025", items: ["LangGraph chatbot with SQL, GraphRAG & viz agents", "AKS deployment with zero-downtime blue-green releases"] },
  { company: "ArangoDB", role: "Software Engineer, AI/ML", period: "Oct 2024–Jun 2025", items: ["GraphRAG: 50% → 90% answer accuracy", "RL-finetuned LLM for graph queries", "langchain-arangodb adopted by NVIDIA"] },
  { company: "Qualcomm", role: "ML Engineer", period: "Dec 2021–Jun 2024", items: ["Petabyte-scale CV pipelines for facial modeling", "16x speedup via distributed computing", "87-camera photogrammetry ($35K savings)", "4000 hours saved through QC automation"] },
];
const SKILLS = ["Python", "TypeScript", "PyTorch", "LangChain", "Docker", "K8s", "AWS", "React", "GraphRAG", "FastAPI", "vLLM", "Spark"];
const LIKES = ["Building things that think", "Graph databases", "Long walks in SF", "Distributed systems", "Good coffee", "Open source", "Teaching", "Pixel art", "Quiet mornings"];
const DISLIKES = ["Unnecessary meetings", "Vendor lock-in", "Magic numbers"];

// ═══════════════════════════════════════════
// INFO PANEL — slide-up, auto-open/close on scroll, subtle blend style
// ═══════════════════════════════════════════
function InfoPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedExp, setSelectedExp] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[80] bg-[#0d0d0b]/95 backdrop-blur-md border-t border-amber-400/10 max-h-[85vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 200 }}
          >
            <div className="max-w-2xl mx-auto px-8 py-10">
              {/* Handle */}
              <div className="flex justify-center mb-6">
                <div className="w-10 h-0.5 bg-white/10 rounded-full" />
              </div>

              <p className="font-mono text-amber-400/30 text-xs mb-1">$ man ajay</p>
              <h2 className="font-mono text-white/80 text-lg mb-6 font-medium">Information</h2>

              <p className="text-sm text-white/40 leading-relaxed mb-10 max-w-lg font-mono">
                A career building <span className="text-white/65">intelligent systems</span>,{" "}
                <span className="text-white/65">scaling ML pipelines</span>, and{" "}
                <span className="text-white/65">pushing AI boundaries</span>.
                Guided by open source, distributed systems, and making tools that feel effortless.
              </p>

              {/* Experience */}
              <p className="font-mono text-xs text-white/20 tracking-[0.3em] mb-4">EXPERIENCE</p>
              {EXPERIENCE.map((exp, i) => (
                <div key={exp.company}>
                  <motion.button
                    className="w-full flex justify-between items-center py-3 border-t border-white/5 cursor-pointer group text-left"
                    onClick={() => setSelectedExp(selectedExp === exp.company ? null : exp.company)}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full transition-colors"
                        animate={{ backgroundColor: selectedExp === exp.company ? "#e5654b" : "rgba(255,255,255,0.1)" }}
                      />
                      <span className={`font-mono text-sm transition-colors ${
                        selectedExp === exp.company ? "text-[#e5654b]" : "text-white/60 group-hover:text-white/80"
                      }`}>
                        {exp.company}
                      </span>
                      <span className="font-mono text-xs text-white/20 hidden sm:inline">{exp.role}</span>
                    </div>
                    <span className="font-mono text-xs text-white/15">{exp.period}</span>
                  </motion.button>

                  <AnimatePresence>
                    {selectedExp === exp.company && (
                      <motion.div
                        className="pl-7 pb-4 border-l border-[#e5654b]/20 ml-[3px] overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="font-mono text-[10px] text-white/20 mb-2">{exp.role}</p>
                        {exp.items.map((item, j) => (
                          <motion.p
                            key={j}
                            className="font-mono text-xs text-white/35 py-1 flex gap-2"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.05 }}
                          >
                            <span className="text-white/10">›</span> {item}
                          </motion.p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Education */}
              <div className="mt-8 mb-6">
                <p className="font-mono text-xs text-white/20 tracking-[0.3em] mb-3">EDUCATION</p>
                <p className="font-mono text-sm text-white/45">
                  <span className="text-white/65">USF</span> — M.S. Data Science{" "}
                  <span className="text-white/15 text-xs">2025</span>
                </p>
                <p className="font-mono text-sm text-white/45 mt-1">
                  <span className="text-white/65">UCLA</span> — B.S. Statistics · B.A. Economics{" "}
                  <span className="text-white/15 text-xs">2021</span>
                </p>
              </div>

              {/* Likes / Dislikes */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="font-mono text-xs text-white/20 tracking-[0.3em] mb-3">WHAT I LIKE</p>
                  {LIKES.map((l) => (
                    <p key={l} className="font-mono text-sm text-white/30 py-0.5 hover:text-white/55 transition-colors cursor-default">
                      {l}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="font-mono text-xs text-[#e5654b]/30 tracking-[0.3em] mb-3">WHAT I DON&apos;T</p>
                  {DISLIKES.map((d) => (
                    <p key={d} className="font-mono text-sm text-white/20 py-0.5 hover:text-[#e5654b]/40 transition-colors cursor-default">
                      {d}
                    </p>
                  ))}
                </div>
              </div>

              {/* Resume PDF + Close */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                <motion.a
                  href="/resume.pdf"
                  className="font-mono text-xs text-[#e5654b]/50 hover:text-[#e5654b] transition-colors"
                  whileHover={{ x: 4 }}
                >
                  Download resume (PDF) →
                </motion.a>
                <motion.button
                  className="font-mono text-xs text-white/20 border border-white/8 px-4 py-2 hover:border-white/20 hover:text-white/40 cursor-pointer transition-all"
                  onClick={onClose}
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
  );
}

// ═══════════════════════════════════════════
// PLATFORMER GAME
// ═══════════════════════════════════════════
const GW = 550;
const GH = 750;
const GRAV = 0.4;
const JFORCE = -9.5;
const MSPD = 4.5;
const PW = 22;
const PH = 26;

const PLATS = [
  { x: 60, y: 670, w: 130, label: "UCLA", sub: "2017–2021" },
  { x: 300, y: 570, w: 150, label: "Qualcomm", sub: "ML Engineer" },
  { x: 80, y: 460, w: 150, label: "ArangoDB", sub: "AI/ML Engineer" },
  { x: 310, y: 360, w: 150, label: "Honeywell", sub: "Agentic AI" },
  { x: 130, y: 250, w: 140, label: "PwC", sub: "Sr. SWE, AI" },
  { x: 200, y: 110, w: 150, label: "", sub: "" },
];

const COLLS = [
  { x: 110, y: 630, label: "Python" },
  { x: 370, y: 530, label: "PyTorch" },
  { x: 150, y: 420, label: "Docker" },
  { x: 380, y: 320, label: "LangChain" },
  { x: 190, y: 210, label: "GraphRAG" },
  { x: 340, y: 430, label: "K8s" },
  { x: 230, y: 530, label: "React" },
];

function PlatformerGame({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gRef = useRef({
    px: 90, py: 650, pvx: 0, pvy: 0,
    onGround: false, facing: 1, frame: 0,
    collected: new Set<number>(), reachedTop: false,
    orbP: [] as Array<{ x: number; y: number; vx: number; vy: number; hue: number; r: number }>,
    t: 0, shakeX: 0, shakeY: 0,
  });

  useEffect(() => {
    const oCx = 275, oCy = 75;
    gRef.current.orbP = Array.from({ length: 180 }, () => {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * 38;
      return {
        x: oCx + Math.cos(a) * d,
        y: oCy + Math.sin(a) * d,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        hue: 10 + Math.random() * 40,
        r: 1 + Math.random() * 2.2,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GW * dpr;
    canvas.height = GH * dpr;
    ctx.scale(dpr, dpr);

    const kd = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const ku = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    let aId: number;
    const loop = () => {
      const g = gRef.current;
      const k = keysRef.current;
      g.t++;

      // Input
      if (k.has("ArrowLeft") || k.has("a")) { g.pvx = -MSPD; g.facing = -1; }
      else if (k.has("ArrowRight") || k.has("d")) { g.pvx = MSPD; g.facing = 1; }
      else g.pvx *= 0.8;

      if ((k.has("ArrowUp") || k.has(" ") || k.has("w")) && g.onGround) {
        g.pvy = JFORCE;
        g.onGround = false;
      }

      // Physics
      g.pvy += GRAV;
      g.px += g.pvx;
      g.py += g.pvy;

      // Wall wrap
      if (g.px < -PW) g.px = GW;
      if (g.px > GW) g.px = -PW;

      // Platform collision
      g.onGround = false;
      for (const p of PLATS) {
        if (g.pvy >= 0 && g.px + PW > p.x && g.px < p.x + p.w && g.py + PH >= p.y && g.py + PH <= p.y + 14) {
          g.py = p.y - PH;
          g.pvy = 0;
          g.onGround = true;
        }
      }
      if (g.py > GH - PH) { g.py = GH - PH; g.pvy = 0; g.onGround = true; }

      // Collectibles
      const prevCount = g.collected.size;
      COLLS.forEach((c, i) => {
        if (g.collected.has(i)) return;
        const dx = (g.px + PW / 2) - c.x;
        const dy = (g.py + PH / 2) - c.y;
        if (Math.sqrt(dx * dx + dy * dy) < 22) g.collected.add(i);
      });
      if (g.collected.size > prevCount) {
        g.shakeX = (Math.random() - 0.5) * 6;
        g.shakeY = (Math.random() - 0.5) * 6;
      }
      g.shakeX *= 0.8;
      g.shakeY *= 0.8;

      if (g.py < 150) g.reachedTop = true;
      if (Math.abs(g.pvx) > 0.5) g.frame++;

      // ── RENDER ──
      ctx.save();
      ctx.translate(g.shakeX, g.shakeY);

      // BG
      ctx.fillStyle = "#0a0a08";
      ctx.fillRect(-10, -10, GW + 20, GH + 20);

      // Stars
      for (let i = 0; i < 40; i++) {
        const sx = (i * 173 + 50) % GW;
        const sy = (i * 97 + 20) % GH;
        ctx.fillStyle = `rgba(255, 191, 0, ${0.08 + 0.08 * Math.sin(g.t * 0.02 + i)})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Platforms
      for (const p of PLATS) {
        ctx.fillStyle = "#151513";
        ctx.fillRect(p.x, p.y, p.w, 10);
        ctx.fillStyle = "rgba(229, 101, 75, 0.3)";
        ctx.fillRect(p.x, p.y, p.w, 2);

        if (p.label) {
          ctx.font = "bold 11px monospace";
          ctx.fillStyle = "rgba(255, 191, 0, 0.55)";
          ctx.fillText(p.label, p.x + 6, p.y - 10);
          ctx.font = "8px monospace";
          ctx.fillStyle = "rgba(255, 191, 0, 0.2)";
          ctx.fillText(p.sub, p.x + 6, p.y - 22);
        }
      }

      // Collectibles
      COLLS.forEach((c, i) => {
        if (g.collected.has(i)) return;
        const bob = Math.sin(g.t * 0.05 + i * 1.5) * 4;
        const glow = ctx.createRadialGradient(c.x, c.y + bob, 0, c.x, c.y + bob, 12);
        glow.addColorStop(0, "rgba(229, 101, 75, 0.15)");
        glow.addColorStop(1, "rgba(229, 101, 75, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(c.x, c.y + bob, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(c.x, c.y + bob, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(229, 101, 75, 0.5)";
        ctx.fill();
        ctx.font = "7px monospace";
        ctx.fillStyle = "rgba(229, 101, 75, 0.6)";
        ctx.textAlign = "center";
        ctx.fillText(c.label, c.x, c.y + bob - 12);
        ctx.textAlign = "left";
      });

      // Top orb
      const oCx = 275, oCy = 75, oR = 42;
      for (const p of g.orbP) {
        p.vx += (Math.random() - 0.5) * 0.08;
        p.vy += (Math.random() - 0.5) * 0.08;
        p.vx += (oCx - p.x) * 0.007;
        p.vy += (oCy - p.y) * 0.007;
        p.vx += (-(p.y - oCy)) * 0.0008;
        p.vy += ((p.x - oCx)) * 0.0008;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        const d = Math.sqrt((p.x - oCx) ** 2 + (p.y - oCy) ** 2);
        if (d > oR) {
          const a = Math.atan2(p.y - oCy, p.x - oCx);
          p.x = oCx + Math.cos(a) * oR;
          p.y = oCy + Math.sin(a) * oR;
          p.vx *= -0.5;
          p.vy *= -0.5;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 0.55)`;
        ctx.fill();
      }

      // Orb glow
      const oGrad = ctx.createRadialGradient(oCx, oCy, 0, oCx, oCy, oR + 18);
      oGrad.addColorStop(0, "rgba(229, 101, 75, 0.06)");
      oGrad.addColorStop(1, "rgba(229, 101, 75, 0)");
      ctx.fillStyle = oGrad;
      ctx.beginPath();
      ctx.arc(oCx, oCy, oR + 18, 0, Math.PI * 2);
      ctx.fill();

      if (g.reachedTop) {
        ctx.font = "bold 15px monospace";
        ctx.fillStyle = `rgba(229, 101, 75, ${0.6 + 0.3 * Math.sin(g.t * 0.04)})`;
        ctx.textAlign = "center";
        ctx.fillText("LET'S BUILD TOGETHER", oCx, oCy + 5);
        ctx.font = "10px monospace";
        ctx.fillStyle = "rgba(255, 191, 0, 0.35)";
        ctx.fillText("ajay.r.kallepalli@gmail.com", oCx, oCy + 20);
        ctx.textAlign = "left";
      }

      // Player
      const wf = Math.floor(g.frame / 8) % 2;
      ctx.save();
      ctx.translate(g.px + PW / 2, g.py);
      ctx.scale(g.facing, 1);
      ctx.translate(-PW / 2, 0);
      ctx.fillStyle = "#e5654b";
      ctx.fillRect(4, 0, 14, 9);
      ctx.fillStyle = "#0a0a08";
      ctx.fillRect(14, 3, 2, 2);
      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(4, 9, 14, 9);
      ctx.fillStyle = "#c1440e";
      ctx.fillRect(4, 13, 14, 2);
      ctx.fillStyle = "#1a1a18";
      if (wf && Math.abs(g.pvx) > 0.5) {
        ctx.fillRect(4, 18, 6, 6);
        ctx.fillRect(12, 18, 6, 8);
      } else {
        ctx.fillRect(4, 18, 6, 8);
        ctx.fillRect(12, 18, 6, 8);
      }
      ctx.restore();

      // HUD
      ctx.font = "11px monospace";
      ctx.fillStyle = "rgba(255, 191, 0, 0.35)";
      ctx.fillText(`Skills: ${g.collected.size}/${COLLS.length}`, 12, 24);

      // Collected display
      let sx = 12;
      COLLS.forEach((c, i) => {
        if (!g.collected.has(i)) return;
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(229, 101, 75, 0.4)";
        ctx.fillText(c.label, sx, 38);
        sx += ctx.measureText(c.label).width + 8;
      });

      // Scanlines
      for (let y = 0; y < GH; y += 3) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(-10, y, GW + 20, 1);
      }

      ctx.restore();
      aId = requestAnimationFrame(loop);
    };

    aId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(aId);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-[#0a0a08] flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <canvas ref={canvasRef} style={{ width: GW, height: GH }} className="border border-amber-400/10" />
        <motion.div
          className="absolute -top-10 left-0 right-0 flex justify-between font-mono text-[10px] text-amber-400/25"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span>← → move · ↑ / space jump</span>
          <span>collect skills · reach the orb</span>
        </motion.div>
      </div>
      <motion.button
        className="mt-6 font-mono text-xs text-amber-400/30 border border-amber-400/10 px-5 py-2 hover:border-amber-400/30 hover:text-amber-400/50 cursor-pointer transition-all"
        onClick={onExit}
        whileHover={{ y: -2 }}
      >
        ← back to terminal
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function OptionFinal() {
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [infoPanelManual, setInfoPanelManual] = useState(false); // user manually closed
  const [gameOpen, setGameOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const glowOpacity = useTransform(scrollYProgress, [0, 0.1], [0.08, 0.04]);

  // Auto-open/close panel based on scroll position
  // With the larger spacer, trigger later and close earlier for smooth feel
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.95 && !infoPanelManual) {
      setInfoPanelOpen(true);
    } else if (v < 0.88) {
      setInfoPanelOpen(false);
      setInfoPanelManual(false); // reset manual close when scrolling back up
    }
  });

  // Track active section for nav dots
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "experience", "skills"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
            setActiveSection(id);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePanelClose = () => {
    setInfoPanelOpen(false);
    setInfoPanelManual(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a08] text-amber-400 relative">
      <CRTOverlay />

      {/* Mouse glow */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl bg-amber-400/[0.06] z-0"
        animate={{ x: mousePos.x - 192, y: mousePos.y - 192 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        style={{ opacity: glowOpacity }}
      />

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 h-px bg-amber-400 z-[55] origin-left"
        style={{ scaleX: smoothProgress, width: "100%" }}
      />

      {/* Side nav dots */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-[55] flex flex-col gap-4 hidden md:flex">
        {["hero", "experience", "skills"].map((s) => (
          <NavDot key={s} label={s === "hero" ? "home" : s} active={activeSection === s} onClick={() => scrollTo(s)} />
        ))}
      </nav>

      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-[55] flex justify-between items-center px-8 py-4 bg-gradient-to-b from-[#0a0a08] via-[#0a0a08]/80 to-transparent">
        <span className="font-mono text-xs text-amber-400/20 tracking-widest">AK</span>
        <div className="flex gap-6">
          <motion.button
            onClick={() => { setInfoPanelOpen(true); setInfoPanelManual(false); }}
            className="font-mono text-xs text-amber-400/30 hover:text-amber-400 transition-colors cursor-pointer"
            whileHover={{ y: -1 }}
          >
            info
          </motion.button>
          <motion.a href="mailto:ajay.r.kallepalli@gmail.com" className="font-mono text-xs text-amber-400/30 hover:text-amber-400 transition-colors" whileHover={{ y: -1 }}>
            email
          </motion.a>
          <motion.a href="/resume.pdf" className="font-mono text-xs text-amber-400/30 hover:text-amber-400 transition-colors" whileHover={{ y: -1 }}>
            resume
          </motion.a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center relative z-10 px-8">
        <motion.p
          className="font-mono text-amber-400/30 text-xs mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <TypeWriter text="$ whoami" speed={80} delay={500} />
        </motion.p>

        <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight">
          <TypeWriter text="Ajay Kallepalli" delay={1200} speed={50} />
        </h1>

        <motion.div
          className="font-mono text-amber-400/45 text-sm mt-5 max-w-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          <p>
            Senior Software Engineer building{" "}
            <HoverWord word="AI systems" detail="LangChain, vLLM, GraphRAG" /> in San Francisco.
            <br />
            From <HoverWord word="computer vision" detail="OpenCV, photogrammetry rigs" /> pipelines
            to <HoverWord word="agentic AI" detail="LangGraph, Deep Research" /> that reasons autonomously.
          </p>
        </motion.div>

        <motion.div
          className="flex gap-6 mt-8 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
        >
          <motion.button
            onClick={() => { setInfoPanelOpen(true); setInfoPanelManual(false); }}
            className="font-mono text-xs text-amber-400/50 border border-amber-400/20 px-5 py-2 hover:border-amber-400/50 hover:text-amber-400 transition-all cursor-pointer"
            whileHover={{ y: -2 }}
          >
            $ man ajay
          </motion.button>
          <motion.a
            href="/resume.pdf"
            className="font-mono text-xs text-amber-400/25 hover:text-amber-400/50 transition-colors"
            whileHover={{ y: -2 }}
          >
            resume.pdf →
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 font-mono text-xs text-amber-400/15"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↓ scroll
        </motion.div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section id="experience" className="px-8 md:px-24 py-24 max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="font-mono text-amber-400/30 text-xs mb-2">$ ls experience/</p>
          <h2 className="text-2xl font-mono font-bold mb-10">Experience</h2>
        </motion.div>

        <div className="space-y-1">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.company}
              className="flex justify-between items-center py-3 border-b border-amber-400/8 cursor-pointer group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              onClick={() => { setInfoPanelOpen(true); setInfoPanelManual(false); }}
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/15 group-hover:bg-[#e5654b] transition-colors" />
                <span className="font-mono text-sm text-amber-400/60 group-hover:text-amber-400 transition-colors">
                  {exp.company}
                </span>
                <span className="font-mono text-xs text-amber-400/20 hidden sm:inline">{exp.role}</span>
              </div>
              <span className="font-mono text-xs text-amber-400/15">{exp.period}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="font-mono text-[10px] text-amber-400/15 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          click for details · or keep scrolling
        </motion.p>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section id="skills" className="px-8 md:px-24 py-16 max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="font-mono text-amber-400/30 text-xs mb-6">$ echo $SKILLS</p>
        </motion.div>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill, i) => (
            <motion.span
              key={skill}
              className="font-mono text-xs px-3 py-1.5 border border-amber-400/10 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all cursor-default"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ═══ SPACER — breathing room before panel trigger ═══ */}
      <div className="h-[40vh] relative z-10" />

      {/* ═══ TRANSITION ZONE — visual cue that something is coming ═══ */}
      <section className="relative z-10 flex flex-col items-center py-16">
        <motion.div
          className="w-px bg-gradient-to-b from-transparent via-amber-400/15 to-amber-400/5"
          style={{ height: 120 }}
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-amber-400/15 mt-2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, type: "spring" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
        />
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-8 md:px-24 py-16 max-w-3xl mx-auto relative z-10 border-t border-amber-400/8">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-mono text-xs text-amber-400/30">ajay.r.kallepalli@gmail.com</p>
            <p className="font-mono text-[10px] text-amber-400/10 mt-1">San Francisco, CA</p>
          </div>
          {/* Karateka easter egg — subtle, tucked in the footer */}
          <div className="flex items-end gap-4">
            <KaratekaChar onClick={() => setGameOpen(true)} />
            <p className="font-mono text-[10px] text-amber-400/10">{new Date().getFullYear()}</p>
          </div>
        </div>
        {/* Extra space for scroll trigger */}
        <div className="h-[50vh]" />
      </footer>

      {/* ═══ OVERLAYS ═══ */}
      <InfoPanel open={infoPanelOpen} onClose={handlePanelClose} />
      <AnimatePresence>
        {gameOpen && <PlatformerGame onExit={() => setGameOpen(false)} />}
      </AnimatePresence>

      {/* ═══ GLOBAL STYLES ═══ */}
      <style jsx global>{`
        @keyframes flicker {
          0% { opacity: 0.015; }
          5% { opacity: 0.04; }
          10% { opacity: 0.015; }
          15% { opacity: 0.035; }
          20% { opacity: 0.015; }
          50% { opacity: 0.02; }
          55% { opacity: 0.045; }
          60% { opacity: 0.015; }
          80% { opacity: 0.02; }
          85% { opacity: 0.04; }
          90% { opacity: 0.015; }
          100% { opacity: 0.02; }
        }
        .animate-flicker {
          animation: flicker 0.3s infinite;
        }
      `}</style>
    </div>
  );
}
