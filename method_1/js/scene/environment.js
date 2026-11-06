import { CONFIG } from '../config.js';
import { engine } from '../core/state.js';

const { cyan, magenta } = CONFIG.colors;

// Pillars (collidable) with a glowing cap strip, plus sky platforms with glowing rims
export function createEnvironmentStructures() {
  const { scene, collidableObjects } = engine;

  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, roughness: 0.3, metalness: 0.8, emissive: 0x003344, emissiveIntensity: 0.2,
  });
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b, roughness: 0.2, metalness: 0.9, emissive: 0x4c1d95, emissiveIntensity: 0.4,
  });

  CONFIG.pillars.forEach(([x, y, z, w, h, d]) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), pillarMat);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    collidableObjects.push(mesh);

    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(w * 1.02, 0.2, d * 1.02),
      new THREE.MeshBasicMaterial({ color: cyan })
    );
    strip.position.set(x, y * 2 - 0.1, z);
    scene.add(strip);
  });

  CONFIG.skyPlatforms.forEach(({ pos, size }) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), platformMat);
    mesh.position.set(...pos);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    collidableObjects.push(mesh);

    const rim = new THREE.Mesh(
      new THREE.RingGeometry(size[0] / 2 - 0.5, size[0] / 2, 32),
      new THREE.MeshBasicMaterial({ color: cyan, side: THREE.DoubleSide })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.set(pos[0], pos[1] + size[1] / 2 + 0.02, pos[2]);
    scene.add(rim);
  });
}

export function createFloatingAirRings() {
  CONFIG.ringHeights.forEach((h, idx) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3, 0.15, 16, 50),
      new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? cyan : magenta })
    );
    ring.position.set(Math.sin(idx) * 15, h, -Math.cos(idx) * 15 - 5);
    engine.scene.add(ring);
    engine.floatRings.push(ring);
  });
}

export function createStarfield() {
  const count = CONFIG.starCount;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 300;
    positions[i + 1] = Math.random() * 150;
    positions[i + 2] = (Math.random() - 0.5) * 300;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: cyan, size: 0.6, transparent: true, opacity: 0.6 });
  engine.starParticles = new THREE.Points(geo, mat);
  engine.scene.add(engine.starParticles);
}
