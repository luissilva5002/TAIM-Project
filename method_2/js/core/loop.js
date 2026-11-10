import { state, engine } from './state.js';
import { updateTeleportTrajectory } from '../teleport/trajectory.js';
import { updateAltitude } from '../ui/hud.js';
import { updateInputMonitor } from '../ui/inputMonitor.js';
import { updateKeyboard, isHeld } from '../input/keyboardControls.js';

let last = performance.now();

export function animate(now = performance.now()) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  updateKeyboard(dt);
  updateInputMonitor(isHeld);

  const { camera, renderer, scene, groundReticle, airGhostSphere, floatRings } = engine;

  camera.quaternion.setFromEuler(new THREE.Euler(state.pitch, state.yaw, 0, 'YXZ'));
  updateAltitude();

  if (groundReticle) groundReticle.rotation.y += 0.02;
  if (airGhostSphere) {
    airGhostSphere.rotation.y += 0.03;
    airGhostSphere.rotation.x += 0.01;
  }
  floatRings.forEach((ring, i) => { ring.rotation.z += 0.01 * (i % 2 === 0 ? 1 : -1); });

  updateTeleportTrajectory();
  renderer.render(scene, camera);
}
