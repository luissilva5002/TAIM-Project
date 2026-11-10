import { CONFIG } from '../config.js';
import { state } from '../core/state.js';
import { executeTeleport } from '../teleport/execute.js';
import { setMode } from '../ui/modeSwitch.js';
import { toggleMonitor } from '../ui/panels.js';
import { resetCamera } from '../scene/setup.js';

// Method 2: keyboard only. No mouse, wheel, or touch input anywhere.
const AIM_RATE = 1.6;     // rad/s
const FINE_FACTOR = 0.3;  // while Shift is held
const DEPTH_RATE = 12;    // m/s

const held = new Set();
const PREVENT = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export function initKeyboardControls() {
  window.addEventListener('keydown', (e) => {
    if (PREVENT.includes(e.code)) e.preventDefault();
    if (e.repeat) return;
    held.add(e.code);

    switch (e.code) {
      case 'Space':
      case 'Enter': executeTeleport(); break;
      case 'KeyG': setMode('GROUND'); break;
      case 'KeyF': setMode('AIR'); break;
      case 'KeyR': resetCamera(); break;
      case 'KeyP': toggleMonitor(); break;
    }
  });
  window.addEventListener('keyup', (e) => held.delete(e.code));
  window.addEventListener('blur', () => held.clear());
}

export const isHeld = (code) => held.has(code);

const axis = (neg, pos) => (held.has(pos) ? 1 : 0) - (held.has(neg) ? 1 : 0);

// Called every frame with dt in seconds
export function updateKeyboard(dt) {
  const lim = CONFIG.camera.pitchLimit;
  const fine = held.has('ShiftLeft') || held.has('ShiftRight') ? FINE_FACTOR : 1;

  const ax = axis('ArrowLeft', 'ArrowRight'); // +1 = look right
  const ay = axis('ArrowDown', 'ArrowUp');    // +1 = look up

  if (!state.isTeleporting) {
    state.yaw -= ax * AIM_RATE * fine * dt;
    state.pitch = Math.max(-lim, Math.min(lim, state.pitch + ay * AIM_RATE * fine * dt));
  }

  const d = axis('KeyS', 'KeyW');
  if (d !== 0) {
    state.depth = Math.max(CONFIG.depth.min, Math.min(CONFIG.depth.max, state.depth + d * DEPTH_RATE * fine * dt));
  }

}
