import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { frame, damp, clamp01 } from "../lib/store";
import { noise3D, fbm, bloomFalloff } from "./glsl";

/**
 * The molten river beneath the descent.
 *
 * One plane, not many. It rides along under the camera — including ahead of it,
 * since a forward-pitched camera sees lava 30-150 units downrange, not directly
 * below — and samples its noise in world space, so the surface slides past
 * correctly instead of being dragged along with the mesh. The gap between
 * camera and lava tightens as you descend; that closing distance is the descent.
 *
 * Cursor reactivity is a real ray/plane intersection rather than a screen-space
 * approximation, so the heat bloom stays welded to the surface at any camera
 * angle. One raycast per frame against an analytic plane is essentially free.
 */

/** How far ahead of the camera the plane centres itself, in world units. */
const LOOKAHEAD = 34;

const vertexShader = (octaves) => /* glsl */ `
  uniform float uTime;
  uniform float uFlow;
  uniform float uSwell;
  uniform float uRadius;
  uniform float uHeatStrength;
  uniform vec2  uHeatPoint;

  varying vec3  vWorld;
  varying float vSwell;

  ${noise3D}
  ${fbm(Math.max(2, octaves - 2))}
  ${bloomFalloff}

  void main() {
    vec3 pos = position;
    vec3 base = (modelMatrix * vec4(pos, 1.0)).xyz;

    // Domain scrolls with descent so the surface flows past as you fall.
    float swell = fbm(vec3(base.xz * 0.035 + vec2(0.0, uFlow), uTime * 0.05));

    float heat = bloom(distance(base.xz, uHeatPoint), uRadius) * uHeatStrength;

    // Local +Z becomes world up after the -90deg X rotation.
    pos.z += swell * uSwell + heat * uSwell * 1.8;

    vSwell = swell * 0.5 + 0.5;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = (octaves) => /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uFlow;
  uniform float uIntensity;
  uniform float uRadius;
  uniform float uHeatStrength;
  uniform vec2  uHeatPoint;
  uniform vec2  uViewer;
  uniform vec3  uRock;
  uniform vec3  uEmber;
  uniform vec3  uHot;
  uniform vec3  uCore;

  varying vec3  vWorld;
  varying float vSwell;

  ${noise3D}
  ${fbm(octaves, "fbm")}
  ${fbm(2, "fbmLow")}
  ${bloomFalloff}

  void main() {
    // World-space domain: the mesh moves with the camera, the pattern does not.
    vec2 p = vWorld.xz * 0.04 + vec2(0.0, uFlow);
    float t = uTime * 0.06;

    // Domain warp turns clean noise bands into something that churns.
    // Two octaves is plenty here — it only perturbs a lookup.
    vec2 warp = vec2(
      fbmLow(vec3(p * 1.3, t)),
      fbmLow(vec3(p * 1.3 + 19.7, t))
    );

    // The silhouette layer, where the octaves actually earn their cost.
    float crust = fbm(vec3(p + warp * 0.55, t * 1.4)) * 0.5 + 0.5;

    // Veins glow where the crust has split. The band is deliberately narrow and
    // the falloff steep — a wide band reads as orange ground, not as molten
    // rock, and the whole illusion rests on most of this surface being black.
    float veins = 1.0 - smoothstep(0.40, 0.53, crust);
    veins = pow(veins, 2.4);

    // A finer secondary fracture network, so close range keeps detail.
    float fine = 1.0 - smoothstep(0.44, 0.50, fbmLow(vec3(p * 2.6 + warp, t * 2.0)) * 0.5 + 0.5);
    veins = max(veins, fine * 0.5);

    float heat = bloom(distance(vWorld.xz, uHeatPoint), uRadius) * uHeatStrength;

    float temp = clamp(veins * uIntensity + heat * 1.35 + vSwell * 0.10, 0.0, 1.4);

    vec3 col = mix(uRock, uEmber, smoothstep(0.04, 0.42, temp));
    col = mix(col, uHot, smoothstep(0.38, 0.82, temp));
    col = mix(col, uCore, smoothstep(0.88, 1.25, temp));

    // Soot speckle over the cooled crust only — keeps the hot cracks clean.
    float soot = fbmLow(vec3(p * 8.0, t * 1.8)) * 0.5 + 0.5;
    col *= mix(0.80 + 0.20 * soot, 1.0, smoothstep(0.35, 0.8, temp));

    // Our own distance fog. fogExp2 doesn't reach a raw ShaderMaterial, and
    // doing it here lets the far river dissolve instead of ending at an edge.
    float fade = 1.0 - smoothstep(55.0, 150.0, distance(vWorld.xz, uViewer));

    gl_FragColor = vec4(col * fade, fade);
    #include <colorspace_fragment>
  }
`;

// Reused across frames — allocating these per frame is how you get GC hitches.
const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _ray = new THREE.Raycaster();
const _hit = new THREE.Vector3();
const _ndc = new THREE.Vector2();
const _fwd = new THREE.Vector3();

export default function LavaField({
  segments = 128,
  octaves = 4,
  coarsePointer = false,
}) {
  const mesh = useRef();
  const { camera } = useThree();

  // Where the heat bloom currently sits, in world XZ. Damped toward the cursor.
  const heat = useRef({ x: 0, z: -40, strength: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlow: { value: 0 },
      uSwell: { value: 1.15 },
      uIntensity: { value: 0.95 },
      uRadius: { value: 9 },
      uHeatStrength: { value: 0 },
      uHeatPoint: { value: new THREE.Vector2(0, -40) },
      uViewer: { value: new THREE.Vector2() },
      uRock: { value: new THREE.Color("#0d0605") },
      uEmber: { value: new THREE.Color("#8a1c03") },
      uHot: { value: new THREE.Color("#ff5a0a") },
      uCore: { value: new THREE.Color("#ffe2a8") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05); // clamp so a stalled tab doesn't lurch
    const t = state.clock.elapsedTime;
    const u = uniforms;
    const s = frame.scroll;
    const m = mesh.current;

    // Lava closes in as the descent deepens: distant and cold at the gates,
    // close enough to feel at the summoning circle.
    const drop = 32 - 21 * s;

    // Centre the plane on where the camera is *looking*, flattened to the
    // ground plane. Otherwise the whole visible river sits outside the fade.
    camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-4) _fwd.set(0, 0, -1);
    _fwd.normalize();

    m.position.x = damp(
      m.position.x,
      camera.position.x + _fwd.x * LOOKAHEAD,
      4,
      dt,
    );
    m.position.z = damp(
      m.position.z,
      camera.position.z + _fwd.z * LOOKAHEAD,
      4,
      dt,
    );
    m.position.y = damp(m.position.y, camera.position.y - drop, 6, dt);

    u.uTime.value = t;
    // Noise domain offset by absolute depth — this is what makes it flow.
    u.uFlow.value = -camera.position.y * 0.012 + t * 0.015;
    u.uIntensity.value = 0.95 + 0.45 * s;
    u.uSwell.value = 0.9 + 0.6 * s;
    u.uViewer.value.set(camera.position.x, camera.position.z);

    if (coarsePointer) {
      // No cursor to follow: let the hot spot wander on its own.
      heat.current.x = m.position.x + Math.sin(t * 0.21) * 18;
      heat.current.z = m.position.z + Math.cos(t * 0.17) * 18;
      heat.current.strength = damp(heat.current.strength, 0.5, 1.5, dt);
    } else {
      _ndc.set(frame.smoothPointer.x, frame.smoothPointer.y);
      _ray.setFromCamera(_ndc, camera);
      // Plane equation is normal·p + constant = 0, so constant = -planeY.
      _plane.constant = -m.position.y;

      if (_ray.ray.intersectPlane(_plane, _hit)) {
        // Damped so the fire trails the cursor rather than snapping to it.
        heat.current.x = damp(heat.current.x, _hit.x, 4.5, dt);
        heat.current.z = damp(heat.current.z, _hit.z, 4.5, dt);
        heat.current.strength = damp(heat.current.strength, 1, 2.5, dt);
      } else {
        // Cursor is above the horizon — cool off, don't teleport the bloom.
        heat.current.strength = damp(heat.current.strength, 0, 2, dt);
      }
    }

    u.uHeatPoint.value.set(heat.current.x, heat.current.z);
    // Scroll velocity fans the flames.
    const gust = clamp01(Math.abs(frame.velocity) * 0.05);
    u.uHeatStrength.value = heat.current.strength * (1 + gust * 0.8);
    u.uRadius.value = damp(u.uRadius.value, 10 + gust * 8, 3, dt);
  });

  return (
    <mesh
      ref={mesh}
      rotation-x={-Math.PI / 2}
      position={[0, -32, -34]}
      renderOrder={-1}
      frustumCulled={false}
    >
      <planeGeometry args={[340, 340, segments, segments]} />
      <shaderMaterial
        // Octave count is baked into the source, so a change needs a fresh
        // material rather than a uniform update.
        key={octaves}
        uniforms={uniforms}
        vertexShader={vertexShader(octaves)}
        fragmentShader={fragmentShader(octaves)}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
