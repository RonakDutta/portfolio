import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { frame } from "../lib/store";
import { markSceneReady } from "../lib/threshold";
import CameraRig from "./CameraRig";
import LavaField from "./LavaField";

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
      <fogExp2 attach="fog" args={["#080610", 0.019]} />

      {}
      <CameraRig isMobile={env.isMobile} coarsePointer={env.coarsePointer} />

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
