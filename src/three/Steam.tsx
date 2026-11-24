import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createSoftGlowTexture } from "./textures";

/**
 * Steam above the latte. One draw call of soft billboarded points: each puff
 * rises, drifts sideways and fades in/out over its own life cycle.
 */
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  uniform float uHeight;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uHeight / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float a = texture2D(uMap, gl_PointCoord).a * vAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

const BASE_Y = 0.92;
const RISE = 1.25;

export function Steam({ compact, reduced }: { compact: boolean; reduced: boolean }) {
  const count = compact ? 12 : 26;
  const texture = useMemo(() => createSoftGlowTexture(128), []);
  const { size, gl } = useThree();

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uColor: { value: new THREE.Color("#fff6ea") },
      uHeight: { value: 800 },
    }),
    [texture],
  );

  const { geometry, seeds } = useMemo(() => {
    const seeds = Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + Math.random() * 0.7,
      radius: 0.35 + Math.random() * 0.65,
      speed: 0.15 + Math.random() * 0.13,
      phase: Math.random(),
      wobble: 0.6 + Math.random() * 0.9,
    }));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(count), 1));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(count), 1));

    return { geometry, seeds };
  }, [count]);

  useFrame((state) => {
    uniforms.uHeight.value = size.height * gl.getPixelRatio();
    const t = reduced ? 0 : state.clock.elapsedTime;

    const position = geometry.attributes.position as THREE.BufferAttribute;
    const puffSize = geometry.attributes.aSize as THREE.BufferAttribute;
    const alpha = geometry.attributes.aAlpha as THREE.BufferAttribute;

    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      const life = (t * seed.speed + seed.phase) % 1;
      const spread = 0.12 + life * 0.42;
      const swirl = seed.angle + life * 1.5 * seed.wobble;

      position.setXYZ(
        i,
        Math.cos(swirl) * spread * seed.radius,
        BASE_Y + life * RISE,
        Math.sin(swirl) * spread * seed.radius * 0.7 + 0.08,
      );
      puffSize.setX(i, 0.3 + life * 0.85);
      alpha.setX(i, Math.sin(life * Math.PI) * 0.3 * seed.wobble * 0.8);
    }

    position.needsUpdate = true;
    puffSize.needsUpdate = true;
    alpha.needsUpdate = true;
  });

  return (
    <points geometry={geometry} renderOrder={2} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
