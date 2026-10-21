import * as THREE from 'three';

/**
 * Procedural texture generator to ensure zero 404s and photorealistic materials
 */
export class ProceduralTextures {
  /**
   * Generates a high-res realistic coffee bean texture with dark roast tones,
   * subtle surface oil sheen, and the characteristic central curved crevice.
   */
  static createCoffeeBeanTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Deep rich roasted coffee base gradient
    const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
    grad.addColorStop(0, '#4a2c1f');
    grad.addColorStop(0.5, '#2e1810');
    grad.addColorStop(0.85, '#1e0e09');
    grad.addColorStop(1, '#120704');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Add roasted surface grain & micro oil speckles
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 1.8 + 0.2;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(74, 44, 31, 0.25)' : 'rgba(15, 7, 4, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central longitudinal crevice (deep dark groove)
    ctx.strokeStyle = '#0a0402';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(256, 40);
    ctx.bezierCurveTo(242, 160, 270, 320, 256, 472);
    ctx.stroke();

    // Inner darker crack line
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(256, 50);
    ctx.bezierCurveTo(244, 160, 268, 320, 256, 460);
    ctx.stroke();

    // Highlight ridge along the crease edges
    ctx.strokeStyle = 'rgba(198, 138, 82, 0.22)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(264, 60);
    ctx.bezierCurveTo(252, 170, 278, 310, 264, 450);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /**
   * Generates procedural bump map for the coffee bean's crease and roasted skin roughness
   */
  static createCoffeeBeanBumpMap(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    // Deep crevice in bump map (dark = indented)
    ctx.strokeStyle = '#101010';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(128, 20);
    ctx.bezierCurveTo(120, 80, 136, 160, 128, 236);
    ctx.stroke();

    // Roasted micro-bumps
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const val = Math.floor(Math.random() * 60 + 100);
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * Generates the BODRIN Kraft Paper Cup Sleeve Texture with typography,
   * brand logo, Russian text, and barista badge.
   */
  static createCupSleeveTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Textured Kraft paper / Dark Espresso base
    ctx.fillStyle = '#221511';
    ctx.fillRect(0, 0, 1024, 512);

    // Kraft paper fiber lines
    ctx.strokeStyle = 'rgba(74, 48, 38, 0.35)';
    ctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y + (Math.random() * 2 - 1));
      ctx.lineTo(1024, y + (Math.random() * 2 - 1));
      ctx.stroke();
    }

    // Repeating embossed decorative borders
    ctx.strokeStyle = '#C68A52';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 25, 964, 462);

    ctx.strokeStyle = 'rgba(198, 138, 82, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 35, 944, 442);

    // Draw sleeve content on 2 opposite sides (0-512 and 512-1024)
    [256, 768].forEach((centerX) => {
      // Golden Accent Badge
      ctx.fillStyle = '#C68A52';
      ctx.font = '600 14px "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '3px';
      ctx.fillText('SPECIALTY COFFEE • 100% ARABICA', centerX, 110);

      // BODRIN Main Typography
      ctx.fillStyle = '#F3DDC4';
      ctx.font = '900 68px "Unbounded", "Montserrat", sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('BODRIN', centerX, 195);

      // Turquoise geometric accent dot
      ctx.fillStyle = '#78BDB6';
      ctx.beginPath();
      ctx.arc(centerX, 230, 6, 0, Math.PI * 2);
      ctx.fill();

      // Artisan Slogan
      ctx.fillStyle = '#E2B88F';
      ctx.font = '600 16px "Montserrat", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('ARTISAN ROASTERY', centerX, 275);

      // Subtitle
      ctx.fillStyle = 'rgba(243, 221, 196, 0.7)';
      ctx.font = '500 13px "Montserrat", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('EST. 2024 • SPECIALTY COFFEE', centerX, 315);

      // Small stylized cup emblem
      ctx.strokeStyle = '#C68A52';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 24, 350);
      ctx.lineTo(centerX + 24, 350);
      ctx.lineTo(centerX + 18, 385);
      ctx.lineTo(centerX - 18, 385);
      ctx.closePath();
      ctx.stroke();

      // Steam lines
      ctx.beginPath();
      ctx.moveTo(centerX - 8, 342);
      ctx.quadraticCurveTo(centerX - 14, 332, centerX - 8, 324);
      ctx.moveTo(centerX + 8, 342);
      ctx.quadraticCurveTo(centerX + 2, 332, centerX + 8, 324);
      ctx.stroke();

      // Barista signature
      ctx.fillStyle = 'rgba(226, 184, 143, 0.6)';
      ctx.font = 'italic 12px "Montserrat", sans-serif';
      ctx.fillText('Roasted with Passion by BODRIN Baristas', centerX, 420);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /**
   * Generates a foam/latte art texture for the top surface of the cup
   */
  static createLatteArtTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Warm crema background
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 240);
    grad.addColorStop(0, '#d19864');
    grad.addColorStop(0.5, '#995a31');
    grad.addColorStop(0.85, '#5c3218');
    grad.addColorStop(1, '#3b1c0b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Velvety milk foam rosetta pattern in the center
    ctx.fillStyle = '#F3DDC4';
    ctx.strokeStyle = '#F3DDC4';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    // Heart / leaf shapes
    for (let i = 0; i < 7; i++) {
      const y = 140 + i * 36;
      const width = 80 - Math.abs(i - 3) * 12;
      ctx.beginPath();
      ctx.ellipse(256, y, width, 18 - i * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central stem
    ctx.beginPath();
    ctx.moveTo(256, 110);
    ctx.lineTo(256, 400);
    ctx.stroke();

    // Small heart at the top
    ctx.beginPath();
    ctx.arc(248, 115, 14, 0, Math.PI * 2);
    ctx.arc(264, 115, 14, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}
