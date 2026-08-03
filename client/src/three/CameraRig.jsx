/* eslint-disable react-hooks/immutability --
   Every write in this file happens inside useFrame, which runs outside React's
   render phase on the renderer's own loop. Mutating the camera and memoised
   uniform objects there is the documented react-three-fiber pattern and the
   whole point of the mutable frame store: routing any of it through state
   would re-render the tree on every frame. Scoped to this file rather than
   turned off in the config, because anywhere else the rule is right. */
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { frame, damp } from "../lib/store";
import { depthAt } from "./descent";
import { clamp01 } from "../lib/store";

const _target = new THREE.Vector3();

/**
 * Drives the camera from the mutable frame store, never from React state, so
 * scrolling costs zero rerenders.
 *
 * Three layered motions, in order of amplitude:
 *   1. Descent:      scroll maps to world Y.
 *   2. Parallax:     damped pointer offsets X/Y and adds a slight roll.
 *   3. Handheld:     low-amplitude drift so a still page never feels frozen.
 * The scroll-velocity shake is desktop only. A wheel or trackpad delivers
 * velocity in small, even increments and the shake reads as impact; a thumb
 * flick delivers a spike several times larger, and the same code reads as the
 * page coming apart. Rather than tune one curve to survive both, it is off
 * wherever the pointer is coarse.
 */
export default function CameraRig({ isMobile = false, coarsePointer = false }) {
  const { camera } = useThree();
  const shake = useRef(0);
  const canShake = !coarsePointer && !isMobile;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const s = frame.scroll;

    // Damp the raw pointer once, here, for every consumer in the scene.
    const p = frame.smoothPointer;
    p.x = damp(p.x, frame.pointer.x, 3.2, dt);
    p.y = damp(p.y, frame.pointer.y, 3.2, dt);

    // Parallax is a luxury on a phone, and the accelerometer noise isn't worth it.
    const par = coarsePointer ? 0 : isMobile ? 0.4 : 1;

    // 1. Descent.
    const targetY = depthAt(s);

    // 2. Parallax + a gentle arc so the fall isn't a straight elevator ride.
    const arc = Math.sin(s * Math.PI);
    const targetX = p.x * 2.4 * par + Math.sin(s * Math.PI * 2) * 1.6;
    const targetZ = 14 + arc * 4.5;

    // 3. Handheld drift.
    const driftX = Math.sin(t * 0.31) * 0.28;
    const driftY = Math.cos(t * 0.24) * 0.22;

    // Impulse from scroll velocity, decaying fast. Desktop only.
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

    // Look slightly down-and-ahead into the descent, led by the pointer.
    _target.set(p.x * 3.5 * par, targetY - 5 - p.y * 2.5 * par, -18);
    camera.lookAt(_target);

    // A touch of roll, which reads as weight, not as a tilt effect, at this scale.
    camera.rotation.z += p.x * 0.035 * par + shake.current * 0.02;

    camera.updateProjectionMatrix();
  });

  return null;
}
