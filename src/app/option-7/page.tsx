"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

/*
  OPTION 7: "TERMINAL + ZEN + GAME" — Version B
  ───────────────────────────────────────────────
  Same core concept but different layout:
  - Centered layout with more breathing room
  - Orb is larger and centered above the name (hero centerpiece)
  - Info panel slides from RIGHT side (sidebar) instead of bottom
  - Experience is a horizontal timeline you scroll through
  - More dramatic scroll animations
  - The game is fullscreen immersive with bigger canvas
*/

// ═══════════════════════════════════════════
// PARTICLE ORB — larger, more particles, hero placement
// ═══════════════════════════════════════════
function ParticleOrb({ size = 120, onClick }: { size?: number; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, inside: false });
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number; radius: number; hue: number; alpha: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const count = 150;
    const cx = size / 2;
    const cy = size / 2;
    const containerR = size / 2 - 6;

    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * containerR * 0.8;
        return {
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: 1 + Math.random() * 2,
          hue: 15 + Math.random() * 35,
          alpha: 0.3 + Math.random() * 0.5,
        };
      });
    }

    let animId: number;
    let time = 0;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, size, size);

      // Pulsing container glow
      const pulse = 0.03 + 0.02 * Math.sin(time * 0.02);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, containerR + 15);
      grad.addColorStop(0, `rgba(229, 101, 75, ${pulse})`);
      grad.addColorStop(0.7, `rgba(229, 101, 75, ${pulse * 0.3})`);
      grad.addColorStop(1, "rgba(229, 101, 75, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, containerR + 15, 0, Math.PI * 2);
      ctx.fill();

      // Container ring
      ctx.strokeStyle = `rgba(229, 101, 75, ${0.08 + 0.04 * Math.sin(time * 0.015)})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, containerR, 0, Math.PI * 2);
      ctx.stroke();

      for (const p of particlesRef.current) {
        // Mouse interaction
        if (mouseRef.current.inside) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30) {
            p.vx += (dx / dist) * 0.8;
            p.vy += (dy / dist) * 0.8;
          }
        }

        // Gentle orbit
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        p.vx += (dx / dist) * 0.015;
        p.vy += (dy / dist) * 0.015;
        // Tangential force (orbit)
        p.vx += (-dy / dist) * 0.003;
        p.vy += (dx / dist) * 0.003;

        p.vx += (Math.random() - 0.5) * 0.12;
        p.vy += (Math.random() - 0.5) * 0.12;
        p.vx *= 0.985;
        p.vy *= 0.985;

        const newDist = Math.sqrt((p.x + p.vx - cx) ** 2 + (p.y + p.vy - cy) ** 2);
        if (newDist > containerR - p.radius) {
          const angle = Math.atan2(p.y - cy, p.x - cx);
          p.vx = -Math.cos(angle) * 0.8;
          p.vy = -Math.sin(angle) * 0.8;
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 68%, ${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <motion.canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="cursor-pointer"
      onClick={onClick}
      onMouseMove={(e) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
      }}
      onMouseLeave={() => { mouseRef.current.inside = false; }}
      whileHover={{ scale: 1.05 }}
      title="Click to play"
    />
  );
}

// ═══════════════════════════════════════════
// SCANLINES + CRT
// ═══════════════════════════════════════════
function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <div className="h-full w-full opacity-[0.025]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
        backgroundSize: "100% 2px",
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════
function TypeWriter({ text, speed = 30, delay = 0, className = "" }: { text: string; speed?: number; delay?: number; className?: string }) {
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

  return <span className={className}>{displayed}{displayed.length < text.length && started && <span className="animate-pulse">▊</span>}</span>;
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
const SKILLS_MAP = {
  "Languages": ["Python", "TypeScript", "SQL", "R", "Bash"],
  "AI/ML": ["PyTorch", "LangChain", "GraphRAG", "vLLM", "Hugging Face"],
  "Infra": ["Docker", "Kubernetes", "AWS", "CI/CD", "Azure"],
};
const LIKES = ["Building things that think", "Graph databases", "Long walks in SF", "Distributed systems", "Good coffee", "Open source", "Teaching", "Pixel art", "Quiet mornings"];
const DISLIKES = ["Unnecessary meetings", "Vendor lock-in", "Magic numbers in code"];

// ═══════════════════════════════════════════
// SIDEBAR INFO PANEL (slides from right)
// ═══════════════════════════════════════════
function SidePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedExp, setSelectedExp] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-[70]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg z-[80] bg-[#0d0d0b] border-l border-amber-400/10 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-8 md:p-12">
              {/* Close */}
              <div className="flex justify-between items-center mb-8">
                <p className="font-mono text-amber-400/40 text-xs">$ man ajay</p>
                <motion.button
                  className="font-mono text-xs text-amber-400/20 hover:text-amber-400/50 cursor-pointer"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                >
                  [×]
                </motion.button>
              </div>

              {/* Bio */}
              <p className="font-mono text-sm text-amber-400/40 leading-relaxed mb-10 max-w-md">
                A career building <span className="text-amber-400/70">intelligent systems</span>,{" "}
                <span className="text-amber-400/70">scaling ML pipelines</span>, and{" "}
                <span className="text-amber-400/70">pushing AI boundaries</span>.
                Guided by open source, distributed systems, and making tools that feel effortless.
              </p>

              {/* Experience */}
              <p className="font-mono text-xs text-amber-400/25 tracking-[0.3em] mb-4">EXPERIENCE</p>
              {EXPERIENCE.map((exp, i) => (
                <div key={exp.company}>
                  <motion.button
                    className="w-full flex justify-between items-center py-3 border-t border-amber-400/5 cursor-pointer group text-left"
                    onClick={() => setSelectedExp(selectedExp === exp.company ? null : exp.company)}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        animate={{ backgroundColor: selectedExp === exp.company ? "#e5654b" : "rgba(255,191,0,0.15)" }}
                      />
                      <span className={`font-mono text-sm transition-colors ${selectedExp === exp.company ? "text-[#e5654b]" : "text-amber-400/60 group-hover:text-amber-400"}`}>
                        {exp.company}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400/20">{exp.period}</span>
                  </motion.button>
                  <AnimatePresence>
                    {selectedExp === exp.company && (
                      <motion.div
                        className="pl-7 pb-3 border-l border-[#e5654b]/20 ml-[3px]"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <p className="font-mono text-[10px] text-amber-400/25 mb-2">{exp.role}</p>
                        {exp.items.map((item, j) => (
                          <motion.p key={j} className="font-mono text-xs text-amber-400/35 py-0.5 flex gap-2"
                            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.04 }}
                          >
                            <span className="text-amber-400/15">›</span> {item}
                          </motion.p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Education */}
              <div className="mt-10 mb-8">
                <p className="font-mono text-xs text-amber-400/25 tracking-[0.3em] mb-4">EDUCATION</p>
                <p className="font-mono text-sm text-amber-400/50">
                  <span className="text-amber-400/70">USF</span> — M.S. Data Science <span className="text-amber-400/20 text-xs ml-1">2025</span>
                </p>
                <p className="font-mono text-sm text-amber-400/50 mt-1">
                  <span className="text-amber-400/70">UCLA</span> — B.S. Stats · B.A. Econ <span className="text-amber-400/20 text-xs ml-1">2021</span>
                </p>
              </div>

              {/* Skills by category */}
              <div className="mb-8">
                <p className="font-mono text-xs text-amber-400/25 tracking-[0.3em] mb-4">SKILLS</p>
                {Object.entries(SKILLS_MAP).map(([cat, skills]) => (
                  <div key={cat} className="mb-3">
                    <p className="font-mono text-[10px] text-amber-400/20 mb-1">{cat}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s} className="font-mono text-[11px] text-amber-400/40 border border-amber-400/10 px-2 py-0.5 hover:border-amber-400/30 hover:text-amber-400/60 transition-colors cursor-default">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Likes / Dislikes */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="font-mono text-xs text-amber-400/25 tracking-[0.3em] mb-3">WHAT I LIKE</p>
                  {LIKES.map((l) => (
                    <p key={l} className="font-mono text-xs text-amber-400/35 py-0.5 hover:text-amber-400/60 transition-colors cursor-default">{l}</p>
                  ))}
                </div>
                <div>
                  <p className="font-mono text-xs text-[#e5654b]/40 tracking-[0.3em] mb-3">WHAT I DON&apos;T</p>
                  {DISLIKES.map((d) => (
                    <p key={d} className="font-mono text-xs text-amber-400/25 py-0.5 hover:text-[#e5654b]/50 transition-colors cursor-default">{d}</p>
                  ))}
                </div>
              </div>

              {/* Resume PDF */}
              <div className="border-t border-amber-400/5 pt-6">
                <motion.a
                  href="/resume.pdf"
                  className="font-mono text-xs text-[#e5654b]/60 hover:text-[#e5654b] transition-colors"
                  whileHover={{ x: 4 }}
                >
                  Download full resume (PDF) →
                </motion.a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════
// PLATFORMER GAME — fullscreen, bigger canvas
// ═══════════════════════════════════════════
const GW = 600;
const GH = 800;
const GRAV = 0.4;
const JFORCE = -10;
const MSPD = 4.5;
const PW = 22;
const PH = 28;

const PLATS = [
  { x: 80, y: 720, w: 130, label: "UCLA", sub: "B.S. Stats · B.A. Econ" },
  { x: 350, y: 610, w: 150, label: "Qualcomm", sub: "ML Engineer · CV Pipelines" },
  { x: 100, y: 500, w: 160, label: "ArangoDB", sub: "GraphRAG · 50→90% accuracy" },
  { x: 330, y: 390, w: 160, label: "Honeywell", sub: "Agentic AI · LangGraph" },
  { x: 150, y: 270, w: 140, label: "PwC", sub: "Sr. SWE AI · $50M+ pipeline" },
  { x: 220, y: 130, w: 160, label: "", sub: "" },
];

const COLLS = [
  { x: 130, y: 680, label: "Python" },
  { x: 420, y: 570, label: "PyTorch" },
  { x: 170, y: 460, label: "Docker" },
  { x: 400, y: 350, label: "LangChain" },
  { x: 210, y: 230, label: "GraphRAG" },
  { x: 360, y: 450, label: "K8s" },
  { x: 250, y: 560, label: "React" },
];

function PlatformerGame({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gRef = useRef({
    px: 120, py: 700, pvx: 0, pvy: 0,
    onGround: false, facing: 1, frame: 0,
    collected: new Set<number>(), reachedTop: false,
    orbP: [] as Array<{ x: number; y: number; vx: number; vy: number; hue: number; r: number }>,
    t: 0, shakeX: 0, shakeY: 0,
  });

  useEffect(() => {
    const oCx = 300, oCy = 90;
    gRef.current.orbP = Array.from({ length: 200 }, () => {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * 40;
      return { x: oCx + Math.cos(a) * d, y: oCy + Math.sin(a) * d, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, hue: 10 + Math.random() * 40, r: 1 + Math.random() * 2.5 };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GW * dpr;
    canvas.height = GH * dpr;
    ctx.scale(dpr, dpr);

    const kd = (e: KeyboardEvent) => { keysRef.current.add(e.key); if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault(); };
    const ku = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    let aId: number;
    const loop = () => {
      const g = gRef.current;
      const k = keysRef.current;
      g.t++;

      if (k.has("ArrowLeft") || k.has("a")) { g.pvx = -MSPD; g.facing = -1; }
      else if (k.has("ArrowRight") || k.has("d")) { g.pvx = MSPD; g.facing = 1; }
      else g.pvx *= 0.8;

      if ((k.has("ArrowUp") || k.has(" ") || k.has("w")) && g.onGround) { g.pvy = JFORCE; g.onGround = false; }

      g.pvy += GRAV;
      g.px += g.pvx;
      g.py += g.pvy;

      if (g.px < -PW) g.px = GW;
      if (g.px > GW) g.px = -PW;

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
      // Screen shake on collect
      if (g.collected.size > prevCount) { g.shakeX = (Math.random() - 0.5) * 6; g.shakeY = (Math.random() - 0.5) * 6; }
      g.shakeX *= 0.8; g.shakeY *= 0.8;

      if (g.py < 170) g.reachedTop = true;
      if (Math.abs(g.pvx) > 0.5) g.frame++;

      // ── RENDER ──
      ctx.save();
      ctx.translate(g.shakeX, g.shakeY);

      // BG gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, GH);
      bgGrad.addColorStop(0, "#0d0d0b");
      bgGrad.addColorStop(1, "#0a0a08");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(-10, -10, GW + 20, GH + 20);

      // Stars
      for (let i = 0; i < 50; i++) {
        const sx = (i * 173 + 50) % GW;
        const sy = (i * 97 + 20) % GH;
        ctx.fillStyle = `rgba(255, 191, 0, ${0.08 + 0.08 * Math.sin(g.t * 0.02 + i)})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Platforms
      for (const p of PLATS) {
        // Platform body
        ctx.fillStyle = "#141412";
        ctx.fillRect(p.x, p.y, p.w, 10);
        // Top highlight
        ctx.fillStyle = "rgba(229, 101, 75, 0.25)";
        ctx.fillRect(p.x, p.y, p.w, 2);
        // Side glow
        ctx.fillStyle = "rgba(229, 101, 75, 0.05)";
        ctx.fillRect(p.x - 2, p.y, 2, 10);
        ctx.fillRect(p.x + p.w, p.y, 2, 10);

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
      const oCx = 300, oCy = 90, oR = 45;
      for (const p of g.orbP) {
        p.vx += (Math.random() - 0.5) * 0.08;
        p.vy += (Math.random() - 0.5) * 0.08;
        p.vx += (oCx - p.x) * 0.008;
        p.vy += (oCy - p.y) * 0.008;
        p.vx += (-(p.y - oCy)) * 0.0008; // orbit
        p.vy += ((p.x - oCx)) * 0.0008;
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        const d = Math.sqrt((p.x - oCx) ** 2 + (p.y - oCy) ** 2);
        if (d > oR) { const a = Math.atan2(p.y - oCy, p.x - oCx); p.x = oCx + Math.cos(a) * oR; p.y = oCy + Math.sin(a) * oR; p.vx *= -0.5; p.vy *= -0.5; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 0.55)`;
        ctx.fill();
      }

      // Orb glow
      const oGrad = ctx.createRadialGradient(oCx, oCy, 0, oCx, oCy, oR + 20);
      oGrad.addColorStop(0, "rgba(229, 101, 75, 0.06)");
      oGrad.addColorStop(1, "rgba(229, 101, 75, 0)");
      ctx.fillStyle = oGrad;
      ctx.beginPath();
      ctx.arc(oCx, oCy, oR + 20, 0, Math.PI * 2);
      ctx.fill();

      if (g.reachedTop) {
        ctx.font = "bold 16px monospace";
        ctx.fillStyle = `rgba(229, 101, 75, ${0.6 + 0.3 * Math.sin(g.t * 0.04)})`;
        ctx.textAlign = "center";
        ctx.fillText("LET'S BUILD TOGETHER", oCx, oCy + 5);
        ctx.font = "10px monospace";
        ctx.fillStyle = "rgba(255, 191, 0, 0.35)";
        ctx.fillText("ajay.r.kallepalli@gmail.com", oCx, oCy + 22);
        ctx.textAlign = "left";
      }

      // Player
      const wf = Math.floor(g.frame / 8) % 2;
      ctx.save();
      ctx.translate(g.px + PW / 2, g.py);
      ctx.scale(g.facing, 1);
      ctx.translate(-PW / 2, 0);
      ctx.fillStyle = "#e5654b"; ctx.fillRect(4, 0, 14, 10); // head
      ctx.fillStyle = "#0a0a08"; ctx.fillRect(14, 3, 2, 2); // eye
      ctx.fillStyle = "#f5f0e8"; ctx.fillRect(4, 10, 14, 10); // body
      ctx.fillStyle = "#c1440e"; ctx.fillRect(4, 15, 14, 2); // belt
      ctx.fillStyle = "#1a1a18";
      if (wf && Math.abs(g.pvx) > 0.5) { ctx.fillRect(4, 20, 6, 6); ctx.fillRect(12, 20, 6, 8); }
      else { ctx.fillRect(4, 20, 6, 8); ctx.fillRect(12, 20, 6, 8); }
      ctx.restore();

      // HUD
      ctx.font = "11px monospace";
      ctx.fillStyle = "rgba(255, 191, 0, 0.35)";
      ctx.fillText(`Skills: ${g.collected.size}/${COLLS.length}`, 12, 24);

      // Collected skills display
      let skillX = 12;
      const skillY = 40;
      COLLS.forEach((c, i) => {
        if (!g.collected.has(i)) return;
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(229, 101, 75, 0.4)";
        ctx.fillText(c.label, skillX, skillY);
        skillX += ctx.measureText(c.label).width + 8;
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
    return () => { cancelAnimationFrame(aId); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
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
        <canvas ref={canvasRef} style={{ width: GW, height: GH }} className="border border-amber-400/10 shadow-2xl" />
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
        className="mt-8 font-mono text-xs text-amber-400/30 border border-amber-400/10 px-6 py-2 hover:border-amber-400/30 hover:text-amber-400/50 cursor-pointer transition-all"
        onClick={onExit}
        whileHover={{ y: -2 }}
      >
        ← back to terminal
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE — Centered, spacious layout
// ═══════════════════════════════════════════
export default function Option7() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a08] text-amber-400 relative">
      <Scanlines />

      {/* Mouse glow */}
      <motion.div
        className="pointer-events-none fixed w-[500px] h-[500px] rounded-full blur-3xl bg-amber-400/[0.04] z-0"
        animate={{ x: mousePos.x - 250, y: mousePos.y - 250 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Progress */}
      <motion.div className="fixed top-0 left-0 h-px bg-amber-400/60 z-[55] origin-left" style={{ scaleX: smoothProgress, width: "100%" }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[55] flex justify-between items-center px-8 md:px-16 py-5">
        <span className="font-mono text-xs text-amber-400/20 tracking-widest">AK</span>
        <div className="flex gap-8">
          <motion.button onClick={() => setInfoOpen(true)} className="font-mono text-xs text-amber-400/25 hover:text-amber-400/60 cursor-pointer transition-colors" whileHover={{ y: -1 }}>info</motion.button>
          <motion.a href="mailto:ajay.r.kallepalli@gmail.com" className="font-mono text-xs text-amber-400/25 hover:text-amber-400/60 transition-colors" whileHover={{ y: -1 }}>email</motion.a>
          <motion.a href="/resume.pdf" className="font-mono text-xs text-amber-400/25 hover:text-amber-400/60 transition-colors" whileHover={{ y: -1 }}>resume</motion.a>
        </div>
      </nav>

      {/* HERO — centered with orb above name */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center relative z-10 px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <ParticleOrb size={100} onClick={() => setGameOpen(true)} />
        </motion.div>

        <motion.p
          className="font-mono text-amber-400/30 text-xs mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <TypeWriter text="$ whoami" speed={80} delay={500} />
        </motion.p>

        <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight">
          <TypeWriter text="Ajay Kallepalli" delay={1200} speed={45} />
        </h1>

        <motion.p
          className="font-mono text-amber-400/40 text-sm mt-4 max-w-md leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          Senior Software Engineer building AI systems
          <br />
          in San Francisco
        </motion.p>

        <motion.div
          className="flex gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
        >
          <motion.button
            onClick={() => setInfoOpen(true)}
            className="font-mono text-xs text-amber-400/40 border border-amber-400/15 px-5 py-2 hover:border-amber-400/40 hover:text-amber-400/70 transition-all cursor-pointer"
            whileHover={{ y: -2, scale: 1.02 }}
          >
            $ man ajay
          </motion.button>
          <motion.a
            href="/resume.pdf"
            className="font-mono text-xs text-amber-400/25 px-5 py-2 hover:text-amber-400/50 transition-colors"
            whileHover={{ y: -2 }}
          >
            resume.pdf
          </motion.a>
        </motion.div>

        <motion.p
          className="font-mono text-[9px] text-amber-400/10 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          click the orb
        </motion.p>

        <motion.div
          className="absolute bottom-12 font-mono text-xs text-amber-400/15"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↓
        </motion.div>
      </section>

      {/* EXPERIENCE TIMELINE — horizontal scroll cards */}
      <section className="py-24 relative z-10">
        <motion.div
          className="px-8 md:px-16 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-amber-400/30 text-xs mb-1">$ ls -la experience/</p>
          <h2 className="text-2xl font-mono font-bold">Experience</h2>
        </motion.div>

        <div className="overflow-x-auto px-8 md:px-16 pb-4 scrollbar-hide">
          <div className="flex gap-4 min-w-max">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={exp.company}
                className="w-72 border border-amber-400/10 p-5 hover:border-amber-400/25 transition-colors cursor-pointer group flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => setInfoOpen(true)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#e5654b]/40 group-hover:bg-[#e5654b] transition-colors" />
                  <span className="font-mono text-sm text-amber-400/70 group-hover:text-amber-400 transition-colors">{exp.company}</span>
                </div>
                <p className="font-mono text-[10px] text-amber-400/25 mb-3">{exp.role}</p>
                <p className="font-mono text-xs text-amber-400/20">{exp.period}</p>
                <div className="mt-3 pt-3 border-t border-amber-400/5">
                  <p className="font-mono text-[10px] text-amber-400/25 line-clamp-2">{exp.items[0]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="px-8 md:px-16 py-16 max-w-4xl mx-auto relative z-10">
        <motion.p
          className="font-mono text-amber-400/30 text-xs mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          $ echo $PATH
        </motion.p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.values(SKILLS_MAP).flat().map((skill, i) => (
            <motion.span
              key={skill}
              className="font-mono text-xs px-3 py-1.5 border border-amber-400/8 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all cursor-default"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.08, y: -3 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 md:px-16 py-12 text-center relative z-10 border-t border-amber-400/5">
        <p className="font-mono text-xs text-amber-400/25">ajay.r.kallepalli@gmail.com</p>
        <p className="font-mono text-[10px] text-amber-400/10 mt-2">San Francisco · {new Date().getFullYear()}</p>
      </footer>

      {/* OVERLAYS */}
      <SidePanel open={infoOpen} onClose={() => setInfoOpen(false)} />
      <AnimatePresence>
        {gameOpen && <PlatformerGame onExit={() => setGameOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
