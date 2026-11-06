import { CONFIG } from '../config.js';
import { engine } from '../core/state.js';

const { cyan, magenta, green } = CONFIG.colors;

function ringMesh(inner, outer, color, opacity) {
  const m = new THREE.Mesh(
    new THREE.RingGeometry(inner, outer, 32),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity })
  );
  m.rotation.x = Math.PI / 2;
  return m;
}

// Ground mode: parabola line + landing reticle
function createGroundVisuals() {
  const maxPoints = CONFIG.groundArc.maxSteps + 10;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxPoints * 3), 3));
  engine.parabolaLine = new THREE.Line(
    geo,
    new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0.9 })
  );
  engine.scene.add(engine.parabolaLine);

  const reticle = new THREE.Group();
  reticle.add(ringMesh(0.8, 1.0, cyan, 0.8));
  reticle.add(ringMesh(0.3, 0.4, green, 0.9));

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 4, 32, 1, true),
    new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
  );
  beam.position.y = 2;
  reticle.add(beam);

  engine.groundReticle = reticle;
  engine.scene.add(reticle);
}

// Air mode: dashed laser + wireframe ghost sphere
function createAirVisuals() {
  const laserGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]);
  engine.airLaserRay = new THREE.Line(
    laserGeo,
    new THREE.LineDashedMaterial({ color: magenta, dashSize: 0.5, gapSize: 0.2 })
  );
  engine.scene.add(engine.airLaserRay);

  const ghost = new THREE.Group();
  ghost.add(new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.9, 2),
    new THREE.MeshBasicMaterial({ color: magenta, wireframe: true, transparent: true, opacity: 0.7 })
  ));
  ghost.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 16, 16),
    new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.8 })
  ));
  engine.airGhostSphere = ghost;
  engine.scene.add(ghost);
}

export function initTeleportVisualizers() {
  createGroundVisuals();
  createAirVisuals();
}

export function setReticleColor(hex) {
  engine.groundReticle.children.forEach((c) => c.material && c.material.color.setHex(hex));
}

export function hideAllIndicators() {
  engine.parabolaLine.visible = false;
  engine.groundReticle.visible = false;
  engine.airLaserRay.visible = false;
  engine.airGhostSphere.visible = false;
}
