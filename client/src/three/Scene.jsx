import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { frame, damp } from "../lib/store";
import { markSceneReady } from "../lib/threshold";
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

/**
 * Asks for a render at a fixed rate, for canvases running on demand.
 *
 * Paired with `frameloop="demand"` on the Canvas, this is what caps the scene
 * on a phone. Rendering is the expensive half of the frame here and the lava
 * is slow, churning noise: at 30 renders a second it looks the same and costs
 * half as much. Everything that has to stay at full rate does, because none of
 * it is in here. Scrolling, touch handling and every DOM animation are driven
 * by the browser and by GSAP, not by this loop.
 *
 * The camera and the lava both read `delta` and damp against it, so halving
 * the rate changes how often they are sampled and not how fast they move.
 */
function FrameGovernor({ fps }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!fps) return;

    const interval = 1000 / fps;
    let raf = 0;
    let last = -Infinity;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < interval) return;
      // Snap to the grid rather than adding the interval to `last`, so a
      // stalled tab does not come back owing a burst of catch-up renders.
      last = now - ((now - last) % interval);
      invalidate();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);

  return null;
}

/**
 * Tells the threshold the lava is actually on screen.
 *
 * Two frames, not one. The first frame is where the shaders compile, which is
 * the longest single stall in the whole boot, and reporting from inside it
 * would open the gate onto a canvas that is still black. The second frame only
 * happens once that work is behind us.
 */
function ReadySignal() {
  const frames = useRef(0);

  useFrame(() => {
    if (frames.current > 2) return;
    if (++frames.current === 2) markSceneReady();
  });

  return null;
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
        detail={env.lavaDetail}
        coarsePointer={env.coarsePointer}
      />

      {/* Embers, monoliths, chains and the rune ring mount here. */}

      <FrameGovernor fps={env.canvasFps} />
      <ReadySignal />
      <QualityGuard maxDpr={env.dpr[1]} />
    </>
  );
}
