import { state, engine } from './state.js';
import { updateTeleportTrajectory } from '../teleport/trajectory.js';
import { updateAltitude } from '../ui/hud.js';

export function animate() {
  requestAnimationFrame(animate);

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
