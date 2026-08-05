
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { frame, damp } from "../lib/store";
import { depthAt } from "./descent";
import { clamp01 } from "../lib/store";

const _target = new THREE.Vector3();

export default function CameraRig({ isMobile = false, coarsePointer = false }) {
  const { camera } = useThree();
  const shake = useRef(0);
  const canShake = !coarsePointer && !isMobile;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const s = frame.scroll;

const p = frame.smoothPointer;
    p.x = damp(p.x, frame.pointer.x, 3.2, dt);
    p.y = damp(p.y, frame.pointer.y, 3.2, dt);

const par = coarsePointer ? 0 : isMobile ? 0.4 : 1;

const targetY = depthAt(s);

const arc = Math.sin(s * Math.PI);
    const targetX = p.x * 2.4 * par + Math.sin(s * Math.PI * 2) * 1.6;
    const targetZ = 14 + arc * 4.5;

const driftX = Math.sin(t * 0.31) * 0.28;
    const driftY = Math.cos(t * 0.24) * 0.22;

let shakeX = 0;
    let shakeY = 0;
    if (canShake) {
      const impulse = clamp01(Math.abs(frame.velocity) * 0.03);
      shake.current = Math.max(damp(shake.current, 0, 4.5, dt), impulse);
      const q = shake.current * 0.5;
      shakeX = Math.sin(t * 47.3) * q;
      shakeY = Math.sin(t * 39.1) * q;
    }

    camera.position.x =
      damp(camera.position.x, targetX + driftX, 3, dt) + shakeX;
    camera.position.y =
      damp(camera.position.y, targetY + driftY, 5, dt) + shakeY;
    camera.position.z = damp(camera.position.z, targetZ, 2.5, dt);

_target.set(p.x * 3.5 * par, targetY - 5 - p.y * 2.5 * par, -18);
    camera.lookAt(_target);

camera.rotation.z += p.x * 0.035 * par + shake.current * 0.02;

    camera.updateProjectionMatrix();
  });

  return null;
}
