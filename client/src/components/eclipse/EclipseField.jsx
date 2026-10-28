import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { eclipses, field } from "../../lib/eclipse";

/**
 * The corona. One fixed canvas, one fragment shader, drawn around whichever
 * eclipse anchor is on screen.
 *
 * Everything is measured in solar radii from the anchor's centre. Streamers are
 * simplex noise sampled on the unit circle (so there is no seam where the angle
 * wraps) and stretched along the radius, then pushed outward over time. The
 * moon is drawn by the DOM for a crisp limb; the shader only needs to know
 * where it is, so it can leave a hole there and expose the photosphere when
 * the moon is pulled off centre. A sliver of exposed sun throws the diamond
 * ring: a bloom and an anamorphic streak from the limb point furthest from
 * the moon.
 *
 * The output is premultiplied and its alpha is its brightest channel, so the
 * corona lays light over the page instead of a coloured sheet.
 *
 * The canvas is rendered well below device resolution, because nothing in it
 * has a hard edge that needs one, and the frame is skipped outright while no
 * anchor is near the viewport.
 */

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uC;
uniform float uR;
uniform vec2 uMoon;
uniform vec2 uLean;
uniform float uTime;
uniform float uGlow;
uniform float uBurst;

vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Bronze, gold, champagne, white gold. Brightness picks the stop, so the
// faint aura stays bronze and only the inner corona burns white.
vec3 ramp(float x){
  vec3 c = mix(vec3(0.30, 0.17, 0.05), vec3(0.80, 0.58, 0.25), smoothstep(0.0, 0.35, x));
  c = mix(c, vec3(1.0, 0.86, 0.56), smoothstep(0.3, 0.85, x));
  return mix(c, vec3(1.0, 0.97, 0.9), smoothstep(0.85, 1.7, x));
}

void main(){
  vec2 uv = (gl_FragCoord.xy - uC) / uR;
  float d = length(uv);
  if (d > 10.0) { gl_FragColor = vec4(0.0); return; }

  // Deep inside the moon nothing can show but the diamond ring's bloom.
  float off0 = length(uMoon);
  if (length(uv - uMoon) < 0.9 && off0 < 0.016) { gl_FragColor = vec4(0.0); return; }

  vec2 dir = uv / max(d, 1e-4);
  float px = 1.5 / uR;
  float rr = max(d - 1.0, 0.0);
  float t = uTime;

  // Streamers, longest where the visitor is. Far out, where they have faded
  // to almost nothing, their average stands in for them and the noise is
  // never computed: most of the screen is far out.
  float lean = dot(dir, uLean);
  float far = smoothstep(2.6, 3.6, d);
  float rays = 0.62;
  if (far < 1.0) {
    float n1 = snoise(vec3(dir * 2.1, rr * 0.32 - t * 0.035 + 3.0));
    float n2 = snoise(vec3(dir * 4.7 + 7.0, rr * 0.62 - t * 0.06));
    float n3 = snoise(vec3(dir * 11.0 - 3.0, rr * 1.3 - t * 0.1));
    float near = pow(max(0.6 + 0.44 * n1 + 0.27 * n2 + 0.13 * n3, 0.04), 2.1);
    rays = mix(near, rays, far);
  }

  float reach = max(2.25 - 0.8 * lean - 0.6 * uBurst, 0.6);
  float corona = exp(-rr * reach) * rays * 0.95;
  corona += exp(-rr * 7.5) * 0.9;
  corona += exp(-rr * 0.85) * 0.12;
  corona *= (1.0 + 0.9 * uBurst) * uGlow;

  // Prominences: ember tongues licking off the limb.
  float prom = 0.0;
  if (rr < 0.2 && d >= 1.0) {
    float pn = snoise(vec3(dir * 6.0, t * 0.05));
    prom = smoothstep(0.42, 0.85, pn) * exp(-rr * 34.0) * uGlow;
  }

  // The moon.
  vec2 mv = uv - uMoon;
  float cover = 1.0 - smoothstep(1.015 - px, 1.015 + px, length(mv));

  // The photosphere, wherever the moon has slipped off it.
  float inSun = 1.0 - smoothstep(1.0 - px, 1.0 + px, d);
  float limb = sqrt(max(1.0 - d * d, 0.0));
  float photo = inSun * (0.7 + 0.5 * limb) * (1.0 - cover);

  // The diamond ring.
  float off = length(uMoon);
  float expo = smoothstep(0.0, 0.06, off - 0.015) * uGlow;
  vec2 P = -uMoon / max(off, 1e-4);
  vec2 dp = uv - P;
  float flare = expo * (exp(-length(dp) * 4.0) * 1.5 + exp(-length(dp) * 1.2) * 0.38);
  float beam = expo * exp(-abs(dp.y) * 60.0) * exp(-abs(dp.x) * 1.6) * 0.9;

  float I = corona * (1.0 - cover) + photo * 3.0 + flare + beam;
  vec3 col = ramp(I) * (1.0 - exp(-I * 1.6));
  col += vec3(1.0, 0.45, 0.17) * prom * (1.0 - cover);

  // A whisper of dither so the long falloff does not band.
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  col = max(col, 0.0);

  float a = clamp(max(max(col.r, col.g), col.b), 0.0, 1.0);
  gl_FragColor = vec4(min(col, vec3(a)), a);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function EclipseField({ env }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }) || null;

    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl && vs && fs ? gl.createProgram() : null;
    if (program) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
    }

    if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      field.supported = false;
      document.documentElement.classList.add("no-gl");
      return undefined;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    const u = {};
    for (const name of ["uC", "uR", "uMoon", "uLean", "uTime", "uGlow", "uBurst"]) {
      u[name] = gl.getUniformLocation(program, name);
    }

    // Resolution: a fraction of the CSS pixel grid, scaled back down further
    // if the frame budget is being missed.
    let quality = env.isMobile ? 0.45 : 0.55;
    let scale = 1;
    let width = 0;
    let height = 0;
    let last = "";
    let drawn = false;
    let slow = 0;
    let frames = 0;
    let prev = performance.now();
    const still = env.reducedMotion;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Never more than ~0.85 canvas pixels per CSS pixel (0.6 on a phone):
      // nothing here has an edge that needs a retina grid.
      scale = Math.min(dpr * quality, env.isMobile ? 0.6 : 0.85);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      last = "";
    };

    const render = () => {
      const now = performance.now();
      const dt = now - prev;
      prev = now;

      let best = null;
      let bestScore = Infinity;
      for (const entry of eclipses) {
        if (entry.glow <= 0.001 || entry.visible === false) continue;
        const r = entry.anchor.getBoundingClientRect();
        if (!r.width) continue;
        const R = r.width / 2;
        const cx = r.left + R;
        const cy = r.top + r.height / 2;
        const reach = R * 6;
        if (cy + reach < 0 || cy - reach > height || cx + reach < 0 || cx - reach > width) continue;
        const score = Math.abs(cy - height / 2);
        if (score < bestScore) {
          bestScore = score;
          best = { entry, cx, cy, R };
        }
      }

      // Nothing to draw: no anchor near, the corona asleep, or the moon has
      // swallowed the whole viewport.
      const swallowed =
        best &&
        Math.hypot(Math.max(best.cx, width - best.cx), Math.max(best.cy, height - best.cy)) < best.R * 0.97;
      if (!best || swallowed || field.awake <= 0.001) {
        if (drawn) {
          gl.clear(gl.COLOR_BUFFER_BIT);
          drawn = false;
        }
        canvas.style.opacity = "0";
        return;
      }
      canvas.style.opacity = "1";

      const { entry, cx, cy, R } = best;
      const m = entry.moon.getBoundingClientRect();
      const mx = (m.left + m.width / 2 - cx) / R;
      const my = (m.top + m.height / 2 - cy) / R;
      const glow = field.awake * entry.glow;

      if (still) {
        const key = `${cx | 0},${cy | 0},${R | 0},${glow.toFixed(3)},${entry.burst.toFixed(3)}`;
        if (key === last) return;
        last = key;
      }

      const sunR = (R / 1.015) * scale;
      gl.uniform2f(u.uC, cx * scale, (height - cy) * scale);
      gl.uniform1f(u.uR, sunR);
      gl.uniform2f(u.uMoon, mx, -my);
      gl.uniform2f(u.uLean, entry.lean.x, entry.lean.y);
      gl.uniform1f(u.uTime, still ? 12 : (now - start) / 1000);
      gl.uniform1f(u.uGlow, glow);
      gl.uniform1f(u.uBurst, entry.burst);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      drawn = true;

      // Adaptive resolution: if most of a second of frames ran long, drop a
      // notch. Never below a third of the CSS grid.
      if (!still && dt < 200) {
        frames += 1;
        if (dt > 26) slow += 1;
        if (frames >= 45) {
          if (slow > 30 && quality > 0.34) {
            quality = Math.max(0.34, quality - 0.12);
            resize();
          }
          frames = 0;
          slow = 0;
        }
      }
    };

    resize();
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });
    gsap.ticker.add(render);

    const lost = (e) => {
      e.preventDefault();
      gsap.ticker.remove(render);
    };
    canvas.addEventListener("webglcontextlost", lost);

    return () => {
      clearTimeout(resizeTimer);
      gsap.ticker.remove(render);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", lost);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [env.isMobile, env.reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] w-full opacity-0"
    />
  );
}

export default memo(EclipseField);
