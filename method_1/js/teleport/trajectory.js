import { CONFIG } from '../config.js';
import { state, engine } from '../core/state.js';
import { setReticleColor } from './visualizers.js';

function aimDirection() {
  const dir = new THREE.Vector3(0, 0, -1);
  return dir.applyEuler(new THREE.Euler(state.pitch, state.yaw, 0, 'YXZ'));
}

// Ground mode: step a ballistic arc, raycasting each segment against collidables
function updateGroundArc(dir) {
  const { camera, raycaster, collidableObjects, parabolaLine, groundReticle } = engine;
  const { maxSteps, velocityPerDepth, gravity, dt } = CONFIG.groundArc;

  engine.airLaserRay.visible = false;
  engine.airGhostSphere.visible = false;
  parabolaLine.visible = true;
  groundReticle.visible = true;

  const points = [];
  let pos = camera.position.clone();
  const vel = dir.clone().multiplyScalar(state.depth * velocityPerDepth);
  let hit = null;
  points.push(pos.clone());

  for (let i = 0; i < maxSteps; i++) {
    const next = pos.clone().addScaledVector(vel, dt);
    vel.y -= gravity * dt;

    const step = next.clone().sub(pos);
    const stepLen = step.length();
    step.normalize();

    raycaster.set(pos, step);
    const hits = raycaster.intersectObjects(collidableObjects);
    if (hits.length > 0 && hits[0].distance <= stepLen) {
      hit = hits[0].point;
      points.push(hit.clone());
      break;
    }

    pos = next;
    points.push(pos.clone());

    if (pos.y <= 0) { // fallback ground plane
      hit = new THREE.Vector3(pos.x, 0, pos.z);
      break;
    }
  }

  const arr = parabolaLine.geometry.attributes.position.array;
  points.forEach((p, i) => { arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; });
  parabolaLine.geometry.setDrawRange(0, points.length);
  parabolaLine.geometry.attributes.position.needsUpdate = true;

  if (hit) {
    state.targetPos.copy(hit);
    groundReticle.position.copy(hit);
    state.isValidTarget = true;
    setReticleColor(CONFIG.colors.cyan);
  } else {
    state.isValidTarget = false;
    setReticleColor(CONFIG.colors.invalid);
  }
}

// Air mode: straight line out to `depth`, clamped above the floor
function updateAirVector(dir) {
  const { camera, airLaserRay, airGhostSphere } = engine;

  engine.parabolaLine.visible = false;
  engine.groundReticle.visible = false;
  airLaserRay.visible = true;
  airGhostSphere.visible = true;

  const target = camera.position.clone().addScaledVector(dir, state.depth);
  if (target.y < CONFIG.air.minHeight) target.y = CONFIG.air.minHeight;

  state.targetPos.copy(target);
  airGhostSphere.position.copy(target);

  const positions = new Float32Array([
    camera.position.x, camera.position.y + CONFIG.air.laserYOffset, camera.position.z,
    target.x, target.y, target.z,
  ]);
  airLaserRay.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  airLaserRay.geometry.computeBoundingSphere();
  airLaserRay.computeLineDistances();

  state.isValidTarget = true;
}

export function updateTeleportTrajectory() {
  if (state.isTeleporting) return;
  const dir = aimDirection();
  if (state.mode === 'GROUND') updateGroundArc(dir);
  else updateAirVector(dir);
}
