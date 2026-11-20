import { useMemo } from "react";
import * as THREE from "three";
import { createSoftGlowTexture } from "./textures";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uGlow;

  void main() {
    vec3 col = mix(uBottom, uTop, smoothstep(0.02, 0.95, vUv.y));

    // Soft golden light pooling behind the mug.
    float glow = 1.0 - smoothstep(0.0, 0.78, distance(vUv, vec2(0.56, 0.6)));
    col += uGlow * glow * 0.2;

    // Gentle vignette keeps the eye on the centre.
    float vignette = smoothstep(1.12, 0.3, distance(vUv, vec2(0.5, 0.5)));
    col *= mix(0.74, 1.0, vignette);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Warm caramel-beige gradient shell that fills the canvas behind the scene. */
export function Backdrop() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#eddcc6") },
      uBottom: { value: new THREE.Color("#b48963") },
      uGlow: { value: new THREE.Color("#ffd6a6") },
    }),
    [],
  );

  return (
    <mesh scale={60} renderOrder={-1}>
      <sphereGeometry args={[1, 48, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Additive golden halo sitting just behind the mug. */
export function GoldenGlow() {
  const texture = useMemo(() => createSoftGlowTexture(), []);

  return (
    <sprite position={[0, 0.15, -2.6]} scale={[7.5, 7.5, 1]} renderOrder={-1}>
      <spriteMaterial
        map={texture}
        color="#ffc98a"
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}
