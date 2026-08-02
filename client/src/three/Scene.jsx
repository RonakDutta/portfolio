import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { frame, damp } from "../lib/store";
import CameraRig from "./CameraRig";
import LavaField from "./LavaField";

/**
 * Everything inside the <Canvas>. Lazy-loaded as its own chunk. Importing this
 * file is what pulls three.js into the graph, so nothing above it pays for 3D.
 */

/** Orange bounce from the molten river, following the descent. */
function LavaGlow() {
  const light = useRef();
  const { camera } = useThree();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    light.current.position.x = camera.position.x * 0.5;
    light.current.position.y = damp(
      light.current.position.y,
      camera.position.y - 12,
      5,
      dt,
    );
    // Brightens as the lava closes in, and pulses like a furnace.
    const pulse = 0.9 + Math.sin(performance.now() * 0.0011) * 0.1;
    light.current.intensity = (140 + 260 * frame.scroll) * pulse;
  });

  return <pointLight ref={light} color="#ff5a10" distance={90} decay={2} />;
}

function QualityGuard({ maxDpr }) {
  const setDpr = useThree((s) => s.setDpr);

  return (
    <PerformanceMonitor
      // Only react to a sustained drop, not a single slow frame.
      flipflops={3}
      onDecline={() => {
        frame.quality = 0.7;
        setDpr(Math.min(maxDpr, 1.1));
      }}
      onFallback={() => {
        frame.quality = 0.5;
        setDpr(1);
      }}
    />
  );
}

export default function Scene({ env }) {
  return (
    <>
      <color attach="background" args={["#05030a"]} />
      {/* Exponential fog swallows the far geometry, the volumetric depth cue
          that makes a 64-unit shaft feel bottomless. */}
      <fogExp2 attach="fog" args={["#0a0509", 0.017]} />

      {/* Registered first so the damped pointer is fresh for everything below. */}
      <CameraRig isMobile={env.isMobile} coarsePointer={env.coarsePointer} />

      <ambientLight intensity={0.18} color="#3a2740" />
      <LavaGlow />

      <LavaField
        segments={env.lavaSegments}
        octaves={env.fbmOctaves}
        coarsePointer={env.coarsePointer}
      />

      {/* Embers, monoliths, chains and the rune ring mount here. */}

      <QualityGuard maxDpr={env.dpr[1]} />
    </>
  );
}
