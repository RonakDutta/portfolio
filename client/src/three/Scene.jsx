import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { frame, damp } from "../lib/store";
import { markSceneReady } from "../lib/threshold";
import CameraRig from "./CameraRig";
import LavaField from "./LavaField";

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
    
    const pulse = 0.9 + Math.sin(performance.now() * 0.0011) * 0.1;
    light.current.intensity = (140 + 260 * frame.scroll) * pulse;
  });

  return <pointLight ref={light} color="#ff5a10" distance={90} decay={2} />;
}

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

last = now - ((now - last) % interval);
      invalidate();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);

  return null;
}

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
      {}
      <fogExp2 attach="fog" args={["#0a0509", 0.017]} />

      {}
      <CameraRig isMobile={env.isMobile} coarsePointer={env.coarsePointer} />

      <ambientLight intensity={0.18} color="#3a2740" />
      <LavaGlow />

      <LavaField
        segments={env.lavaSegments}
        octaves={env.fbmOctaves}
        detail={env.lavaDetail}
        coarsePointer={env.coarsePointer}
      />

      {}

      <FrameGovernor fps={env.canvasFps} />
      <ReadySignal />
      <QualityGuard maxDpr={env.dpr[1]} />
    </>
  );
}
