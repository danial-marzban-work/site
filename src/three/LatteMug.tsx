import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { createLatteArtTexture } from "./textures";
import { useIsMobile } from "./useMotionPreferences";

/**
 * Cross-section of the glass: outer wall up to the rim, then back down the inside,
 * so the lathe produces real wall thickness instead of a single surface.
 */
const PROFILE = [
  [0.0, -1.02],
  [0.3, -1.03],
  [0.62, -1.03],
  [0.74, -0.99],
  [0.78, -0.92],
  [0.81, -0.6],
  [0.845, 0.0],
  [0.875, 0.55],
  [0.885, 0.66],
  [0.885, 0.7],
  [0.855, 0.7],
  [0.845, 0.64],
  [0.835, 0.55],
  [0.805, 0.0],
  [0.775, -0.58],
  [0.735, -0.88],
  [0.7, -0.93],
  [0.0, -0.93],
].map(([x, y]) => new THREE.Vector2(x, y));

export function LatteMug({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const isMobile = useIsMobile();

  const glassGeometry = useMemo(() => new THREE.LatheGeometry(PROFILE, 72), []);
  const latteArt = useMemo(() => createLatteArtTexture(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.y += delta * 0.16;
    g.position.y = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.55) * 0.035;
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={1.18}>
      {/* Glass body */}
      <mesh geometry={glassGeometry} castShadow>
        {isMobile ? (
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.32}
            roughness={0.06}
            metalness={0}
            ior={1.45}
            envMapIntensity={2.6}
            specularIntensity={1}
            side={THREE.DoubleSide}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={3}
            resolution={192}
            transmission={1}
            thickness={0.3}
            roughness={0.02}
            chromaticAberration={0.2}
            anisotropicBlur={0.32}
            distortion={0.06}
            distortionScale={0.14}
            temporalDistortion={0.04}
            ior={1.46}
            color="#ffffff"
            attenuationColor="#f2d0a4"
            attenuationDistance={2.2}
            clearcoat={0.6}
            clearcoatRoughness={0.06}
            envMapIntensity={1.35}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* Coffee */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.8, 0.75, 1.0, 64]} />
        <meshPhysicalMaterial
          color="#3a2015"
          roughness={0.42}
          metalness={0}
          clearcoat={0.4}
          clearcoatRoughness={0.45}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Crema surface with poured latte art */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.055, 0]}>
        <circleGeometry args={[0.795, 72]} />
        <meshStandardMaterial map={latteArt} roughness={0.34} metalness={0} envMapIntensity={0.6} />
      </mesh>

      {/* Polished rim highlight */}
      <mesh position={[0, 0.7, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.871, 0.016, 12, 96]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.55}
          roughness={0.02}
          metalness={0}
          envMapIntensity={3}
        />
      </mesh>

      {/* Handle */}
      <mesh position={[0.86, 0.02, 0]} rotation={[0, 0, -Math.PI * 0.57]}>
        <torusGeometry args={[0.36, 0.072, 20, 64, Math.PI * 1.15]} />
        {isMobile ? (
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.34}
            roughness={0.1}
            metalness={0}
            envMapIntensity={1.8}
          />
        ) : (
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={1}
            thickness={0.3}
            roughness={0.06}
            ior={1.45}
            envMapIntensity={1.6}
            clearcoat={1}
            clearcoatRoughness={0.06}
          />
        )}
      </mesh>
    </group>
  );
}
