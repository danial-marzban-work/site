import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIntroFade } from "./useIntroFade";

/**
 * Milk splash: a crown of glossy droplets thrown outward from the rim, plus a
 * few thin milk streaks arcing around the glass.
 */
const RIM_Y = 0.86;

type Drop = {
  angle: number;
  phase: number;
  speed: number;
  reach: number;
  height: number;
  size: number;
};

function createStreaks() {
  return [0, 1, 2].map((i) => {
    const base = (i / 3) * Math.PI * 2 + 0.6;
    const points: THREE.Vector3[] = [];
    for (let s = 0; s <= 10; s++) {
      const p = s / 10;
      const angle = base + p * 1.15;
      const radius = 0.98 + Math.sin(p * Math.PI) * 0.42;
      const y = RIM_Y + Math.sin(p * Math.PI) * (0.3 + i * 0.11);
      points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.9));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, 0.026 - i * 0.004, 8, false);
  });
}

export function MilkSplash({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  const count = compact ? 9 : 16;
  const drops = useRef<THREE.InstancedMesh>(null);
  const streaks = useRef<THREE.Group>(null);
  const intro = useIntroFade(reduced, 1.4);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometries = useMemo(() => createStreaks(), []);

  const streakMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#fffaf0",
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1,
        envMapIntensity: 2.4,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  const seeds = useMemo<Drop[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2 + Math.random() * 0.5,
        phase: Math.random(),
        speed: 0.22 + Math.random() * 0.12,
        reach: 0.45 + Math.random() * 0.5,
        height: 0.35 + Math.random() * 0.5,
        size: 0.045 + Math.random() * 0.05,
      })),
    [count],
  );

  useFrame((state, delta) => {
    const mesh = drops.current;
    const t = reduced ? 0 : state.clock.elapsedTime;

    if (mesh) {
      for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const life = (t * seed.speed + seed.phase) % 1;
        const arc = Math.sin(life * Math.PI);
        const distance = 0.95 + life * seed.reach;

        dummy.position.set(
          Math.cos(seed.angle) * distance,
          RIM_Y + arc * seed.height - life * life * 0.3,
          Math.sin(seed.angle) * distance * 0.85,
        );
        const scale =
          seed.size *
          (0.35 + arc * 1.1) *
          Math.max(0, 1 - Math.max(0, life - 0.78) * 4) *
          intro.current;
        dummy.scale.set(scale * 0.85, scale * 1.7, scale * 0.85);
        dummy.rotation.set(0, -seed.angle, life * 1.2);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    if (streaks.current && !reduced) streaks.current.rotation.y -= Math.min(delta, 0.05) * 0.1;
    streakMaterial.opacity = intro.current * 0.55;
  });

  return (
    <group>
      <instancedMesh
        ref={drops}
        args={[
          undefined as unknown as THREE.BufferGeometry,
          undefined as unknown as THREE.Material,
          count,
        ]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 14, 12]} />
        <meshPhysicalMaterial
          color="#fffdf7"
          roughness={0.14}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={2.2}
        />
      </instancedMesh>

      <group ref={streaks}>
        {geometries.map((geometry, i) => (
          <mesh key={i} geometry={geometry} material={streakMaterial} />
        ))}
      </group>
    </group>
  );
}
