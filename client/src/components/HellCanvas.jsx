import { lazy, memo, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { DESCENT_START_Y } from "../three/CameraRig";

// three.js lands in its own chunk and is fetched only once the DOM has painted.
const Scene = lazy(() => import("../three/Scene"));

/** Painted under the canvas so there's never a black flash while it loads. */
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

/**
 * Cinematic falloff over the scene. Also the reason DOM copy stays legible over
 * a surface that runs from black to white-hot. The corners and the upper third
 * are pulled down hard, which is where headings and nav live.
 */
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
  // Wait for first paint before pulling ~600 kB of WebGL onto the main thread.
  const [ready, setReady] = useState(false);
  // Stop rendering entirely when the tab is backgrounded.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!env.enable3D) return;
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const handle = idle(() => setReady(true), { timeout: 1200 });
    return () => cancel(handle);
  }, [env.enable3D]);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Reduced motion: the descent is told through type and stillness instead.
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
            frameloop={visible ? "always" : "never"}
            camera={{
              fov: 55,
              near: 0.1,
              far: 220,
              position: [0, DESCENT_START_Y, 14],
            }}
            gl={{
              antialias: false, // fog hides the aliasing; MSAA is not worth the fill rate
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

// `env` is a stable object from useEnvironment; memo keeps DOM-side state
// changes in App from ever remounting the GL context.
export default memo(HellCanvas);
