import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIntroFade } from "./useIntroFade";

/**
 * Golden-caramel ribbon twisting around the mug: one tapered, twisting band that
 * spirals from below the glass to above the rim and turns slowly on its own.
 */
const SEGMENTS = 220;
const TURNS = 1.4;
const BASE_RADIUS = 1.5;
const WIDTH = 0.26;
const Y_BOTTOM = -0.75;
const Y_TOP = 1.45;

function createRibbonGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const cream = new THREE.Color("#f9ddaa");
  const caramel = new THREE.Color("#a9571b");
  const tint = new THREE.Color();

  const point = new THREE.Vector3();
  const next = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const radial = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const widthAxis = new THREE.Vector3();

  const sample = (t: number, target: THREE.Vector3) => {
    const angle = t * TURNS * Math.PI * 2;
    const radius = BASE_RADIUS + Math.sin(t * Math.PI * 2.1 + 0.4) * 0.12;
    return target.set(
      Math.cos(angle) * radius,
      Y_BOTTOM + t * (Y_TOP - Y_BOTTOM) + Math.sin(t * Math.PI * 2.6) * 0.07,
      Math.sin(angle) * radius,
    );
  };

  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    sample(t, point);
    sample(t >= 1 ? t - 0.004 : t + 0.004, next);
    tangent.subVectors(next, point).normalize();

    radial.set(point.x, 0, point.z).normalize();
    binormal.crossVectors(tangent, radial).normalize();

    // Twisting the width axis around the path is what makes it read as ribbon.
    const twist = t * Math.PI * 5.2;
    widthAxis
      .copy(radial)
      .multiplyScalar(Math.cos(twist))
      .addScaledVector(binormal, Math.sin(twist))
      .normalize();

    const half = WIDTH * 0.5 * (0.35 + Math.sin(t * Math.PI) * 0.75);

    for (const side of [1, -1]) {
      positions.push(
        point.x + widthAxis.x * half * side,
        point.y + widthAxis.y * half * side,
        point.z + widthAxis.z * half * side,
      );
      tint.copy(caramel).lerp(cream, THREE.MathUtils.clamp(0.2 + t * 0.6 + side * 0.1, 0, 1));
      colors.push(tint.r, tint.g, tint.b);
      uvs.push(t, side > 0 ? 1 : 0);
    }

    if (i < SEGMENTS) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, d, a, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function CaramelRibbon({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const spin = useRef(0.35);
  const intro = useIntroFade(reduced, 2.2);
  const geometry = useMemo(() => createRibbonGeometry(), []);

  useFrame((state, delta) => {
    const g = group.current;
    const m = material.current;
    if (!g || !m) return;

    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (!reduced) spin.current += d * 0.16;
    g.rotation.y = spin.current;
    g.position.y = reduced ? 0 : Math.sin(t * 0.55) * 0.06;
    g.scale.setScalar(0.94 + intro.current * 0.06);
    m.opacity = intro.current;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={material}
          color="#ffffff"
          vertexColors
          metalness={0.85}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive="#7a3d0c"
          emissiveIntensity={0.22}
          envMapIntensity={2.6}
          side={THREE.DoubleSide}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}
