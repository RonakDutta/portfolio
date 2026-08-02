/**
 * Shared GLSL chunks.
 *
 * Octave counts are interpolated into the source as literals rather than passed
 * as a uniform, so the loop unrolls at compile time and low-tier devices get a
 * genuinely cheaper shader instead of a branch they still pay for.
 */

/** Gradient (Perlin-style) 3D noise. ~40 ALU, no texture lookups. */
export const noise3D = /* glsl */ `
vec3 hash33(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
           dot(p, vec3(269.5, 183.3, 246.1)),
           dot(p, vec3(113.5, 271.9, 124.6)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float gnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dot(hash33(i + vec3(0,0,0)), f - vec3(0,0,0)),
            dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
        mix(dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)),
            dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
    mix(mix(dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)),
            dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
        mix(dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)),
            dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y),
    u.z);
}
`;

/**
 * Fractal brownian motion with a compile-time octave count.
 *
 * Emit it more than once under different names to get a cheap variant for the
 * detail layers (warp, soot) and an expensive one for the silhouette layer that
 * actually needs the octaves. Halving the noise calls in the lava fragment is
 * the difference between comfortable and marginal on integrated graphics.
 */
export const fbm = (octaves = 4, name = "fbm") => /* glsl */ `
float ${name}(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < ${octaves}; i++) {
    sum += amp * gnoise(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return sum;
}
`;

/** Cheap Gaussian-ish falloff used for every heat bloom in the project. */
export const bloomFalloff = /* glsl */ `
float bloom(float dist, float radius) {
  float x = dist / radius;
  return exp(-x * x);
}
`;
