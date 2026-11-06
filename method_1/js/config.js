// Tunable constants. Change behaviour here, not in the logic modules.

export const CONFIG = {
  depth: { min: 3, max: 50, initial: 15, keyStep: 1, wheelStep: 0.02 },

  camera: {
    fov: 75,
    near: 0.1,
    far: 500,
    start: { x: 0, y: 2, z: 8 },
    pitchLimit: Math.PI / 2 - 0.1,
    mouseSensitivity: 0.004,
    padSensitivity: 0.03,
  },

  scene: {
    background: 0x070b14,
    fogDensity: 0.015,
    groundSize: 200,
  },

  groundArc: {
    maxSteps: 40,
    velocityPerDepth: 0.8,
    gravity: 9.8,
    dt: 0.05,
    landingOffsetY: 1.8,
  },

  air: { minHeight: 1.2, laserYOffset: -0.3 },

  warp: { durationMs: 600, fovPeak: 100, speedLines: 60 },

  colors: { cyan: 0x00f0ff, magenta: 0xff007f, green: 0x00ff88, invalid: 0xff0000 },

  pillars: [
    // [x, y, z, w, h, d]
    [-12, 4, -15, 3, 8, 3],
    [15, 6, -20, 4, 12, 4],
    [-20, 8, 10, 5, 16, 5],
    [22, 5, 15, 3, 10, 3],
    [0, 3, -30, 8, 6, 8],
  ],

  skyPlatforms: [
    { pos: [0, 10, -18], size: [10, 0.8, 10] },
    { pos: [-25, 20, -10], size: [12, 0.8, 12] },
    { pos: [25, 30, -5], size: [10, 0.8, 10] },
    { pos: [0, 50, 0], size: [16, 1.0, 16] },
  ],

  ringHeights: [12, 22, 35, 50],
  starCount: 1000,
};
