import React, { useEffect, useRef } from 'react';

interface SmokeDividerProps {
  className?: string;
  intensity?: number;
}

export const CoffeeSmokeDivider: React.FC<SmokeDividerProps> = ({ className = '', intensity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 140);

    // Particle definition for flowing coffee steam / aroma curls
    const particleCount = Math.floor(28 * intensity);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 20,
      radius: 18 + Math.random() * 32,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -(0.35 + Math.random() * 0.45),
      alpha: 0,
      maxAlpha: 0.05 + Math.random() * 0.08,
      growSpeed: 0.15 + Math.random() * 0.2,
      life: 0,
      maxLife: 160 + Math.random() * 120,
      color: Math.random() > 0.4 ? '198, 138, 82' : '226, 184, 143', // Caramel and warm cream
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.03) * 0.3;
        p.y += p.vy;
        p.radius += p.growSpeed;

        // Fade in then fade out smoothly
        const progress = p.life / p.maxLife;
        if (progress < 0.3) {
          p.alpha = (progress / 0.3) * p.maxAlpha;
        } else {
          p.alpha = (1 - progress) * p.maxAlpha;
        }

        if (p.life >= p.maxLife || p.y < -p.radius) {
          // Reset particle
          p.life = 0;
          p.x = Math.random() * width;
          p.y = height + 10;
          p.radius = 16 + Math.random() * 28;
          p.alpha = 0;
        }

        // Render soft radial smoke puff
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        grad.addColorStop(0.6, `rgba(${p.color}, ${p.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(22, 13, 11, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 140;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <div className={`relative w-full h-28 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Central elegant divider line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C68A52]/25 to-transparent" />

      {/* Center coffee emblem icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-[#160D0B] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#78BDB6]" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C68A52]/80 font-bold">
          BODRIN COFFEE
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#78BDB6]" />
      </div>

      {/* Flowing steam particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
