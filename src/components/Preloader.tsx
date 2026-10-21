import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { ProceduralTextures } from './3d/ProceduralTextures';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  // Step 1: bean rotating -> Step 2: morphing into logo -> Step 3: caramel light sweep -> Step 4: scale away and complete
  const [phase, setPhase] = useState<'bean' | 'morph' | 'sweep' | 'reveal' | 'done'>('bean');
  const beanCanvasRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(15);

  // 3D Mini Coffee Bean inside the preloader
  useEffect(() => {
    const container = beanCanvasRef.current;
    if (!container) return;

    const width = 180;
    const height = 180;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const light1 = new THREE.DirectionalLight('#FFF3DF', 2.8);
    light1.position.set(2, 3, 2);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight('#C68A52', 1.5);
    light2.position.set(-2, -1, 1);
    scene.add(light2);

    const rimLight = new THREE.DirectionalLight('#78BDB6', 1.8);
    rimLight.position.set(0, -2, -2);
    scene.add(rimLight);

    const beanTexture = ProceduralTextures.createCoffeeBeanTexture();
    const beanBumpMap = ProceduralTextures.createCoffeeBeanBumpMap();

    const beanGeom = new THREE.SphereGeometry(0.55, 32, 32);
    beanGeom.scale(1.25, 0.78, 0.82);

    const beanMat = new THREE.MeshStandardMaterial({
      map: beanTexture,
      bumpMap: beanBumpMap,
      bumpScale: 0.08,
      roughness: 0.32,
      metalness: 0.15,
    });

    const beanMesh = new THREE.Mesh(beanGeom, beanMat);
    scene.add(beanMesh);

    let frameId: number;
    let time = 0;
    const render = () => {
      frameId = requestAnimationFrame(render);
      time += 0.02;
      beanMesh.rotation.y = time * 2.2;
      beanMesh.rotation.x = Math.sin(time) * 0.4;
      beanMesh.rotation.z = Math.cos(time * 0.8) * 0.2;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Timeline orchestration (~2.4s total)
  useEffect(() => {
    // Phase 1: Bean rotates (0 - 900ms)
    const tProgress1 = setTimeout(() => setProgress(45), 300);
    const tProgress2 = setTimeout(() => setProgress(85), 700);

    // Phase 2: Bean morphs into logo (900ms - 1500ms)
    const tMorph = setTimeout(() => {
      setPhase('morph');
      setProgress(100);
    }, 950);

    // Phase 3: Caramel light sweep (1500ms - 2100ms)
    const tSweep = setTimeout(() => {
      setPhase('sweep');
    }, 1550);

    // Phase 4: Scale away / reveal hero (2100ms - 2500ms)
    const tReveal = setTimeout(() => {
      setPhase('reveal');
    }, 2150);

    // Phase 5: Complete
    const tDone = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(tProgress1);
      clearTimeout(tProgress2);
      clearTimeout(tMorph);
      clearTimeout(tSweep);
      clearTimeout(tReveal);
      clearTimeout(tDone);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#160D0B] transition-all duration-700 ease-out select-none ${
        phase === 'reveal' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(198,138,82,0.12)_0%,_rgba(22,13,11,1)_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Phase 1 & 2: 3D Coffee Bean with smooth morph transition */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            phase === 'bean'
              ? 'opacity-100 scale-100 blur-0'
              : 'opacity-0 scale-75 blur-sm absolute pointer-events-none'
          }`}
        >
          <div ref={beanCanvasRef} className="w-[180px] h-[180px] flex items-center justify-center" />
          <p className="text-center text-xs tracking-[0.25em] text-[#C68A52]/80 mt-2 font-medium">
            در حال برشته‌کاری دانه‌های قهوه...
          </p>
        </div>

        {/* Phase 2, 3, 4: BODRIN Logo with caramel sweep effect */}
        <div
          className={`relative transition-all duration-700 ease-out flex flex-col items-center ${
            phase !== 'bean'
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-125 translate-y-4 pointer-events-none'
          }`}
        >
          {/* BODRIN Typography */}
          <div className="relative overflow-hidden px-8 py-3">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-[0.2em] text-[#F3DDC4] font-display">
              BODRIN
            </h1>

            {/* Caramel Light Sweep Ribbon */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#C68A52]/90 to-transparent skew-x-[-25deg] transition-transform duration-1000 ease-in-out pointer-events-none ${
                phase === 'sweep' || phase === 'reveal' ? 'translate-x-[200%]' : '-translate-x-[200%]'
              }`}
            />
          </div>

          {/* Subtitle slogan */}
          <div className="flex items-center gap-3 mt-3">
            <span className="w-8 h-[1px] bg-[#C68A52]/40" />
            <p className="text-sm md:text-base tracking-[0.25em] text-[#E2B88F] font-semibold">
              هنر بیداری و طراوت در هر قطره
            </p>
            <span className="w-8 h-[1px] bg-[#C68A52]/40" />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs tracking-wider text-[#78BDB6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#78BDB6]"></span>
            <span>تجربه سینمایی و سه‌بعدی قهوه تخصصی</span>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-48 h-[2px] bg-[#3C2922] rounded-full mt-10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C68A52] to-[#78BDB6] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lightweight fallback Skip Button */}
      <button
        onClick={() => {
          setPhase('reveal');
          setTimeout(onComplete, 400);
        }}
        className="absolute bottom-8 text-xs tracking-wider text-[#E2B88F]/60 hover:text-[#78BDB6] transition-colors py-2 px-4 rounded-full border border-transparent hover:border-[#78BDB6]/30 cursor-pointer font-medium"
      >
        رد کردن پیش‌نمایش ✕
      </button>
    </div>
  );
};
