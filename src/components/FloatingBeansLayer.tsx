import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BeanConfig {
  id: string;
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotation: number;
  depth: 'foreground' | 'midground' | 'background';
  speed: number;
  rotSpeed: number;
  blur?: number;
  opacity: number;
}

export const FloatingBeansLayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Strategic positions across Hero, Menu, About, Reviews, and Quiz sections
  const beans: BeanConfig[] = [
    // Hero & Transition
    {
      id: 'bean-hero-1',
      top: '12%',
      left: '4%',
      size: 42,
      rotation: 25,
      depth: 'midground',
      speed: 140,
      rotSpeed: 45,
      opacity: 0.85,
    },
    {
      id: 'bean-hero-2',
      top: '28%',
      left: '42%',
      size: 26,
      rotation: -40,
      depth: 'background',
      speed: 80,
      rotSpeed: -30,
      opacity: 0.55,
      blur: 1.5,
    },
    {
      id: 'bean-hero-3',
      top: '55%',
      right: '6%',
      size: 58,
      rotation: 65,
      depth: 'foreground',
      speed: 260,
      rotSpeed: 70,
      opacity: 0.9,
      blur: 0.8,
    },
    {
      id: 'bean-hero-4',
      top: '75%',
      left: '8%',
      size: 34,
      rotation: -15,
      depth: 'midground',
      speed: 150,
      rotSpeed: -40,
      opacity: 0.75,
    },

    // Menu / Product Showcase
    {
      id: 'bean-menu-1',
      top: '115%',
      right: '4%',
      size: 64,
      rotation: 80,
      depth: 'foreground',
      speed: 280,
      rotSpeed: 85,
      opacity: 0.9,
      blur: 1.2,
    },
    {
      id: 'bean-menu-2',
      top: '135%',
      left: '2%',
      size: 38,
      rotation: -55,
      depth: 'midground',
      speed: 160,
      rotSpeed: -50,
      opacity: 0.75,
    },
    {
      id: 'bean-menu-3',
      top: '160%',
      right: '44%',
      size: 24,
      rotation: 30,
      depth: 'background',
      speed: 90,
      rotSpeed: 25,
      opacity: 0.5,
      blur: 2,
    },
    {
      id: 'bean-menu-4',
      top: '185%',
      left: '6%',
      size: 46,
      rotation: 110,
      depth: 'midground',
      speed: 170,
      rotSpeed: -60,
      opacity: 0.8,
    },

    // About BODRIN Section
    {
      id: 'bean-about-1',
      top: '215%',
      right: '5%',
      size: 52,
      rotation: -35,
      depth: 'foreground',
      speed: 240,
      rotSpeed: 65,
      opacity: 0.85,
    },
    {
      id: 'bean-about-2',
      top: '240%',
      left: '3%',
      size: 30,
      rotation: 45,
      depth: 'background',
      speed: 85,
      rotSpeed: -20,
      opacity: 0.6,
      blur: 1.5,
    },
    {
      id: 'bean-about-3',
      top: '275%',
      right: '12%',
      size: 40,
      rotation: -70,
      depth: 'midground',
      speed: 155,
      rotSpeed: 40,
      opacity: 0.75,
    },

    // Reviews & Quiz Section
    {
      id: 'bean-reviews-1',
      top: '310%',
      left: '5%',
      size: 56,
      rotation: 15,
      depth: 'foreground',
      speed: 270,
      rotSpeed: -80,
      opacity: 0.9,
      blur: 1,
    },
    {
      id: 'bean-reviews-2',
      top: '345%',
      right: '3%',
      size: 32,
      rotation: 95,
      depth: 'midground',
      speed: 140,
      rotSpeed: 45,
      opacity: 0.7,
    },
    {
      id: 'bean-quiz-1',
      top: '385%',
      left: '7%',
      size: 48,
      rotation: -45,
      depth: 'midground',
      speed: 180,
      rotSpeed: -55,
      opacity: 0.8,
    },
    {
      id: 'bean-quiz-2',
      top: '415%',
      right: '6%',
      size: 60,
      rotation: 50,
      depth: 'foreground',
      speed: 260,
      rotSpeed: 75,
      opacity: 0.85,
      blur: 1.2,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      beans.forEach((bean) => {
        const el = document.getElementById(bean.id);
        if (!el) return;

        // 1. GSAP ScrollTrigger: Scrub Parallax translation & rotation
        gsap.to(el, {
          y: -bean.speed,
          rotation: bean.rotation + bean.rotSpeed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        // 2. Continuous ambient floating motion (sine wave levitation)
        gsap.to(el, {
          y: '+=14',
          x: '+=6',
          rotation: '+=8',
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {beans.map((bean) => (
        <div
          key={bean.id}
          id={bean.id}
          className="absolute transform-gpu"
          style={{
            top: bean.top,
            left: bean.left,
            right: bean.right,
            width: `${bean.size}px`,
            height: `${bean.size * 1.35}px`,
            opacity: bean.opacity,
            filter: bean.blur ? `blur(${bean.blur}px)` : undefined,
            willChange: 'transform',
          }}
        >
          {/* Detailed Photorealistic Roasted Coffee Bean SVG with crease and caramel highlights */}
          <svg
            viewBox="0 0 100 135"
            className="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]"
            style={{
              transform: `rotate(${bean.rotation}deg)`,
            }}
          >
            <defs>
              {/* Coffee bean roasted gradient */}
              <linearGradient id={`bean-grad-${bean.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4D2E21" />
                <stop offset="35%" stopColor="#321A12" />
                <stop offset="75%" stopColor="#22110B" />
                <stop offset="100%" stopColor="#140805" />
              </linearGradient>

              {/* Surface highlight reflection */}
              <linearGradient id={`bean-highlight-${bean.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(198,138,82,0.4)" />
                <stop offset="60%" stopColor="rgba(198,138,82,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>

              {/* Crevice deep shadow */}
              <linearGradient id={`crevice-grad-${bean.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0B0402" />
                <stop offset="50%" stopColor="#050201" />
                <stop offset="100%" stopColor="#0B0402" />
              </linearGradient>
            </defs>

            {/* Main Outer Bean Body */}
            <path
              d="M50 4 C76 4, 94 28, 94 67 C94 106, 76 131, 50 131 C24 131, 6 106, 6 67 C6 28, 24 4, 50 4 Z"
              fill={`url(#bean-grad-${bean.id})`}
              stroke="rgba(198,138,82,0.2)"
              strokeWidth="1.2"
            />

            {/* Specular curved reflection on left lobe */}
            <path
              d="M26 18 C36 12, 46 15, 34 50 C24 80, 20 100, 30 115 C20 105, 14 85, 14 67 C14 42, 19 26, 26 18 Z"
              fill={`url(#bean-highlight-${bean.id})`}
            />

            {/* Deep characteristic S-curve longitudinal crevice */}
            <path
              d="M50 12 C44 38, 56 64, 46 95 C42 108, 48 118, 50 124"
              stroke={`url(#crevice-grad-${bean.id})`}
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Inner ultra-dark furrow fissure */}
            <path
              d="M50 15 C45 38, 55 64, 47 95 C44 107, 49 116, 50 121"
              stroke="#000000"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Golden caramel rim highlight along the crevice lip */}
            <path
              d="M53 16 C57 39, 47 65, 53 96 C55 106, 52 115, 52 119"
              stroke="rgba(198, 138, 82, 0.28)"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
