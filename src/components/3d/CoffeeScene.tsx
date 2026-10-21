import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ProceduralTextures } from './ProceduralTextures';

interface CoffeeSceneProps {
  scrollProgress?: number;
  activeDrink?: 'cappuccino' | 'latte' | 'mocha';
  className?: string;
  isInteractive?: boolean;
}

export const CoffeeScene: React.FC<CoffeeSceneProps> = ({
  scrollProgress = 0,
  activeDrink = 'latte',
  className = '',
  isInteractive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // References for render loop state
  const stateRef = useRef({
    scrollProgress: 0,
    activeDrink: 'latte',
    pointerX: 0,
    pointerY: 0,
    targetRotationX: 0.15,
    targetRotationY: -0.3,
    currentRotationX: 0.15,
    currentRotationY: -0.3,
    dragStartX: 0,
    dragStartY: 0,
    isPointerDown: false,
    manualRotationY: 0,
    manualRotationX: 0,
  });

  // Keep stateRef synced with props
  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.activeDrink = activeDrink;
  }, [scrollProgress, activeDrink]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#160D0B', 0.045);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- PMREM STUDIO ENVIRONMENT ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // --- LIGHTING RIG ---
    // Key warm directional light
    const keyLight = new THREE.DirectionalLight('#FFF2DD', 3.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Warm fill light
    const fillLight = new THREE.DirectionalLight('#C68A52', 1.8);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    // Turquoise / Cool Rim light for award-winning studio edge sheen
    const rimLight = new THREE.DirectionalLight('#78BDB6', 2.2);
    rimLight.position.set(-3, 4, -4);
    scene.add(rimLight);

    // Ambient Hemisphere Light
    const hemiLight = new THREE.HemisphereLight('#E2B88F', '#1E120D', 0.85);
    scene.add(hemiLight);

    // --- PROCEDURAL TEXTURES ---
    const sleeveTexture = ProceduralTextures.createCupSleeveTexture();
    const latteArtTexture = ProceduralTextures.createLatteArtTexture();
    const beanTexture = ProceduralTextures.createCoffeeBeanTexture();
    const beanBumpMap = ProceduralTextures.createCoffeeBeanBumpMap();

    // --- 3D HERO CUP GROUP (Composed of 8 detailed procedural parts) ---
    const heroCupGroup = new THREE.Group();
    heroCupGroup.position.set(1.15, -0.2, 0);

    // 1. Main Tapered Cup Body
    const cupHeight = 2.4;
    const cupTopRadius = 0.88;
    const cupBottomRadius = 0.64;
    const cupBodyGeom = new THREE.CylinderGeometry(cupTopRadius, cupBottomRadius, cupHeight, 48, 1, true);
    
    // Luxury dark espresso ceramic/matte paper material
    const cupBodyMat = new THREE.MeshPhysicalMaterial({
      color: '#241713',
      roughness: 0.35,
      metalness: 0.08,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
    });
    const cupBodyMesh = new THREE.Mesh(cupBodyGeom, cupBodyMat);
    cupBodyMesh.castShadow = true;
    cupBodyMesh.receiveShadow = true;
    heroCupGroup.add(cupBodyMesh);

    // 2. Cup Bottom Base Cap
    const cupBaseGeom = new THREE.CircleGeometry(cupBottomRadius, 36);
    const cupBaseMat = new THREE.MeshStandardMaterial({ color: '#1B110D', roughness: 0.7 });
    const cupBaseMesh = new THREE.Mesh(cupBaseGeom, cupBaseMat);
    cupBaseMesh.rotation.x = Math.PI / 2;
    cupBaseMesh.position.y = -cupHeight / 2;
    heroCupGroup.add(cupBaseMesh);

    // 3. BODRIN Kraft Paper Sleeve (Wrapped around the midsection)
    const sleeveHeight = 1.05;
    const sleeveTopRadius = 0.81;
    const sleeveBottomRadius = 0.71;
    const sleeveGeom = new THREE.CylinderGeometry(
      sleeveTopRadius,
      sleeveBottomRadius,
      sleeveHeight,
      48,
      1,
      true
    );
    const sleeveMat = new THREE.MeshStandardMaterial({
      map: sleeveTexture,
      roughness: 0.65,
      metalness: 0.05,
      bumpScale: 0.04,
    });
    sleeveTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const sleeveMesh = new THREE.Mesh(sleeveGeom, sleeveMat);
    sleeveMesh.position.y = -0.05;
    sleeveMesh.castShadow = true;
    heroCupGroup.add(sleeveMesh);

    // 4. Snap-on Barista Takeaway Lid (Lathe / Multi-step geometry)
    const lidGroup = new THREE.Group();
    lidGroup.position.y = cupHeight / 2;

    // Rim of lid
    const lidRimGeom = new THREE.TorusGeometry(cupTopRadius + 0.025, 0.045, 16, 48);
    const lidMat = new THREE.MeshPhysicalMaterial({
      color: '#1A100C',
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.15,
    });
    const lidRim = new THREE.Mesh(lidRimGeom, lidMat);
    lidRim.rotation.x = Math.PI / 2;
    lidGroup.add(lidRim);

    // Upper dome lid ring
    const lidCapGeom = new THREE.CylinderGeometry(cupTopRadius - 0.02, cupTopRadius + 0.02, 0.16, 48);
    const lidCap = new THREE.Mesh(lidCapGeom, lidMat);
    lidCap.position.y = 0.08;
    lidCap.castShadow = true;
    lidGroup.add(lidCap);

    // Raised sipping hole / spout
    const spoutGeom = new THREE.BoxGeometry(0.28, 0.06, 0.15);
    const spout = new THREE.Mesh(spoutGeom, lidMat);
    spout.position.set(0, 0.18, cupTopRadius - 0.22);
    spout.rotation.x = -0.15;
    lidGroup.add(spout);

    // Siphon hole indentation
    const holeGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16);
    const holeMat = new THREE.MeshBasicMaterial({ color: '#090503' });
    const hole = new THREE.Mesh(holeGeom, holeMat);
    hole.position.set(0, 0.19, cupTopRadius - 0.22);
    lidGroup.add(hole);

    heroCupGroup.add(lidGroup);

    // 5. Liquid surface inside (Visible when viewed from slight top angle)
    const liquidGeom = new THREE.CircleGeometry(cupTopRadius - 0.04, 36);
    const liquidMat = new THREE.MeshStandardMaterial({
      map: latteArtTexture,
      roughness: 0.2,
      metalness: 0.05,
    });
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
    liquidMesh.rotation.x = -Math.PI / 2;
    liquidMesh.position.y = cupHeight / 2 - 0.08;
    heroCupGroup.add(liquidMesh);

    // 6. Grounding Contact Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0,0,0,0.7)');
      grad.addColorStop(0.5, 'rgba(10,5,3,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.4),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -cupHeight / 2 - 0.05;
    heroCupGroup.add(shadowPlane);

    scene.add(heroCupGroup);

    // --- SECONDARY ESPRESSO CUP (From reference, angled behind the main cup) ---
    const espressoGroup = new THREE.Group();
    espressoGroup.position.set(2.4, -0.65, -0.9);
    espressoGroup.scale.set(0.68, 0.68, 0.68);
    espressoGroup.rotation.set(0.2, -0.7, 0.15);

    const espressoGeom = new THREE.CylinderGeometry(0.85, 0.58, 1.8, 36);
    const espressoMat = new THREE.MeshStandardMaterial({
      color: '#3C2922',
      roughness: 0.4,
      metalness: 0.1,
    });
    const espressoMesh = new THREE.Mesh(espressoGeom, espressoMat);
    espressoMesh.castShadow = true;
    espressoGroup.add(espressoMesh);

    // Kraft sleeve on secondary cup
    const espressoSleeveGeom = new THREE.CylinderGeometry(0.78, 0.66, 0.85, 36);
    const espressoSleeveMesh = new THREE.Mesh(espressoSleeveGeom, sleeveMat);
    espressoGroup.add(espressoSleeveMesh);

    scene.add(espressoGroup);

    // --- SPECTACULAR CARAMEL COFFEE SPLASH ---
    // Composed of flowing spiral curves, amber liquid splashes, and droplet spheres
    const splashGroup = new THREE.Group();
    splashGroup.position.set(1.2, -0.1, 0.1);

    // Translucent golden-amber liquid material
    const splashMaterial = new THREE.MeshPhysicalMaterial({
      color: '#D48B4B',
      emissive: '#421E0B',
      emissiveIntensity: 0.35,
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.72,
      thickness: 1.2,
      ior: 1.45,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    // Splashing arch curve 1 (Wraps dynamically around the right side of the cup)
    const curvePoints1 = [
      new THREE.Vector3(-0.9, -1.2, 0.4),
      new THREE.Vector3(0.3, -0.6, 0.8),
      new THREE.Vector3(1.3, 0.2, 0.6),
      new THREE.Vector3(1.5, 1.2, 0.1),
      new THREE.Vector3(1.0, 1.8, -0.4),
      new THREE.Vector3(0.2, 2.2, -0.2),
    ];
    const splashCurve1 = new THREE.CatmullRomCurve3(curvePoints1);
    const splashGeom1 = new THREE.TubeGeometry(splashCurve1, 48, 0.16, 12, false);
    const splashMesh1 = new THREE.Mesh(splashGeom1, splashMaterial);
    splashGroup.add(splashMesh1);

    // Splashing arch curve 2 (Dynamic curl whipping upwards)
    const curvePoints2 = [
      new THREE.Vector3(0.1, -0.9, -0.4),
      new THREE.Vector3(1.1, -0.2, -0.3),
      new THREE.Vector3(1.6, 0.7, 0.3),
      new THREE.Vector3(1.3, 1.5, 0.5),
      new THREE.Vector3(0.5, 1.9, 0.2),
    ];
    const splashCurve2 = new THREE.CatmullRomCurve3(curvePoints2);
    const splashGeom2 = new THREE.TubeGeometry(splashCurve2, 40, 0.11, 10, false);
    const splashMesh2 = new THREE.Mesh(splashGeom2, splashMaterial);
    splashGroup.add(splashMesh2);

    // Dynamic suspended liquid droplets at varied radii and heights
    const dropletGroup = new THREE.Group();
    const dropletGeom = new THREE.SphereGeometry(1, 16, 16);
    const dropletCount = 28;
    const droplets: { mesh: THREE.Mesh; seed: number; baseY: number; radius: number }[] = [];

    for (let i = 0; i < dropletCount; i++) {
      const scale = 0.03 + Math.random() * 0.08;
      const mesh = new THREE.Mesh(dropletGeom, splashMaterial);
      mesh.scale.set(scale, scale * (1 + Math.random() * 0.5), scale);
      
      const angle = (i / dropletCount) * Math.PI * 1.8 + Math.random() * 0.4;
      const radius = 1.1 + Math.random() * 0.9;
      const y = -0.9 + Math.random() * 2.8;

      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.6);
      dropletGroup.add(mesh);
      droplets.push({ mesh, seed: Math.random() * 10, baseY: y, radius });
    }
    splashGroup.add(dropletGroup);
    scene.add(splashGroup);

    // --- PROCEDURAL FLOATING COFFEE BEANS ---
    // Realistic bean shape: slightly flattened sphere with central indent crease
    const beanShapeGeom = new THREE.SphereGeometry(0.18, 20, 20);
    beanShapeGeom.scale(1.2, 0.75, 0.85);

    const beanMat = new THREE.MeshStandardMaterial({
      map: beanTexture,
      bumpMap: beanBumpMap,
      bumpScale: 0.08,
      roughness: 0.38,
      metalness: 0.12,
    });

    const beanCount = 14;
    const beans: {
      mesh: THREE.Mesh;
      initialPos: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      floatSpeed: number;
      floatAmplitude: number;
      depthFactor: number;
      phase: number;
    }[] = [];

    const beanPositions = [
      [-2.4, 1.4, 0.8],
      [-2.0, -1.2, 1.2],
      [-1.5, 2.1, -0.4],
      [-1.1, -1.8, 0.5],
      [0.2, 2.5, 0.9],
      [0.6, -1.6, 1.4],
      [2.7, 1.6, 0.6],
      [2.9, -0.2, 1.1],
      [2.2, -1.8, -0.2],
      [3.1, 2.2, -0.6],
      [-3.0, 0.2, -1.0],
      [1.8, 2.4, -0.8],
      [-0.4, -2.2, 0.3],
      [2.1, 0.9, 1.6],
    ];

    beanPositions.forEach((pos, idx) => {
      const mesh = new THREE.Mesh(beanShapeGeom, beanMat);
      mesh.castShadow = true;
      const scale = 0.85 + Math.random() * 0.5;
      mesh.scale.set(scale, scale, scale);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);

      beans.push({
        mesh,
        initialPos: new THREE.Vector3(pos[0], pos[1], pos[2]),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 0.6
        ),
        floatSpeed: 0.8 + Math.random() * 0.8,
        floatAmplitude: 0.12 + Math.random() * 0.12,
        depthFactor: (pos[2] + 2) / 4,
        phase: Math.random() * Math.PI * 2,
      });
    });

    // Notify parent component that initial 3D load is ready
    setIsLoaded(true);

    // --- POINTER / TOUCH INTERACTION LISTENERS ---
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      stateRef.current.pointerX = x;
      stateRef.current.pointerY = y;

      if (stateRef.current.isPointerDown) {
        const deltaX = e.clientX - stateRef.current.dragStartX;
        const deltaY = e.clientY - stateRef.current.dragStartY;
        stateRef.current.manualRotationY += deltaX * 0.005;
        stateRef.current.manualRotationX += deltaY * 0.005;
        stateRef.current.dragStartX = e.clientX;
        stateRef.current.dragStartY = e.clientY;
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (!isInteractive) return;
      stateRef.current.isPointerDown = true;
      stateRef.current.dragStartX = e.clientX;
      stateRef.current.dragStartY = e.clientY;
      setIsDragging(true);
    };

    const handlePointerUp = () => {
      stateRef.current.isPointerDown = false;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerdown', handlePointerDown);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let animFrameId: number;

    const render = () => {
      animFrameId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const state = stateRef.current;

      // 1. Natural Sine Wave Floating Motion for the Hero Cup
      const floatY = Math.sin(elapsed * 1.4) * 0.075;
      const floatRotZ = Math.cos(elapsed * 1.1) * 0.025;

      // 2. Smooth Pointer Parallax and User Drag Rotation with Exponential Damping
      const targetRotY = -0.3 + state.pointerX * 0.35 + state.manualRotationY;
      const targetRotX = 0.12 - state.pointerY * 0.2 + state.manualRotationX;

      state.currentRotationY = THREE.MathUtils.damp(state.currentRotationY, targetRotY, 5, delta);
      state.currentRotationX = THREE.MathUtils.damp(state.currentRotationX, targetRotX, 5, delta);

      // Damp manual drag back towards neutral slowly when released
      if (!state.isPointerDown) {
        state.manualRotationX = THREE.MathUtils.damp(state.manualRotationX, 0, 2.5, delta);
        state.manualRotationY = THREE.MathUtils.damp(state.manualRotationY, 0, 1.5, delta);
      }

      // 3. Scroll-Linked Transformation:
      // When scrolling down, cup shifts gracefully toward center/left and rotates
      const sp = state.scrollProgress;
      const targetCupX = 1.15 - sp * 1.4;
      const targetCupY = -0.2 + floatY - sp * 0.3;
      const targetCupZ = sp * 0.4;

      heroCupGroup.position.x = THREE.MathUtils.damp(heroCupGroup.position.x, targetCupX, 4, delta);
      heroCupGroup.position.y = THREE.MathUtils.damp(heroCupGroup.position.y, targetCupY, 4, delta);
      heroCupGroup.position.z = THREE.MathUtils.damp(heroCupGroup.position.z, targetCupZ, 4, delta);

      heroCupGroup.rotation.y = state.currentRotationY + sp * 1.2;
      heroCupGroup.rotation.x = state.currentRotationX;
      heroCupGroup.rotation.z = floatRotZ;

      // Secondary cup moves with slight parallax
      espressoGroup.position.y = -0.65 + Math.sin(elapsed * 1.2 + 1) * 0.05 - sp * 0.5;
      espressoGroup.rotation.y = -0.7 + Math.sin(elapsed * 0.8) * 0.06;

      // 4. Splash wave pulsing and liquid ripple
      splashGroup.position.x = heroCupGroup.position.x + 0.05;
      splashGroup.position.y = heroCupGroup.position.y + 0.1;
      splashGroup.rotation.y = heroCupGroup.rotation.y * 0.75;
      splashGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.03;

      droplets.forEach((d) => {
        d.mesh.position.y = d.baseY + Math.sin(elapsed * 2.2 + d.seed) * 0.08;
        d.mesh.rotation.x += delta * 1.5;
        d.mesh.rotation.y += delta * 2.0;
      });

      // 5. Floating Coffee Beans 3D Trajectories & Parallax
      beans.forEach((b) => {
        b.mesh.rotation.x += b.rotSpeed.x * delta;
        b.mesh.rotation.y += b.rotSpeed.y * delta;
        b.mesh.rotation.z += b.rotSpeed.z * delta;

        // Sine wave levitation
        const wave = Math.sin(elapsed * b.floatSpeed + b.phase) * b.floatAmplitude;
        // Pointer parallax scaled by depth
        const px = state.pointerX * b.depthFactor * 0.4;
        const py = state.pointerY * b.depthFactor * 0.4;
        // Scroll displacement
        const sy = sp * (1.5 + b.depthFactor);

        b.mesh.position.x = b.initialPos.x + px;
        b.mesh.position.y = b.initialPos.y + wave + py - sy;
        b.mesh.position.z = b.initialPos.z;
      });

      renderer.render(scene, camera);
    };

    render();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;

      // Adjust camera distance for mobile screens
      if (w < 768) {
        camera.position.z = 7.8;
        camera.position.y = 0.2;
        heroCupGroup.scale.set(0.82, 0.82, 0.82);
      } else {
        camera.position.z = 6.2;
        camera.position.y = 0.5;
        heroCupGroup.scale.set(1, 1, 1);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isInteractive]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full select-none cursor-grab active:cursor-grabbing ${className}`}
      title="برای چرخش سه‌بعدی فنجان بودرین کلیک کنید و بکشید"
    >
      {/* 3D Interaction Badge */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B1B16]/85 border border-[#C68A52]/30 text-xs text-[#E2B88F] backdrop-blur-md shadow-lg" dir="rtl">
        <span className="w-2 h-2 rounded-full bg-[#78BDB6] inline-block animate-pulse"></span>
        <span>{isDragging ? 'در حال چرخش سه‌بعدی فنجان...' : 'برای چرخش سه‌بعدی کلیک کنید و بکشید'}</span>
      </div>
    </div>
  );
};
