import { CONFIG } from '../config.js';
import { state, engine } from '../core/state.js';
import { executeTeleport } from '../teleport/execute.js';
import { setMode } from '../ui/modeSwitch.js';
import { syncDepthUI } from '../ui/hud.js';
import { resetCamera } from '../scene/setup.js';

const { min, max, keyStep, wheelStep } = CONFIG.depth;
const clampPitch = (p) => Math.max(-CONFIG.camera.pitchLimit, Math.min(CONFIG.camera.pitchLimit, p));
const clampDepth = (d) => Math.max(min, Math.min(max, d));

// Version 1: mouse drag to aim, wheel/keys for depth, Space/keys for actions
export function initPcControls() {
  const { container } = engine;
  let dragging = false;
  let last = { x: 0, y: 0 };

  container.addEventListener('mousedown', (e) => {
    dragging = true;
    last = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener('mouseup', () => { dragging = false; });

  container.addEventListener('mousemove', (e) => {
    if (!dragging || state.isTeleporting) return;
    state.yaw -= (e.clientX - last.x) * CONFIG.camera.mouseSensitivity;
    state.pitch = clampPitch(state.pitch - (e.clientY - last.y) * CONFIG.camera.mouseSensitivity);
    last = { x: e.clientX, y: e.clientY };
  });

  container.addEventListener('wheel', (e) => {
    state.depth = clampDepth(state.depth + e.deltaY * wheelStep);
    syncDepthUI();
  });

  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'Space': e.preventDefault(); executeTeleport(); break;
      case 'KeyG': setMode('GROUND'); break;
      case 'KeyF': setMode('AIR'); break;
      case 'KeyR': resetCamera(); break;
      case 'ArrowUp':
      case 'KeyW': state.depth = clampDepth(state.depth + keyStep); syncDepthUI(); break;
      case 'ArrowDown':
      case 'KeyS': state.depth = clampDepth(state.depth - keyStep); syncDepthUI(); break;
    }
  });
}
