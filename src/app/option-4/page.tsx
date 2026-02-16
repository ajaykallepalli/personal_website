"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  OPTION 4: "KARATEKA QUEST"
  ──────────────────────────
  A side-scrolling pixel game you actually PLAY. Arrow keys move
  a character through rooms. Each room reveals a section of the
  resume. Retro CRT aesthetic but the layout IS the game — not
  sections you scroll through, but rooms you walk into.

  Controls: ← → arrow keys or A/D to move
  The character walks between zones. Each zone has content.
*/

const PIXEL = 4; // base pixel size

const ZONES = [
  {
    id: "intro",
    x: 0,
    width: 600,
    label: "HOME",
    content: {
      title: "AJAY KALLEPALLI",
      subtitle: "Senior Software Engineer, AI",
      lines: ["San Francisco, CA", "UCLA → USF → Building AI systems"],
    },
  },
  {
    id: "pwc",
    x: 700,
    width: 500,
    label: "PwC",
    content: {
      title: "PwC — 2025–Present",
      subtitle: "Senior Software Engineer, AI",
      lines: [
        "AI opportunity tracking for firm leadership",
        "Semantic search across knowledge assets",
        "Deep Research Agent prototype",
        "$50M+ pipeline visibility",
      ],
    },
  },
  {
    id: "honeywell",
    x: 1300,
    width: 500,
    label: "HONEYWELL",
    content: {
      title: "Honeywell — 2025",
      subtitle: "Software Engineer, Agentic AI",
      lines: [
        "LangGraph-orchestrated chatbot",
        "SQL, GraphRAG & visualization agents",
        "Azure Kubernetes blue-green deploys",
      ],
    },
  },
  {
    id: "arango",
    x: 1900,
    width: 500,
    label: "ARANGODB",
    content: {
      title: "ArangoDB — 2024–2025",
      subtitle: "Software Engineer, AI/ML",
      lines: [
        "GraphRAG: 50% → 90% accuracy",
        "RL-finetuned LLM for graph queries",
        "Adopted by NVIDIA's team",
      ],
    },
  },
  {
    id: "qualcomm",
    x: 2500,
    width: 500,
    label: "QUALCOMM",
    content: {
      title: "Qualcomm — 2021–2024",
      subtitle: "ML Engineer",
      lines: [
        "Petabyte-scale CV pipelines",
        "16x processing speedup",
        "87-camera photogrammetry rig",
        "Saved $35K + 4000 engineering hours",
      ],
    },
  },
  {
    id: "skills",
    x: 3100,
    width: 600,
    label: "SKILLS",
    content: {
      title: "SKILLS & TOOLS",
      subtitle: "Inventory",
      lines: [
        "Python · TypeScript · SQL · R",
        "PyTorch · LangChain · vLLM",
        "Docker · Kubernetes · AWS",
        "React · Next.js · FastAPI",
        "GraphRAG · Spark · Kafka",
      ],
    },
  },
  {
    id: "contact",
    x: 3800,
    width: 400,
    label: "CONTACT",
    content: {
      title: "GET IN TOUCH",
      subtitle: "ajay.r.kallepalli@gmail.com",
      lines: ["LinkedIn: /in/ajaykallepalli", "(424) 354-7363"],
    },
  },
];

const WORLD_WIDTH = 4400;
const GROUND_Y = 340;
const CHAR_WIDTH = 24;
const CHAR_HEIGHT = 36;

// Simple pixel character frames
function PixelCharacter({ frame, facing }: { frame: number; facing: "left" | "right" }) {
  const scaleX = facing === "left" ? -1 : 1;

  // Two-frame walk cycle
  const isWalk = frame % 2 === 1;

  return (
    <svg
      width={CHAR_WIDTH}
      height={CHAR_HEIGHT}
      viewBox="0 0 6 9"
      style={{ transform: `scaleX(${scaleX})`, imageRendering: "pixelated" }}
    >
      {/* Head */}
      <rect x="1" y="0" width="4" height="3" fill="#e5654b" />
      {/* Eyes */}
      <rect x="3" y="1" width="1" height="1" fill="#1a1a18" />
      {/* Body */}
      <rect x="1" y="3" width="4" height="3" fill="#f5f0e8" />
      {/* Belt */}
      <rect x="1" y="4" width="4" height="1" fill="#c1440e" />
      {/* Legs */}
      {isWalk ? (
        <>
          <rect x="1" y="6" width="2" height="2" fill="#1a1a18" />
          <rect x="3" y="6" width="2" height="3" fill="#1a1a18" />
        </>
      ) : (
        <>
          <rect x="1" y="6" width="2" height="3" fill="#1a1a18" />
          <rect x="3" y="6" width="2" height="3" fill="#1a1a18" />
        </>
      )}
      {/* Arm */}
      {isWalk ? (
        <rect x="5" y="3" width="1" height="2" fill="#e5654b" />
      ) : (
        <rect x="5" y="4" width="1" height="1" fill="#e5654b" />
      )}
    </svg>
  );
}

// Pixel art buildings/decorations for each zone
function ZoneDecoration({ zone }: { zone: typeof ZONES[0] }) {
  const colors = {
    intro: "#e5654b",
    pwc: "#c1440e",
    honeywell: "#8b6914",
    arango: "#4a7c59",
    qualcomm: "#4a6fa5",
    skills: "#7c4a8b",
    contact: "#e5654b",
  };
  const color = colors[zone.id as keyof typeof colors] || "#e5654b";

  return (
    <div className="absolute bottom-0" style={{ left: zone.x + zone.width / 2 - 40 }}>
      {/* Simple pixel building */}
      <svg width="80" height="60" viewBox="0 0 20 15" style={{ imageRendering: "pixelated" }}>
        {/* Building body */}
        <rect x="3" y="3" width="14" height="12" fill={color} opacity={0.2} />
        <rect x="3" y="3" width="14" height="1" fill={color} opacity={0.4} />
        {/* Windows */}
        <rect x="5" y="6" width="2" height="2" fill={color} opacity={0.5} />
        <rect x="9" y="6" width="2" height="2" fill={color} opacity={0.5} />
        <rect x="13" y="6" width="2" height="2" fill={color} opacity={0.5} />
        {/* Door */}
        <rect x="8" y="11" width="4" height="4" fill={color} opacity={0.3} />
        {/* Antenna */}
        <rect x="10" y="0" width="1" height="3" fill={color} opacity={0.3} />
        <rect x="9" y="0" width="3" height="1" fill={color} opacity={0.3} />
      </svg>
    </div>
  );
}

// Ground tiles
function Ground({ worldWidth }: { worldWidth: number }) {
  const tiles = Math.ceil(worldWidth / (PIXEL * 2));
  return (
    <div className="absolute w-full" style={{ top: GROUND_Y + CHAR_HEIGHT }}>
      <div className="flex" style={{ width: worldWidth }}>
        {Array.from({ length: tiles }).map((_, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{
              width: PIXEL * 2,
              height: PIXEL * 2,
              backgroundColor: i % 2 === 0 ? "#2a2a28" : "#222220",
            }}
          />
        ))}
      </div>
      <div className="h-32" style={{ width: worldWidth, backgroundColor: "#1a1a18" }} />
    </div>
  );
}

// Zone markers (signs above zones)
function ZoneSign({ zone, active }: { zone: typeof ZONES[0]; active: boolean }) {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: zone.x + zone.width / 2,
        bottom: 80,
        transform: "translateX(-50%)",
      }}
    >
      <motion.div
        className="font-mono text-[10px] tracking-[0.3em] px-3 py-1 border"
        animate={{
          borderColor: active ? "#e5654b" : "rgba(229,101,75,0.2)",
          color: active ? "#e5654b" : "rgba(229,101,75,0.3)",
          backgroundColor: active ? "rgba(229,101,75,0.05)" : "transparent",
        }}
        transition={{ duration: 0.3 }}
      >
        {zone.label}
      </motion.div>
      {/* Sign post */}
      <div className="w-px h-6 bg-[#e5654b]/20" />
    </div>
  );
}

// Stars / parallax background
function Stars() {
  const stars = useRef(
    Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() > 0.7 ? 2 : 1,
      twinkleDelay: Math.random() * 3,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.current.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-400/40"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: 2 + Math.random() * 2,
            delay: star.twinkleDelay,
          }}
        />
      ))}
    </div>
  );
}

export default function Option4() {
  const [charX, setCharX] = useState(100);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [frame, setFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [activeZone, setActiveZone] = useState<typeof ZONES[0] | null>(ZONES[0]);
  const [showHelp, setShowHelp] = useState(true);

  const keysRef = useRef<Set<string>>(new Set());
  const animFrameRef = useRef<number>(0);
  const lastFrameTime = useRef(0);

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const cameraX = Math.max(0, Math.min(charX - viewportWidth / 2, WORLD_WIDTH - viewportWidth));

  // Determine active zone
  useEffect(() => {
    const zone = ZONES.find(
      (z) => charX >= z.x && charX <= z.x + z.width
    );
    setActiveZone(zone || null);
  }, [charX]);

  // Game loop
  const gameLoop = useCallback(
    (time: number) => {
      const delta = time - lastFrameTime.current;
      const keys = keysRef.current;
      const speed = 4;
      let moving = false;

      if (keys.has("ArrowRight") || keys.has("d")) {
        setCharX((x) => Math.min(x + speed, WORLD_WIDTH - 50));
        setFacing("right");
        moving = true;
      }
      if (keys.has("ArrowLeft") || keys.has("a")) {
        setCharX((x) => Math.max(x - speed, 0));
        setFacing("left");
        moving = true;
      }

      setIsMoving(moving);
      if (moving && delta > 150) {
        setFrame((f) => f + 1);
        lastFrameTime.current = time;
      }

      if (moving) setShowHelp(false);
      animFrameRef.current = requestAnimationFrame(gameLoop);
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameLoop]);

  // Mobile touch controls
  const handleTouch = (dir: "left" | "right", active: boolean) => {
    if (active) {
      keysRef.current.add(dir === "left" ? "ArrowLeft" : "ArrowRight");
    } else {
      keysRef.current.delete("ArrowLeft");
      keysRef.current.delete("ArrowRight");
    }
  };

  return (
    <div className="h-screen bg-[#0a0a08] overflow-hidden relative select-none" tabIndex={0}>
      <Stars />

      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.4) 1px, rgba(0,0,0,0.4) 2px)",
          backgroundSize: "100% 2px",
        }}
      />

      {/* HUD - top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 py-4">
        <div className="font-mono text-amber-400/60 text-xs tracking-widest">
          AJAY KALLEPALLI
        </div>
        <div className="flex gap-6 font-mono text-[10px] tracking-wider">
          {ZONES.map((z) => (
            <motion.button
              key={z.id}
              className={`cursor-pointer transition-colors ${
                activeZone?.id === z.id ? "text-[#e5654b]" : "text-amber-400/20 hover:text-amber-400/50"
              }`}
              onClick={() => {
                setCharX(z.x + z.width / 2);
                setShowHelp(false);
              }}
              whileHover={{ y: -1 }}
            >
              {z.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* World container */}
      <div
        className="absolute w-full h-full"
        style={{
          transform: `translateX(${-cameraX}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        {/* Zone decorations */}
        {ZONES.map((zone) => (
          <ZoneDecoration key={zone.id} zone={zone} />
        ))}

        {/* Zone signs */}
        <div className="absolute w-full" style={{ top: GROUND_Y - 60 }}>
          {ZONES.map((zone) => (
            <ZoneSign key={zone.id} zone={zone} active={activeZone?.id === zone.id} />
          ))}
        </div>

        {/* Ground */}
        <Ground worldWidth={WORLD_WIDTH} />

        {/* Ground detail - dashed line markers for zone boundaries */}
        <div className="absolute w-full" style={{ top: GROUND_Y + CHAR_HEIGHT - 2 }}>
          {ZONES.map((zone) => (
            <div
              key={zone.id}
              className="absolute h-px bg-[#e5654b]/10"
              style={{ left: zone.x, width: zone.width }}
            />
          ))}
        </div>

        {/* Character */}
        <div
          className="absolute z-20"
          style={{
            left: charX - CHAR_WIDTH / 2,
            top: GROUND_Y,
            transition: isMoving ? "none" : "left 0.05s",
          }}
        >
          <PixelCharacter frame={frame} facing={facing} />
          {/* Character shadow */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#e5654b]/10 rounded-full"
            style={{ width: CHAR_WIDTH - 4, height: 4 }}
          />
        </div>
      </div>

      {/* Content panel - shows active zone info */}
      <AnimatePresence mode="wait">
        {activeZone && (
          <motion.div
            key={activeZone.id}
            className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:bottom-8 md:w-[440px] z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-[#0a0a08]/90 border border-amber-400/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-[#e5654b]" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-amber-400/40">
                  {activeZone.label}
                </span>
              </div>
              <h2 className="font-mono text-xl text-amber-400 font-bold tracking-tight">
                {activeZone.content.title}
              </h2>
              <p className="font-mono text-xs text-[#e5654b] mt-1">
                {activeZone.content.subtitle}
              </p>
              <div className="mt-4 space-y-2">
                {activeZone.content.lines.map((line, i) => (
                  <motion.p
                    key={line}
                    className="font-mono text-xs text-amber-400/50 flex items-start gap-2"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <span className="text-[#e5654b] mt-px">›</span>
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0a0a08]/80 border border-amber-400/20 px-8 py-6 text-center pointer-events-auto"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <p className="font-mono text-amber-400 text-sm mb-2">← → or A/D to explore</p>
              <p className="font-mono text-amber-400/30 text-xs">Walk through my career</p>
              <p className="font-mono text-amber-400/20 text-[10px] mt-3">or click zone names in the HUD</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile touch controls */}
      <div className="fixed bottom-8 left-8 z-40 flex gap-4 md:hidden">
        <button
          className="w-14 h-14 border border-amber-400/30 flex items-center justify-center font-mono text-amber-400/60 text-xl active:bg-amber-400/10"
          onTouchStart={() => handleTouch("left", true)}
          onTouchEnd={() => handleTouch("left", false)}
        >
          ←
        </button>
        <button
          className="w-14 h-14 border border-amber-400/30 flex items-center justify-center font-mono text-amber-400/60 text-xl active:bg-amber-400/10"
          onTouchStart={() => handleTouch("right", true)}
          onTouchEnd={() => handleTouch("right", false)}
        >
          →
        </button>
      </div>

      {/* Mini-map */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:block">
        <div className="relative w-48 h-1 bg-amber-400/10 rounded">
          {/* Zone indicators */}
          {ZONES.map((z) => (
            <div
              key={z.id}
              className="absolute top-0 h-full bg-amber-400/5"
              style={{
                left: `${(z.x / WORLD_WIDTH) * 100}%`,
                width: `${(z.width / WORLD_WIDTH) * 100}%`,
              }}
            />
          ))}
          {/* Player position */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#e5654b] rounded-full"
            style={{ left: `${(charX / WORLD_WIDTH) * 100}%` }}
            layout
          />
        </div>
      </div>
    </div>
  );
}
