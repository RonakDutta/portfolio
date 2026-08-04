import { lazy, memo, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { DESCENT_START_Y } from "../three/descent";

const Scene = lazy(() => import("../three/Scene"));

function StaticHell() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 118%, #ff4d00 0%, #8a1c03 18%, #2a0d0a 42%, #05030a 78%)",
      }}
    />
  );
}

function Vignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-1"
      style={{
        background: [
          "radial-gradient(115% 75% at 50% 42%, transparent 30%, rgba(5,3,10,0.62) 100%)",
          "linear-gradient(to bottom, rgba(5,3,10,0.85) 0%, transparent 35%)",
        ].join(","),
      }}
    />
  );
}

function HellCanvas({ env }) {
  
  const [ready, setReady] = useState(false);
  
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!env.enable3D) return;
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;

const handle = idle(() => setReady(true), { timeout: 500 });
    return () => cancel(handle);
  }, [env.enable3D]);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

if (!env.enable3D)
    return (
      <>
        <StaticHell />
        <Vignette />
      </>
    );

  return (
    <>
      <StaticHell />
      {ready && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
        >
          <Canvas
            dpr={env.dpr}

frameloop={
              !visible ? "never" : env.canvasFps ? "demand" : "always"
            }
            camera={{
              fov: 55,
              near: 0.1,
              far: 220,
              position: [0, DESCENT_START_Y, 14],
            }}
            gl={{
              antialias: false, 
              alpha: false,
              stencil: false,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false,
            }}
          >
            <Suspense fallback={null}>
              <Scene env={env} />
            </Suspense>
          </Canvas>
        </div>
      )}
      <Vignette />
    </>
  );
}

export default memo(HellCanvas);
