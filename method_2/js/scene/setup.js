import { CONFIG } from '../config.js';
import { state, engine } from '../core/state.js';
import { createEnvironmentStructures, createFloatingAirRings, createStarfield } from './environment.js';

function createGridTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0a101d';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 512, 512);
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 32; i < 512; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 20);
  return tex;
}

function addLights(scene) {
  scene.add(new THREE.AmbientLight(0x1a2638, 1.5));

  const dir = new THREE.DirectionalLight(CONFIG.colors.cyan, 2.0);
  dir.position.set(20, 50, 20);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  scene.add(dir);

  const magenta = new THREE.PointLight(CONFIG.colors.magenta, 3, 40);
  magenta.position.set(-15, 10, -15);
  scene.add(magenta);
}

function addGround(scene) {
  const size = CONFIG.scene.groundSize;
  const mat = new THREE.MeshStandardMaterial({ map: createGridTexture(), roughness: 0.4, metalness: 0.6 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(size, size, 100, 100), mat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  engine.collidableObjects.push(ground);

  const grid = new THREE.GridHelper(size, 100, CONFIG.colors.cyan, 0x1e293b);
  grid.position.y = 0.01;
  scene.add(grid);
}

export function initScene(container) {
  engine.container = container;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CONFIG.scene.background);
  scene.fog = new THREE.FogExp2(CONFIG.scene.background, CONFIG.scene.fogDensity);
  engine.scene = scene;

  const { fov, near, far, start } = CONFIG.camera;
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.set(start.x, start.y, start.z);
  engine.camera = camera;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  engine.renderer = renderer;

  engine.raycaster = new THREE.Raycaster();

  addLights(scene);
  addGround(scene);
  createEnvironmentStructures();
  createFloatingAirRings();
  createStarfield();
}

export function resetCamera() {
  const { start } = CONFIG.camera;
  engine.camera.position.set(start.x, start.y, start.z);
  state.pitch = 0;
  state.yaw = 0;
}

export function resizeScene() {
  const { camera, renderer } = engine;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
