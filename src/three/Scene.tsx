import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Backdrop, GoldenGlow } from "./Backdrop";
import { Beans } from "./Beans";
import { IceCubes } from "./IceCubes";
import { LatteMug } from "./LatteMug";
import { useIsMobile, usePrefersReducedMotion } from "./useMotionPreferences";

/**
 * Keeps the mug framed to the right of the hero copy on desktop and low on the
 * screen for portrait phones, with a damped pointer parallax on top.
 */
function Rig({ children, reduced }: { children: ReactNode; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { size, camera } = useThree();
  const isDesktop = size.width >= 1024;

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const g = group.current;

    if (g) {
      const targetX = isDesktop ? 1.42 : 0;
      const targetY = isDesktop ? 0.02 : -0.95;
      g.position.x = THREE.MathUtils.damp(g.position.x, targetX + pointer.current.x * 0.16, 4, d);
      g.position.y = THREE.MathUtils.damp(g.position.y, targetY - pointer.current.y * 0.1, 4, d);
    }

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z = THREE.MathUtils.damp(cam.position.z, isDesktop ? 8.2 : 11.2, 4, d);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, isDesktop ? 2.05 : 1.0, 4, d);
    cam.lookAt(isDesktop ? 0.72 : 0, isDesktop ? 0.05 : -0.55, 0);
  });

  return <group ref={group}>{children}</group>;
}

export function Scene() {
  const reduced = usePrefersReducedMotion();
  const compact = useIsMobile();

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 2.05, 8.2], fov: 32, near: 0.1, far: 80 }}
        frameloop={reduced ? "demand" : "always"}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.02;
        }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#dcb488", 11, 30]} />

          <ambientLight intensity={0.7} color="#ffe7cd" />
          <directionalLight position={[4.5, 6, 5]} intensity={2.1} color="#ffd3a1" />
          <pointLight position={[-3, 1.5, 3.5]} intensity={9} distance={14} color="#ffb066" />

          {/* Studio-style reflections: no external HDRI needed. */}
          <Environment resolution={192} frames={1}>
            <color attach="background" args={["#2a1a12"]} />
            <Lightformer
              form="rect"
              intensity={2.2}
              color="#ffd9a8"
              position={[0, 5, -7]}
              scale={[10, 5, 1]}
            />
            <Lightformer
              form="circle"
              intensity={3}
              color="#ffb877"
              position={[-5, 1.5, 3]}
              scale={4}
            />
            <Lightformer
              form="rect"
              intensity={1.6}
              color="#fff4e2"
              position={[6, 2, 2]}
              scale={[3, 6, 1]}
              rotation-y={-Math.PI / 3}
            />
            <Lightformer
              form="circle"
              intensity={1.2}
              color="#ffe6c4"
              position={[0, -4, 2]}
              scale={5}
            />
          </Environment>

          <Backdrop />

          <Rig reduced={reduced}>
            <GoldenGlow />
            <Beans reduced={reduced} compact={compact} />
            <LatteMug reduced={reduced} />
            <IceCubes reduced={reduced} />
          </Rig>
        </Suspense>
      </Canvas>
    </div>
  );
}
