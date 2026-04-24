"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CHAOS_ICONS = [
  // Notion
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.427.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233l4.764 7.279v-6.44l-1.168-.14c-.093-.514.28-.887.747-.933l3.222-.186h.7l-.233.047z"/></svg>`,
  // GitHub
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.245-.015-2.445-3.36.705-4.065-1.575-4.065-1.575-.54-1.365-1.32-1.725-1.32-1.725-1.095-.735.09-.735.09-.735 1.185.09 1.815 1.215 1.815 1.215 1.065 1.815 2.805 1.305 3.495.99.105-.765.42-1.305.765-1.605-2.67-.3-5.475-1.335-5.475-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3.015-.405s2.055.135 3.015.405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.82 5.625-5.49 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  // Slack
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 12.368c0-1.852-.29-3.632-.844-5.324C3.04 6.445 2.325 6.05 1.608 5.957v.003a5.04 5.04 0 0 0-1.47.27c.017.24.1.47.234.685.14.215.323.402.542.552a3.82 3.82 0 0 1-.14.538c-.095.264-.19.526-.29.785-.095.26-.19.517-.285.776-.1.258-.19.517-.285.772-.1.257-.19.514-.285.768-.1.255-.19.508-.285.76-.1.253-.19.504-.285.753-.1.25-.19.498-.285.743-.1.245-.19.488-.285.728-.1.24-.19.477-.285.712-.1.235-.19.47-.285.702-.1.23-.19.458-.285.685-.1.226-.19.45-.285.672-.1.22-.19.439-.285.655-.1.215-.19.427-.285.637-.1.21-.19.417-.285.62-.1.204-.19.405-.285.603-.1.197-.19.39-.285.582-.095.19-.19.378-.285.563-.1.185-.19.367-.285.547-.1.18-.19.356-.285.53-.1.173-.19.344-.285.513-.095.168-.19.333-.285.495-.095.162-.19.322-.285.479-.095.156-.19.31-.285.462-.095.15-.19.298-.285.443-.095.145-.19.287-.285.427-.095.14-.19.276-.285.41-.095.133-.19.264-.285.392-.095.128-.19.253-.285.376-.095.122-.19.242-.285.36-.095.117-.19.231-.285.343-.095.112-.19.22-.285.327-.095.106-.19.209-.285.31-.095.101-.19.199-.285.294-.095.096-.19.188-.285.278-.095.09-.19.177-.285.262-.095.085-.19.167-.285.247-.095.08-.19.156-.285.231-.095.073-.19.144-.285.212-.095.068-.19.133-.285.195-.095.062-.19.121-.285.177-.095.057-.19.11-.285.16-.095.051-.19.098-.285.143-.095.045-.19.086-.285.125-.095.039-.19.074-.285.106-.095.033-.19.061-.285.086-.095.026-.19.047-.285.065a1.665 1.665 0 0 1-.285.043c-.095.01-.19.016-.285.018V12.368zm16.917 0c0 1.852.29 3.632.844 5.324 1.158.599 1.873.993 2.59 1.086v-.003a5.04 5.04 0 0 0 1.47-.27c-.017-.24-.1-.47-.234-.685-.14-.215-.323-.402-.542-.552.048-.18.094-.36.14-.538.095-.264.19-.526.29-.785.095-.26.19-.517.285-.776.1-.258.19-.517.285-.772.1-.257.19-.514.285-.768.1-.255.19-.508.285-.76.1-.253.19-.504.285-.753.1-.25.19-.498.285-.743.1-.245.19-.488.285-.728.1-.24.19-.477.285-.712.1-.235.19-.47.285-.702.1-.23.19-.458.285-.685.1-.226.19-.45.285-.672.1-.22.19-.439.285-.655.1-.215.19-.427.285-.637.1-.21.19-.417.285-.62.1-.204.19-.405.285-.603.1-.197.19-.39.285-.582.095-.19.19-.378.285-.563.1-.185.19-.367.285-.547.1-.18.19-.356.285-.53.1-.173.19-.344.285-.513.095-.168.19-.333.285-.495.095-.162.19-.322.285-.479.095-.156.19-.31.285-.462.095-.15.19-.298.285-.443.095-.145.19-.287.285-.427.095-.14.19-.276.285-.41.095-.133.19-.264.285-.392.095-.128.19-.253.285-.376.095-.122.19-.242.285-.36.095-.117.19-.231.285-.343.095-.112.19-.22.285-.327.095-.106.19-.209.285-.31.095-.101.19-.199.285-.294.095-.096.19-.188.285-.278.095-.09.19-.177.285-.262.095-.085.19-.167.285-.247.095-.08.19-.156.285-.231.095-.073.19-.144.285-.212.095-.068.19-.133.285-.195.095-.062.19-.121.285-.177.095-.057.19-.11.285-.16.095-.051.19-.098.285-.143.095-.045.19-.086.285-.125.095-.039.19-.074.285-.106.095-.033.19-.061.285-.086.095-.026.19-.047.285-.065a1.665 1.665 0 0 1 .285-.043c.095-.01.19-.016.285-.018V12.368z"/></svg>`,
  // VS Code
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.15 2.587L18.21.21a3.456 3.456 0 0 0-3.18.738L13.26 2.28l-1.14 2.835a.75.75 0 0 1-1.29.31L7.68 2.65l-6.72 3.51 1.89 5.19a.75.75 0 0 1-.29 1.01L.52 14.08a.75.75 0 0 0 .18.98l2.88 2.17a.75.75 0 0 0 1.02-.25l4.74-5.88 2.67 5.16a.75.75 0 0 0 1.2.23l2.28-4.02 1.71 2.04a.75.75 0 0 0 1.2-.19L24 5.15a3.454 3.454 0 0 0-.85-2.562z"/></svg>`,
  // Browser
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm2.286 17.83c-.402.253-.887.382-1.372.382-.78 0-1.457-.43-1.768-1.05a5.56 5.56 0 0 1-.53-.92c-.21-.47-.32-.98-.32-1.5 0-.52.11-1.03.32-1.5.15-.36.33-.68.53-.92.31-.62.988-1.05 1.768-1.05.485 0 .97.13 1.372.382.35.22.64.514.857.858.217.345.348.742.383 1.164-.035.422-.166.82-.383 1.164-.217.344-.507.638-.857.858z"/></svg>`,
  // Terminal
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h20v2H2zM2 7h12v2H2zM2 11h8v2H2zM2 15h16v2H2zM2 19h10v2H2z"/></svg>`,
  // File
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path fill="none" stroke="currentColor" strokeWidth="2" d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`,
  // Bookmark
  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3A5.5 5.5 0 0 0 12 8.5a5.5 5.5 0 0 0 5.5 5.5c1.13 0 2.18-.34 3.06-.92A5.5 5.5 0 0 0 12 17.5a5.5 5.5 0 0 0 5.5 5.5c1.52 0 2.9-.62 3.88-1.62A5.5 5.5 0 0 0 23 12a5.5 5.5 0 0 0-5.5-5.5c-.76 0-1.47.16-2.12.44A5.5 5.5 0 0 0 12 3.5a5.5 5.5 0 0 0-5.5 5.5c0 .76.16 1.47.44 2.12A5.5 5.5 0 0 0 3.5 6.12 5.5 5.5 0 0 0 6.12 4.5 5.5 5.5 0 0 0 12 3.5a5.5 5.5 0 0 0 5.5-1z"/></svg>`,
];

const ITEM_COLORS = {
  snippet: "#3b82f6",
  prompt: "#f59e0b",
  command: "#06b6d4",
  note: "#22c55e",
  file: "#64748b",
  image: "#ec4899",
  link: "#6366f1",
} as const;

type ItemType = keyof typeof ITEM_COLORS;

interface IconState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  baseScale: number;
  speed: number;
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [icons, setIcons] = useState<IconState[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (containerSize.width === 0) return;

    const initialIcons: IconState[] = CHAOS_ICONS.map((_, i) => {
      const speed = 1.5 + Math.random() * 1.5;
      return {
        x: Math.random() * (containerSize.width - 48),
        y: Math.random() * (containerSize.height - 48),
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        scale: 0.9 + Math.random() * 0.2,
        baseScale: 0.9 + Math.random() * 0.2,
        speed,
      };
    });
    setIcons(initialIcons);
  }, [containerSize]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (icons.length === 0 || containerSize.width === 0) return;

    const animate = () => {
      setIcons((prevIcons) =>
        prevIcons.map((icon) => {
          let { x, y, vx, vy, rotation, rotationSpeed, scale, baseScale, speed } = icon;

          x += vx;
          y += vy;
          rotation += rotationSpeed;
          scale = baseScale + Math.sin(Date.now() * 0.002 + x * 0.01) * 0.15;

          const maxX = containerSize.width - 48;
          const maxY = containerSize.height - 48;

          if (x <= 0 || x >= maxX) {
            vx *= -1;
            x = Math.max(0, Math.min(maxX, x));
          }
          if (y <= 0 || y >= maxY) {
            vy *= -1;
            y = Math.max(0, Math.min(maxY, y));
          }

          const dx = x + 24 - mousePos.x;
          const dy = y + 24 - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120 && distance > 0) {
            const force = (120 - distance) / 120;
            vx += (dx / distance) * force * 0.8;
            vy += (dy / distance) * force * 0.8;
          }

          vx *= 0.985;
          vy *= 0.985;

          const minVel = speed * 0.3;
          if (Math.abs(vx) < minVel) vx = (Math.random() - 0.5) * speed;
          if (Math.abs(vy) < minVel) vy = (Math.random() - 0.5) * speed;

          const maxVel = speed * 2;
          vx = Math.max(-maxVel, Math.min(maxVel, vx));
          vy = Math.max(-maxVel, Math.min(maxVel, vy));

          return { ...icon, x, y, vx, vy, rotation, scale };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [icons.length, containerSize, mousePos]);

  const itemTypes: ItemType[] = ["snippet", "prompt", "command", "note", "file", "image", "link"];

  return (
    <section className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center">
      <div className="text-center max-w-4xl mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Stop Losing Your{" "}
          <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Developer Knowledge
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Code snippets buried in VS Code. AI prompts scattered across chats. Commands in bash history.
          DevStash brings order to the chaos — one searchable hub for all your dev essentials.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">Start Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">See Demo</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl">
        {/* Chaos Container */}
        <div className="flex-1 w-full">
          <div className="bg-card border border-border rounded-2xl p-6 h-80 lg:h-96 relative overflow-hidden">
            <span className="text-sm text-muted-foreground absolute top-4 left-4 z-10">
              Your knowledge today...
            </span>
            <div ref={containerRef} className="absolute inset-0 p-6">
              {CHAOS_ICONS.map((iconSvg, i) => (
                <div
                  key={i}
                  className="absolute w-12 h-12 flex items-center justify-center rounded-xl bg-secondary border border-border transition-transform duration-75"
                  style={{
                    transform: icons[i]
                      ? `translate(${icons[i].x}px, ${icons[i].y}px) rotate(${icons[i].rotation}deg) scale(${icons[i].scale})`
                      : "translate(0, 0) scale(1)",
                    zIndex: 1,
                  }}
                  dangerouslySetInnerHTML={{ __html: iconSvg }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Transform Arrow */}
        <div className="hidden lg:flex items-center justify-center w-20">
          <svg
            className="w-12 h-12 text-blue-500 animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <div className="lg:hidden">
          <svg
            className="w-12 h-12 text-blue-500 animate-pulse rotate-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        {/* Dashboard Preview */}
        <div className="flex-1 w-full">
          <div className="bg-card border border-border rounded-2xl p-6 h-80 lg:h-96 relative overflow-hidden">
            <span className="text-sm text-muted-foreground absolute top-4 right-4 z-10">
              ...with DevStash
            </span>
            <div className="flex flex-col gap-3 h-full">
              {/* Header */}
              <div className="flex items-center gap-3 px-2">
                <div className="w-6 h-6 bg-blue-500/70 rounded-md" />
                <div className="flex-1 h-7 bg-secondary rounded-md opacity-50" />
                <div className="w-7 h-7 bg-secondary rounded-md opacity-50" />
                <div className="w-7 h-7 bg-secondary rounded-md opacity-50" />
              </div>
              <div className="flex gap-3 flex-1 min-h-0">
                {/* Sidebar */}
                <div className="w-16 flex flex-col gap-2 py-2">
                  {itemTypes.map((type, i) => (
                    <div
                      key={type}
                      className={`h-9 rounded-md flex items-center gap-1.5 px-2 ${
                        i === 0 ? "bg-blue-500/25" : "bg-secondary"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded"
                        style={{ background: ITEM_COLORS[type] }}
                      />
                      <div className="w-6 h-2 bg-muted-foreground/30 rounded" />
                    </div>
                  ))}
                </div>
                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-3 gap-2 overflow-hidden">
                  {itemTypes.slice(0, 6).map((type) => (
                    <div
                      key={type}
                      className="bg-secondary rounded-lg p-3 flex flex-col gap-2 border-t-2"
                      style={{ borderTopColor: ITEM_COLORS[type] }}
                    >
                      <div className="w-3/4 h-2.5 bg-foreground/70 rounded" />
                      <div className="w-full h-1.5 bg-muted-foreground/40 rounded" />
                      <div className="flex gap-1 mt-auto">
                        <div
                          className="w-8 h-3.5 rounded"
                          style={{ background: ITEM_COLORS[type], opacity: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
