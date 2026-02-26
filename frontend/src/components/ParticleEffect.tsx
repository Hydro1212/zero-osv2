import { useEffect, useRef } from "react";
import { ParticleIntensity, AccentColor } from "../backend";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  type: "dot" | "orb" | "streak";
  life: number;
  maxLife: number;
}

interface ParticleEffectProps {
  intensity?: ParticleIntensity;
  accentColor?: AccentColor;
}

export default function ParticleEffect({
  intensity = ParticleIntensity.medium,
  accentColor = AccentColor.cyan,
}: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  const maxParticles =
    intensity === ParticleIntensity.off
      ? 0
      : intensity === ParticleIntensity.low
      ? 80
      : intensity === ParticleIntensity.high
      ? 400
      : 200;

  const particleColor =
    accentColor === AccentColor.magenta
      ? { r: 255, g: 0, b: 200 }
      : accentColor === AccentColor.green
      ? { r: 0, g: 255, b: 128 }
      : { r: 0, g: 230, b: 255 };

  useEffect(() => {
    if (intensity === ParticleIntensity.off) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnParticle(): Particle {
      const types: Particle["type"][] = ["dot", "dot", "orb", "streak"];
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        x: Math.random() * (canvas?.width ?? window.innerWidth),
        y: Math.random() * (canvas?.height ?? window.innerHeight),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.2,
        size: type === "orb" ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        type,
        life: 0,
        maxLife: Math.random() * 300 + 100,
      };
    }

    while (particlesRef.current.length < maxParticles) {
      particlesRef.current.push(spawnParticle());
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { r, g, b } = particleColor;

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      while (particlesRef.current.length < maxParticles) {
        particlesRef.current.push(spawnParticle());
      }

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const fadeAlpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1;
        const alpha = p.alpha * fadeAlpha;

        ctx.save();
        if (p.type === "orb") {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "streak") {
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.7})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 12, p.y - p.vy * 12);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      particlesRef.current = [];
    };
  }, [intensity, accentColor]);

  if (intensity === ParticleIntensity.off) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
