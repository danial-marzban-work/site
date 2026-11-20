import * as THREE from "three";

/**
 * Latte art is drawn procedurally on a canvas so the mug needs no extra asset:
 * a crema base with a rosetta (leaf stack + heart) poured in steamed milk.
 */
export function createLatteArtTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const crema = ctx.createRadialGradient(
    size * 0.46,
    size * 0.42,
    size * 0.04,
    size * 0.5,
    size * 0.5,
    size * 0.52,
  );
  crema.addColorStop(0, "#d9ab7b");
  crema.addColorStop(0.5, "#bb8257");
  crema.addColorStop(1, "#8c5433");
  ctx.fillStyle = crema;
  ctx.fillRect(0, 0, size, size);

  // Fine crema mottling.
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2.2 + 0.4;
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "255,232,206" : "120,72,42"},${Math.random() * 0.07})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(size / 2, size * 0.55);
  ctx.fillStyle = "#f9f1e6";

  // Stem of the rosetta.
  ctx.beginPath();
  ctx.moveTo(-9, 150);
  ctx.quadraticCurveTo(-4, 20, -14, -110);
  ctx.lineTo(14, -110);
  ctx.quadraticCurveTo(4, 20, 9, 150);
  ctx.closePath();
  ctx.fill();

  // Leaf stack, widening toward the bottom of the pour.
  for (let i = 0; i < 6; i++) {
    const y = 132 - i * 36;
    const rx = 54 + i * 16;
    ctx.beginPath();
    ctx.ellipse(0, y, rx, 17, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Crema lines separating the leaves.
  ctx.strokeStyle = "rgba(126,74,42,0.55)";
  ctx.lineWidth = 3.4;
  for (let i = 0; i < 6; i++) {
    const y = 132 - i * 36;
    const rx = 54 + i * 16;
    ctx.beginPath();
    ctx.ellipse(0, y + 15, rx * 0.9, 10, 0, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }

  // Heart at the tip.
  const hy = -122;
  ctx.beginPath();
  ctx.moveTo(0, hy + 62);
  ctx.bezierCurveTo(-74, hy - 2, -56, hy - 74, 0, hy - 26);
  ctx.bezierCurveTo(56, hy - 74, 74, hy - 2, 0, hy + 62);
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Soft radial falloff used for the golden glow and for steam puffs. */
export function createSoftGlowTexture(size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
