"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

/*
  OPTION 6: "TERMINAL + ZEN + GAME" — Version A
  ───────────────────────────────────────────────
  Base: Option 1 amber terminal aesthetic
  + Option 5 slide-up information panel
  + Particle orb near name (subtle, clickable → game)
  + Full vertical platformer easter egg

  This version: faithful terminal style, single-column,
  panel styled as terminal window.
*/

// ═══════════════════════════════════════════
// PARTICLE ORB COMPONENT
// ═══════════════════════════════════════════
function ParticleOrb({ size = 60, onClick }: { size?: number; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, inside: false });
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number; radius: number; hue: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Initialize particles
    const count = 80;
    const centerX = size / 2;
    const centerY = size / 2;
    const containerRadius = size / 2 - 4;

    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * containerRadius * 0.8;
        return {
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: 1 + Math.random() * 1.5,
          hue: 30 + Math.random() * 20, // amber range
        };
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      // Draw container glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, containerRadius);
      gradient.addColorStop(0, "rgba(229, 101, 75, 0.03)");
      gradient.addColorStop(1, "rgba(229, 101, 75, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, containerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw particles
      for (const p of particlesRef.current) {
        // Mouse repulsion
        if (mouseRef.current.inside) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 20) {
            p.vx += (dx / dist) * 0.5;
            p.vy += (dy / dist) * 0.5;
          }
        }

        // Gravity toward center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        p.vx += (dx / dist) * 0.02;
        p.vy += (dy / dist) * 0.02;

        // Brownian motion
        p.vx += (Math.random() - 0.5) * 0.15;
        p.vy += (Math.random() - 0.5) * 0.15;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Contain within orb
        const newDist = Math.sqrt((p.x + p.vx - centerX) ** 2 + (p.y + p.vy - centerY) ** 2);
        if (newDist > containerRadius - p.radius) {
          const angle = Math.atan2(p.y - centerY, p.x - centerX);
          p.vx = -Math.cos(angle) * 0.5;
          p.vy = -Math.sin(angle) * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, 0.7)`;
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
      width={size}
      height={size}
      className="cursor-pointer"
      style={{ width: size, height: size }}
      onClick={onClick}
      onMouseMove={(e) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          inside: true,
        };
      }}
      onMouseLeave={() => { mouseRef.current.inside = false; }}
      whileHover={{ scale: 1.1 }}
      title="Click to play"
    />
  );
}

// ═══════════════════════════════════════════
// SCANLINES
// ═══════════════════════════════════════════
function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <div
        className="h-full w-full opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
          backgroundSize: "100% 2px",
        }}
      />
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

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && <span className="animate-pulse">▊</span>}
    </span>
  );
}

// ═══════════════════════════════════════════
// HOVER REVEAL WORD (terminal-styled)
// ═══════════════════════════════════════════
function HoverWord({ word, detail }: { word: string; detail: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span className="relative inline-block">
      <span
        className={`border-b border-dashed cursor-help transition-colors ${hovered ? "text-amber-400 border-amber-400" : "text-amber-400/70 border-amber-400/30"}`}
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
// INFORMATION PANEL (slide-up, zen editorial)
// ═══════════════════════════════════════════
const EXPERIENCE = [
  { company: "PwC", role: "Senior Software Engineer, AI", period: "Aug 2025–Now", items: ["AI opportunity tracking for firm leadership", "Semantic search across knowledge assets", "Deep Research Agent for client intelligence", "$50M+ pipeline visibility"] },
  { company: "Honeywell", role: "Software Engineer, Agentic AI", period: "Jun–Sep 2025", items: ["LangGraph chatbot with SQL, GraphRAG & viz agents", "AKS deployment with zero-downtime blue-green releases"] },
  { company: "ArangoDB", role: "Software Engineer, AI/ML", period: "Oct 2024–Jun 2025", items: ["GraphRAG: 50% → 90% answer accuracy", "RL-finetuned LLM for graph queries", "langchain-arangodb adopted by NVIDIA"] },
  { company: "Qualcomm", role: "ML Engineer", period: "Dec 2021–Jun 2024", items: ["Petabyte-scale CV pipelines for facial modeling", "16x speedup via distributed computing", "87-camera photogrammetry ($35K savings)", "4000 hours saved through QC automation"] },
];

const LIKES = ["Building things that think", "Graph databases", "Long walks in SF", "Distributed systems", "Good coffee", "Open source", "Teaching", "Pixel art", "Quiet mornings"];

function InfoPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedExp, setSelectedExp] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[80] bg-[#0a0a08] border-t border-amber-400/20 max-h-[85vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="max-w-2xl mx-auto px-8 py-10">
              <div className="flex justify-center mb-6">
                <div className="w-8 h-px bg-amber-400/20" />
              </div>

              <p className="font-mono text-amber-400/40 text-xs mb-2">$ man ajay</p>
              <h2 className="font-mono text-amber-400 text-lg mb-6">Information</h2>

              <p className="font-mono text-sm text-amber-400/40 leading-relaxed mb-8 max-w-lg">
                A career building <span className="text-amber-400/70">intelligent systems</span>,{" "}
                <span className="text-amber-400/70">scaling ML pipelines</span>, and{" "}
                <span className="text-amber-400/70">pushing AI boundaries</span>—guided by open source,
                distributed systems, and making tools that feel effortless.
              </p>

              {/* Experience rows */}
              {EXPERIENCE.map((exp, i) => (
                <div key={exp.company}>
                  <motion.button
                    className="w-full flex justify-between items-center py-3 border-t border-amber-400/10 cursor-pointer group text-left"
                    onClick={() => setSelectedExp(selectedExp === exp.company ? null : exp.company)}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${selectedExp === exp.company ? "bg-[#e5654b]" : "bg-amber-400/20"}`} />
                      <span className={`font-mono text-sm transition-colors ${selectedExp === exp.company ? "text-[#e5654b]" : "text-amber-400/70 group-hover:text-amber-400"}`}>
                        {exp.company}
                      </span>
                      <span className="font-mono text-xs text-amber-400/20 hidden sm:inline">{exp.role}</span>
                    </div>
                    <span className="font-mono text-xs text-amber-400/20">{exp.period}</span>
                  </motion.button>

                  <AnimatePresence>
                    {selectedExp === exp.company && (
                      <motion.div
                        className="pl-7 pb-4 border-l border-[#e5654b]/20 ml-[3px]"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {exp.items.map((item, j) => (
                          <motion.p
                            key={j}
                            className="font-mono text-xs text-amber-400/40 py-1 flex gap-2"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.05 }}
                          >
                            <span className="text-amber-400/20">›</span> {item}
                          </motion.p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Education */}
              <div className="mt-8 mb-6">
                <p className="font-mono text-xs text-amber-400/30 tracking-widest mb-3">EDUCATION</p>
                <p className="font-mono text-sm text-amber-400/50">
                  <span className="text-amber-400/70">USF</span> — M.S. Data Science <span className="text-amber-400/20 text-xs">2025</span>
                </p>
                <p className="font-mono text-sm text-amber-400/50 mt-1">
                  <span className="text-amber-400/70">UCLA</span> — B.S. Statistics · B.A. Economics <span className="text-amber-400/20 text-xs">2021</span>
                </p>
              </div>

              {/* What I like */}
              <div className="mb-8">
                <p className="font-mono text-xs text-amber-400/30 tracking-widest mb-3">WHAT I LIKE</p>
                <div className="space-y-1">
                  {LIKES.map((thing) => (
                    <p key={thing} className="font-mono text-sm text-amber-400/40 hover:text-amber-400/70 transition-colors cursor-default">
                      {thing}
                    </p>
                  ))}
                </div>
              </div>

              {/* Resume PDF link */}
              <div className="border-t border-amber-400/10 pt-4 mb-6 flex justify-between items-center">
                <motion.a
                  href="/resume.pdf"
                  className="font-mono text-xs text-[#e5654b] hover:text-[#e5654b]/80 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  Download full resume (PDF) →
                </motion.a>
                <motion.button
                  className="font-mono text-xs text-amber-400/30 border border-amber-400/10 px-4 py-2 hover:border-amber-400/30 cursor-pointer"
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
const GAME_WIDTH = 500;
const GAME_HEIGHT = 700;
const GRAVITY = 0.4;
const JUMP_FORCE = -9;
const MOVE_SPEED = 4;
const PLAYER_W = 20;
const PLAYER_H = 24;

const PLATFORMS = [
  { x: 50, y: 620, w: 120, label: "UCLA", sublabel: "2017–2021" },
  { x: 250, y: 520, w: 140, label: "Qualcomm", sublabel: "2021–2024" },
  { x: 80, y: 420, w: 140, label: "ArangoDB", sublabel: "2024–2025" },
  { x: 280, y: 330, w: 140, label: "Honeywell", sublabel: "2025" },
  { x: 120, y: 230, w: 120, label: "PwC", sublabel: "2025–Now" },
  { x: 180, y: 100, w: 140, label: "", sublabel: "" }, // final platform
];

// Collectible skills along the path
const COLLECTIBLES = [
  { x: 100, y: 580, label: "Python" },
  { x: 310, y: 480, label: "PyTorch" },
  { x: 140, y: 380, label: "Docker" },
  { x: 340, y: 290, label: "LangChain" },
  { x: 170, y: 190, label: "GraphRAG" },
];

function PlatformerGame({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gameRef = useRef({
    px: 80, py: 600, pvx: 0, pvy: 0,
    onGround: false,
    facing: 1,
    frame: 0,
    collected: new Set<number>(),
    reachedTop: false,
    orbParticles: [] as Array<{ x: number; y: number; vx: number; vy: number; hue: number; r: number }>,
    time: 0,
  });

  // Initialize orb particles
  useEffect(() => {
    const orbCx = 250;
    const orbCy = 70;
    gameRef.current.orbParticles = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 30;
      return {
        x: orbCx + Math.cos(angle) * dist,
        y: orbCy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hue: 20 + Math.random() * 30,
        r: 1 + Math.random() * 2,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = GAME_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let animId: number;
    const loop = () => {
      const g = gameRef.current;
      const keys = keysRef.current;
      g.time++;

      // Input
      if (keys.has("ArrowLeft") || keys.has("a")) { g.pvx = -MOVE_SPEED; g.facing = -1; }
      else if (keys.has("ArrowRight") || keys.has("d")) { g.pvx = MOVE_SPEED; g.facing = 1; }
      else { g.pvx *= 0.8; }

      if ((keys.has("ArrowUp") || keys.has(" ") || keys.has("w")) && g.onGround) {
        g.pvy = JUMP_FORCE;
        g.onGround = false;
      }

      // Physics
      g.pvy += GRAVITY;
      g.px += g.pvx;
      g.py += g.pvy;

      // Wall wrapping
      if (g.px < -PLAYER_W) g.px = GAME_WIDTH;
      if (g.px > GAME_WIDTH) g.px = -PLAYER_W;

      // Platform collision
      g.onGround = false;
      for (const plat of PLATFORMS) {
        if (
          g.pvy >= 0 &&
          g.px + PLAYER_W > plat.x && g.px < plat.x + plat.w &&
          g.py + PLAYER_H >= plat.y && g.py + PLAYER_H <= plat.y + 12
        ) {
          g.py = plat.y - PLAYER_H;
          g.pvy = 0;
          g.onGround = true;
        }
      }

      // Floor
      if (g.py > GAME_HEIGHT - PLAYER_H) {
        g.py = GAME_HEIGHT - PLAYER_H;
        g.pvy = 0;
        g.onGround = true;
      }

      // Collectibles
      COLLECTIBLES.forEach((c, i) => {
        if (!g.collected.has(i)) {
          const dx = (g.px + PLAYER_W / 2) - c.x;
          const dy = (g.py + PLAYER_H / 2) - c.y;
          if (Math.sqrt(dx * dx + dy * dy) < 20) {
            g.collected.add(i);
          }
        }
      });

      // Check top platform
      if (g.py < 130) g.reachedTop = true;

      // Walk frame
      if (Math.abs(g.pvx) > 0.5) g.frame++;

      // ── RENDER ──
      ctx.fillStyle = "#0a0a08";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Stars
      for (let i = 0; i < 30; i++) {
        const sx = (i * 173 + 50) % GAME_WIDTH;
        const sy = (i * 97 + 20) % GAME_HEIGHT;
        const brightness = 0.1 + 0.1 * Math.sin(g.time * 0.02 + i);
        ctx.fillStyle = `rgba(255, 191, 0, ${brightness})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Platforms
      for (const plat of PLATFORMS) {
        ctx.fillStyle = "#1a1a18";
        ctx.fillRect(plat.x, plat.y, plat.w, 8);
        ctx.fillStyle = "rgba(229, 101, 75, 0.3)";
        ctx.fillRect(plat.x, plat.y, plat.w, 2);

        if (plat.label) {
          ctx.font = "bold 10px monospace";
          ctx.fillStyle = "rgba(255, 191, 0, 0.6)";
          ctx.fillText(plat.label, plat.x + 4, plat.y - 8);
          ctx.font = "8px monospace";
          ctx.fillStyle = "rgba(255, 191, 0, 0.25)";
          ctx.fillText(plat.sublabel, plat.x + 4, plat.y - 20);
        }
      }

      // Collectibles
      COLLECTIBLES.forEach((c, i) => {
        if (g.collected.has(i)) return;
        const bob = Math.sin(g.time * 0.05 + i) * 3;
        ctx.beginPath();
        ctx.arc(c.x, c.y + bob, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(229, 101, 75, 0.4)";
        ctx.fill();
        ctx.font = "7px monospace";
        ctx.fillStyle = "rgba(229, 101, 75, 0.7)";
        ctx.textAlign = "center";
        ctx.fillText(c.label, c.x, c.y + bob - 10);
        ctx.textAlign = "left";
      });

      // Orb at top (particle container)
      const orbCx = 250;
      const orbCy = 70;
      const orbRadius = 35;

      // Update orb particles
      for (const p of g.orbParticles) {
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
        p.vx += (orbCx - p.x) * 0.005;
        p.vy += (orbCy - p.y) * 0.005;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        const dist = Math.sqrt((p.x - orbCx) ** 2 + (p.y - orbCy) ** 2);
        if (dist > orbRadius) {
          const angle = Math.atan2(p.y - orbCy, p.x - orbCx);
          p.x = orbCx + Math.cos(angle) * orbRadius;
          p.y = orbCy + Math.sin(angle) * orbRadius;
          p.vx *= -0.5;
          p.vy *= -0.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 0.6)`;
        ctx.fill();
      }

      // Orb glow
      const orbGrad = ctx.createRadialGradient(orbCx, orbCy, 0, orbCx, orbCy, orbRadius + 10);
      orbGrad.addColorStop(0, "rgba(229, 101, 75, 0.08)");
      orbGrad.addColorStop(1, "rgba(229, 101, 75, 0)");
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbCx, orbCy, orbRadius + 10, 0, Math.PI * 2);
      ctx.fill();

      // "HIRE ME" text
      if (g.reachedTop) {
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = `rgba(229, 101, 75, ${0.6 + 0.3 * Math.sin(g.time * 0.05)})`;
        ctx.textAlign = "center";
        ctx.fillText("LET'S BUILD", orbCx, orbCy + 4);
        ctx.font = "9px monospace";
        ctx.fillStyle = "rgba(255, 191, 0, 0.4)";
        ctx.fillText("ajay.r.kallepalli@gmail.com", orbCx, orbCy + 18);
        ctx.textAlign = "left";
      }

      // Player
      const walkFrame = Math.floor(g.frame / 8) % 2;
      ctx.save();
      ctx.translate(g.px + PLAYER_W / 2, g.py);
      ctx.scale(g.facing, 1);
      ctx.translate(-PLAYER_W / 2, 0);

      // Head
      ctx.fillStyle = "#e5654b";
      ctx.fillRect(4, 0, 12, 8);
      // Eye
      ctx.fillStyle = "#0a0a08";
      ctx.fillRect(12, 2, 2, 2);
      // Body
      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(4, 8, 12, 8);
      ctx.fillStyle = "#c1440e";
      ctx.fillRect(4, 12, 12, 2); // belt
      // Legs
      if (walkFrame && Math.abs(g.pvx) > 0.5) {
        ctx.fillStyle = "#1a1a18";
        ctx.fillRect(4, 16, 5, 6);
        ctx.fillRect(11, 16, 5, 8);
      } else {
        ctx.fillStyle = "#1a1a18";
        ctx.fillRect(4, 16, 5, 8);
        ctx.fillRect(11, 16, 5, 8);
      }

      ctx.restore();

      // HUD
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(255, 191, 0, 0.4)";
      ctx.fillText(`Skills: ${g.collected.size}/${COLLECTIBLES.length}`, 10, 20);

      // Scanline effect
      for (let y = 0; y < GAME_HEIGHT; y += 3) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
        ctx.fillRect(0, y, GAME_WIDTH, 1);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-[#0a0a08] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          className="border border-amber-400/20"
        />
        <div className="absolute -top-8 left-0 right-0 flex justify-between font-mono text-xs text-amber-400/30">
          <span>← → / A D to move · ↑ / W / Space to jump</span>
          <span>Collect skills · Reach the orb</span>
        </div>
      </div>
      <motion.button
        className="mt-6 font-mono text-xs text-amber-400/30 border border-amber-400/10 px-4 py-2 hover:border-amber-400/30 cursor-pointer"
        onClick={onExit}
        whileHover={{ y: -1 }}
      >
        ← Back to terminal
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function Option6() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a08] text-amber-400 relative">
      <Scanlines />

      {/* Mouse glow */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl bg-amber-400/[0.06] z-0"
        animate={{ x: mousePos.x - 192, y: mousePos.y - 192 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 h-px bg-amber-400 z-[55] origin-left"
        style={{ scaleX: scrollYProgress, width: "100%" }}
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[55] flex justify-between items-center px-8 py-4 bg-gradient-to-b from-[#0a0a08] to-transparent">
        <span className="font-mono text-xs text-amber-400/30">AK</span>
        <div className="flex gap-6">
          {[
            { label: "info", action: () => setInfoOpen(true) },
            { label: "email", action: () => window.open("mailto:ajay.r.kallepalli@gmail.com") },
            { label: "linkedin", action: () => {} },
            { label: "github", action: () => {} },
          ].map(({ label, action }) => (
            <motion.button
              key={label}
              className="font-mono text-xs text-amber-400/30 hover:text-amber-400 transition-colors cursor-pointer"
              onClick={action}
              whileHover={{ y: -1 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-24 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <p className="font-mono text-amber-400/40 text-xs mb-4">
            <TypeWriter text="$ whoami" speed={80} />
          </p>

          <div className="flex items-center gap-6">
            <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight">
              <TypeWriter text="Ajay Kallepalli" delay={800} speed={50} />
            </h1>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, type: "spring" }}
            >
              <ParticleOrb size={56} onClick={() => setGameOpen(true)} />
            </motion.div>
          </div>

          <motion.div
            className="font-mono text-amber-400/50 text-base mt-6 max-w-xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <p>
              Senior Software Engineer building{" "}
              <HoverWord word="AI systems" detail="LangChain, vLLM, GraphRAG" /> in San Francisco.
              From <HoverWord word="computer vision" detail="OpenCV, 87-camera rigs" /> pipelines
              to <HoverWord word="agentic AI" detail="LangGraph, Deep Research" /> that reasons autonomously.
            </p>
          </motion.div>

          <motion.div
            className="flex gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <motion.button
              onClick={() => setInfoOpen(true)}
              className="font-mono text-xs text-amber-400/50 border border-amber-400/20 px-4 py-2 hover:border-amber-400/50 hover:text-amber-400 transition-all cursor-pointer"
              whileHover={{ y: -2 }}
            >
              $ man ajay
            </motion.button>
            <motion.a
              href="/resume.pdf"
              className="font-mono text-xs text-amber-400/30 hover:text-amber-400/60 transition-colors border-b border-transparent hover:border-amber-400/30 flex items-center gap-1"
              whileHover={{ y: -2 }}
            >
              resume.pdf →
            </motion.a>
          </motion.div>

          <motion.p
            className="font-mono text-[10px] text-amber-400/15 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
          >
            hint: click the orb
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-8 md:left-24 font-mono text-xs text-amber-400/20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↓ scroll
        </motion.div>
      </section>

      {/* EXPERIENCE PREVIEW (scrollable section) */}
      <section className="px-8 md:px-24 py-24 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="font-mono text-amber-400/40 text-xs mb-2">$ ls experience/</p>
          <h2 className="text-2xl font-mono font-bold mb-8">Experience</h2>
        </motion.div>

        <div className="space-y-3">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.company}
              className="flex justify-between items-center py-3 border-b border-amber-400/10 cursor-pointer group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              onClick={() => { setInfoOpen(true); }}
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/20 group-hover:bg-[#e5654b] transition-colors" />
                <span className="font-mono text-sm text-amber-400/70 group-hover:text-amber-400 transition-colors">{exp.company}</span>
                <span className="font-mono text-xs text-amber-400/20">{exp.role}</span>
              </div>
              <span className="font-mono text-xs text-amber-400/20">{exp.period}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="font-mono text-[10px] text-amber-400/20 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          click any row or run $ man ajay for details
        </motion.p>
      </section>

      {/* SKILLS (quick view) */}
      <section className="px-8 md:px-24 py-16 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="font-mono text-amber-400/40 text-xs mb-2">$ echo $SKILLS</p>
        </motion.div>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Python", "TypeScript", "PyTorch", "LangChain", "Docker", "K8s", "AWS", "React", "GraphRAG", "FastAPI"].map((skill, i) => (
            <motion.span
              key={skill}
              className="font-mono text-xs px-3 py-1.5 border border-amber-400/10 hover:border-amber-400/40 hover:bg-amber-400/5 transition-all cursor-default"
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

      {/* FOOTER */}
      <footer className="px-8 md:px-24 py-12 max-w-4xl relative z-10 border-t border-amber-400/10">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-mono text-xs text-amber-400/40">ajay.r.kallepalli@gmail.com</p>
            <p className="font-mono text-[10px] text-amber-400/15 mt-1">San Francisco, CA</p>
          </div>
          <p className="font-mono text-[10px] text-amber-400/15">{new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* PANELS & OVERLAYS */}
      <InfoPanel open={infoOpen} onClose={() => setInfoOpen(false)} />

      <AnimatePresence>
        {gameOpen && <PlatformerGame onExit={() => setGameOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
