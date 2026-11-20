import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createBeanBokehTexture } from "./textures";

/** Small deterministic PRNG so the scatter is stable between renders. */
function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function createBeanGeometry(detail: boolean) {
  const geo = new THREE.SphereGeometry(1, detail ? 26 : 14, detail ? 20 : 10);
  const position = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    // Flatten into a bean silhouette...
    v.set(v.x, v.y * 0.64, v.z * 0.5);
    // ...and press the signature crease down the middle.
    const crease = Math.exp(-(v.x * v.x) / 0.009) * Math.max(0, v.y) * 0.62;
    v.y -= crease;
    position.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

type Bean = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rx: number;
  ry: number;
  spin: number;
  phase: number;
};

/** Sharp, in-focus beans: the mid band and the small ones far behind the mug. */
function BeanBand({
  beans,
  color,
  roughness,
  detail,
  reduced,
}: {
  beans: Bean[];
  color: string;
  roughness: number;
  detail: boolean;
  reduced: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => createBeanGeometry(detail), [detail]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const instanced = mesh.current;
    if (!instanced) return;
    const t = reduced ? 0 : state.clock.elapsedTime;

    beans.forEach((bean, i) => {
      dummy.position.set(
        bean.x + Math.sin(t * 0.22 + bean.phase) * 0.12,
        bean.y + Math.cos(t * 0.18 + bean.phase) * 0.16,
        bean.z,
      );
      dummy.rotation.set(bean.rx + t * bean.spin, bean.ry + t * bean.spin * 0.7, bean.rx * 0.4);
      dummy.scale.setScalar(bean.scale);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    });

    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, beans.length]} frustumCulled={false}>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={0.08}
        envMapIntensity={0.9}
      />
    </instancedMesh>
  );
}

/** A few large, softly blurred beans drifting near the lens. */
function BokehBeans({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  const texture = useMemo(() => createBeanBokehTexture(), []);
  const group = useRef<THREE.Group>(null);

  const beans = useMemo(
    () =>
      compact
        ? [
            { x: -1.2, y: 1.5, z: 2.7, scale: 0.6, phase: 0.6, speed: 0.16, opacity: 0.42 },
            { x: 1.25, y: -1.85, z: 3.0, scale: 0.66, phase: 3.4, speed: 0.19, opacity: 0.4 },
          ]
        : [
            { x: 1.75, y: 0.95, z: 3.0, scale: 1.05, phase: 0.4, speed: 0.17, opacity: 0.5 },
            { x: 2.05, y: -0.85, z: 3.35, scale: 0.95, phase: 2.1, speed: 0.21, opacity: 0.48 },
            { x: 1.15, y: 2.05, z: 2.55, scale: 0.9, phase: 3.3, speed: 0.15, opacity: 0.44 },
            { x: 1.85, y: -1.85, z: 3.1, scale: 0.98, phase: 4.6, speed: 0.19, opacity: 0.46 },
            { x: -1.35, y: -1.95, z: 2.8, scale: 0.82, phase: 5.2, speed: 0.16, opacity: 0.4 },
          ],
    [compact],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g || reduced) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      const bean = beans[i];
      child.position.y = bean.y + Math.sin(t * bean.speed + bean.phase) * 0.24;
      child.position.x = bean.x + Math.cos(t * bean.speed * 0.7 + bean.phase) * 0.14;
    });
  });

  return (
    <group ref={group}>
      {beans.map((bean, i) => (
        <sprite
          key={i}
          position={[bean.x, bean.y, bean.z]}
          scale={[bean.scale * 1.9, bean.scale * 1.9, 1]}
        >
          <spriteMaterial map={texture} transparent opacity={bean.opacity} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

export function Beans({
  reduced,
  compact = false,
}: {
  reduced: boolean;
  compact?: boolean;
}) {
  const { mid, far } = useMemo(() => {
    const random = seeded(21);

    const mid: Bean[] = Array.from({ length: compact ? 7 : 11 }, () => {
      const angle = random() * Math.PI * 2;
      const radius = 2.05 + random() * 1.1;
      return {
        x: Math.cos(angle) * radius,
        y: -1.35 + random() * 2.7,
        z: -1.2 + random() * 2.2,
        scale: 0.7 + random() * 0.4,
        rx: random() * Math.PI,
        ry: random() * Math.PI,
        spin: 0.15 + random() * 0.3,
        phase: random() * Math.PI * 2,
      };
    });

    const far: Bean[] = Array.from({ length: compact ? 12 : 18 }, () => {
      const angle = random() * Math.PI * 2;
      const radius = 2.4 + random() * 3.2;
      return {
        x: Math.cos(angle) * radius,
        y: -1.6 + random() * 3.4,
        z: -7.5 + random() * 4.2,
        scale: 0.4 + random() * 0.35,
        rx: random() * Math.PI,
        ry: random() * Math.PI,
        spin: 0.1 + random() * 0.2,
        phase: random() * Math.PI * 2,
      };
    });

    return { mid, far };
  }, [compact]);

  return (
    <group>
      <BokehBeans reduced={reduced} compact={compact} />
      <BeanBand beans={mid} color="#43271a" roughness={0.52} detail reduced={reduced} />
      <BeanBand beans={far} color="#6b4630" roughness={0.72} detail={false} reduced={reduced} />
    </group>
  );
}
