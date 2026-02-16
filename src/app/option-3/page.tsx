"use client";

import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/*
  OPTION 3: "CLEAN CRAFT"
  ───────────────────────
  Inspired by the screenshot (rauno.me / Devouring Details).
  Light background, lots of whitespace, orange accent dot,
  geometric line illustrations. But underneath: rich scroll-
  triggered animations, magnetic hover effects, physics-based
  interactions. The "hidden details" approach — looks minimal
  until you start moving your mouse and scrolling.
*/

const RESUME = {
  name: "Ajay Kallepalli",
  title: "Senior Software Engineer, AI",
  location: "San Francisco, CA",
  email: "ajay.r.kallepalli@gmail.com",
  experience: [
    {
      company: "PwC",
      role: "Senior Software Engineer, AI",
      period: "2025 — Present",
      items: [
        "AI-enabled opportunity tracking for firm leadership",
        "Semantic search across proposals & knowledge assets",
        "Deep Research Agent for client intelligence synthesis",
      ],
    },
    {
      company: "Honeywell",
      role: "Software Engineer, Agentic AI",
      period: "2025",
      items: [
        "LangGraph chatbot with SQL, GraphRAG & viz agents",
        "AKS deployment with zero-downtime blue-green releases",
      ],
    },
    {
      company: "ArangoDB",
      role: "Software Engineer, AI/ML",
      period: "2024 — 2025",
      items: [
        "GraphRAG solution: 50% → 90% answer accuracy",
        "RL-finetuned LLM for graph query generation",
        "langchain-arangodb package adopted by NVIDIA",
      ],
    },
    {
      company: "Qualcomm",
      role: "ML Engineer",
      period: "2021 — 2024",
      items: [
        "Petabyte-scale CV pipelines for facial modeling",
        "16x speedup via distributed computing",
        "87-camera photogrammetry pipeline",
      ],
    },
  ],
  skills: {
    "Languages": ["Python", "TypeScript", "SQL", "R"],
    "AI/ML": ["PyTorch", "LangChain", "GraphRAG", "vLLM", "Hugging Face"],
    "Infrastructure": ["Docker", "Kubernetes", "AWS", "CI/CD"],
    "Data": ["Spark", "Kafka", "MongoDB", "BigQuery"],
  },
  education: [
    { school: "University of San Francisco", degree: "M.S. Data Science", year: "2025" },
    { school: "UCLA", degree: "B.S. Statistics · B.A. Economics", year: "2021" },
  ],
};

// Magnetic button effect
function MagneticWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

function SectionDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="py-16 flex items-center gap-4">
      <motion.div
        className="flex-1 h-px bg-[#e5e0d8]"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-[#e5654b]"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      />
      <motion.div
        className="flex-1 h-px bg-[#e5e0d8]"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{ originX: 1 }}
      />
    </div>
  );
}

function ExperienceEntry({ exp, index }: { exp: typeof RESUME.experience[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="group cursor-pointer py-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Orange dot indicator */}
          <motion.div
            className="w-2 h-2 rounded-full bg-[#e5654b] mt-2 shrink-0"
            animate={{ scale: open ? [1, 1.5, 1] : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div>
            <h3 className="text-lg font-medium text-[#1a1a18] group-hover:text-[#e5654b] transition-colors">
              {exp.company}
            </h3>
            <p className="text-sm text-[#1a1a18]/40 mt-0.5">{exp.role}</p>
          </div>
        </div>
        <span className="text-xs text-[#1a1a18]/30 font-mono tracking-wider shrink-0">{exp.period}</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="ml-6 mt-4 space-y-2 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {exp.items.map((item, i) => (
              <motion.li
                key={i}
                className="text-sm text-[#1a1a18]/60 flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="text-[#e5654b] mt-1 text-xs">—</span>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Bottom line that animates on hover */}
      <motion.div
        className="h-px bg-[#e5e0d8] mt-6 origin-left"
        whileHover={{ scaleX: 1, backgroundColor: "#e5654b" }}
        initial={{ scaleX: 0.3 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
      />
    </motion.div>
  );
}

function FloatingGeometry() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Circle */}
      <motion.div
        className="absolute right-[15%] top-[20%] w-48 h-48 rounded-full border border-[#e5e0d8]"
        style={{ y: y1 }}
      />
      {/* Triangle made of lines */}
      <motion.div
        className="absolute left-[10%] top-[60%] w-24 h-24 border-l border-b border-[#e5e0d8]"
        style={{ y: y2, rotate }}
      />
      {/* Small dot cluster */}
      <motion.div
        className="absolute right-[25%] bottom-[30%] flex gap-2"
        style={{ y: y2 }}
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-[#e5654b]/20" />
        ))}
      </motion.div>
    </div>
  );
}

export default function Option3() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [activeNav, setActiveNav] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "experience", "skills", "education"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
            setActiveNav(id);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1a1a18] relative">
      <FloatingGeometry />

      {/* Progress line */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-[#e5654b] z-50 origin-left"
        style={{ scaleX: smoothProgress, width: "100%" }}
      />

      {/* Floating nav */}
      <motion.nav
        className="fixed top-8 left-1/2 -translate-x-1/2 z-40 flex gap-8 bg-[#faf8f4]/80 backdrop-blur-sm px-6 py-3 rounded-full border border-[#e5e0d8]"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        {["about", "experience", "skills", "education"].map((section) => (
          <motion.a
            key={section}
            href={`#${section}`}
            className={`text-xs tracking-wider transition-colors ${
              activeNav === section ? "text-[#e5654b]" : "text-[#1a1a18]/40 hover:text-[#1a1a18]"
            }`}
            whileHover={{ y: -1 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {section}
          </motion.a>
        ))}
      </motion.nav>

      {/* HERO */}
      <section id="about" className="min-h-screen flex flex-col justify-center px-8 md:px-24 lg:px-32 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="w-3 h-3 rounded-full bg-[#e5654b]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <span className="text-xs tracking-[0.3em] text-[#1a1a18]/40 uppercase">San Francisco</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1]">
            Ajay
            <br />
            <span className="font-medium">Kallepalli</span>
          </h1>

          <motion.p
            className="text-lg text-[#1a1a18]/50 mt-8 max-w-md leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Building intelligent systems at the intersection of
            AI engineering and software craft.
          </motion.p>

          <motion.div
            className="flex gap-6 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { label: "Email", href: "mailto:ajay.r.kallepalli@gmail.com" },
              { label: "LinkedIn", href: "#" },
              { label: "GitHub", href: "#" },
            ].map((link) => (
              <MagneticWrap key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-[#1a1a18]/40 hover:text-[#e5654b] transition-colors border-b border-transparent hover:border-[#e5654b]/30"
                >
                  {link.label}
                </a>
              </MagneticWrap>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="px-8 md:px-24 lg:px-32 max-w-5xl mx-auto relative z-10">
        <SectionDivider />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <span className="text-xs tracking-[0.3em] text-[#e5654b] uppercase">Experience</span>
        </motion.div>

        <div>
          {RESUME.experience.map((exp, i) => (
            <ExperienceEntry key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="px-8 md:px-24 lg:px-32 max-w-5xl mx-auto relative z-10">
        <SectionDivider />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-xs tracking-[0.3em] text-[#e5654b] uppercase">Skills</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {Object.entries(RESUME.skills).map(([category, skills], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h3 className="text-sm font-medium text-[#1a1a18]/30 mb-4 tracking-wider">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    className="text-sm px-3 py-1.5 rounded-full border border-[#e5e0d8] text-[#1a1a18]/60 hover:border-[#e5654b] hover:text-[#e5654b] transition-all cursor-default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.1 + i * 0.04 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="px-8 md:px-24 lg:px-32 max-w-5xl mx-auto relative z-10 pb-24">
        <SectionDivider />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-xs tracking-[0.3em] text-[#e5654b] uppercase">Education</span>
        </motion.div>

        {RESUME.education.map((edu, i) => (
          <motion.div
            key={edu.school}
            className="flex items-baseline justify-between py-4 border-b border-[#e5e0d8] last:border-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div>
              <h3 className="text-lg font-medium">{edu.school}</h3>
              <p className="text-sm text-[#1a1a18]/40 mt-1">{edu.degree}</p>
            </div>
            <span className="font-mono text-xs text-[#1a1a18]/30">{edu.year}</span>
          </motion.div>
        ))}

        <SectionDivider />

        <div className="flex justify-between items-end">
          <p className="text-xs text-[#1a1a18]/30">
            ajay.r.kallepalli@gmail.com
          </p>
          <p className="text-xs text-[#1a1a18]/20">
            {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </div>
  );
}
