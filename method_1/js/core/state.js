import { CONFIG } from '../config.js';

// Gameplay / UI state (plain data)
export const state = {
  mode: 'GROUND', // 'GROUND' | 'AIR'
  depth: CONFIG.depth.initial,
  pitch: 0,
  yaw: 0,
  isTeleporting: false,
  stats: { totalJumps: 0, groundJumps: 0, airJumps: 0 },
  targetPos: new THREE.Vector3(),
  isValidTarget: true,
};

// Live Three.js objects, filled in by scene/ and teleport/ init functions
export const engine = {
  scene: null,
  camera: null,
  renderer: null,
  raycaster: null,
  container: null,
  collidableObjects: [],
  floatRings: [],
  starParticles: null,
  parabolaLine: null,
  airLaserRay: null,
  groundReticle: null,
  airGhostSphere: null,
};
