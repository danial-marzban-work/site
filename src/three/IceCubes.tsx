import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "./useMotionPreferences";

const CUBES = [
  { position: [-0.85, 1.0, 0.65], size: 0.44, tilt: 0.4, speed: 0.22, phase: 0.3 },
  { position: [2.25, -0.75, 0.95], size: 0.36, tilt: 1.1, speed: 0.17, phase: 1.7 },
  { position: [0.45, -1.55, -0.35], size: 0.5, tilt: 2.2, speed: 0.13, phase: 3.1 },
  { position: [2.65, 1.5, -1.15], size: 0.34, tilt: 0.8, speed: 0.19, phase: 4.4 },
  { position: [-0.35, -0.1, -1.6], size: 0.4, tilt: 1.6, speed: 0.15, phase: 5.6 },
] as const;

function IceCube({
  position,
  size,
  tilt,
  speed,
  phase,
  reduced,
  mobile,
}: {
  position: readonly [number, number, number];
  size: number;
  tilt: number;
  speed: number;
  phase: number;
  reduced: boolean;
  mobile: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    g.position.y = position[1] + Math.sin(t * speed + phase) * 0.22;
    g.position.x = position[0] + Math.cos(t * speed * 0.8 + phase) * 0.12;
    if (!reduced) {
      g.rotation.x += delta * speed * 0.6;
      g.rotation.y += delta * speed * 0.45;
      g.rotation.z += delta * speed * 0.3;
    } else {
      g.rotation.set(tilt, tilt * 0.6, tilt * 0.3);
    }
  });

  return (
    <group ref={ref} position={position as unknown as [number, number, number]} rotation={[tilt, tilt * 0.6, tilt * 0.3]}>
      <RoundedBox args={[size, size, size]} radius={size * 0.16} smoothness={4}>
        {mobile ? (
          <meshPhysicalMaterial
            color="#f2f7ff"
            transparent
            opacity={0.42}
            roughness={0.08}
            metalness={0}
            envMapIntensity={2.2}
          />
        ) : (
          <meshPhysicalMaterial
            color="#f4f8ff"
            transmission={0.96}
            thickness={size * 1.3}
            roughness={0.05}
            metalness={0}
            ior={1.31}
            clearcoat={1}
            clearcoatRoughness={0.04}
            envMapIntensity={1.8}
          />
        )}
      </RoundedBox>
    </group>
  );
}

export function IceCubes({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  const mobile = useIsMobile();
  const cubes = compact ? CUBES.slice(0, 3) : CUBES;

  return (
    <group>
      {cubes.map((cube, i) => (
        <IceCube key={i} {...cube} reduced={reduced} mobile={mobile} />
      ))}
    </group>
  );
}
