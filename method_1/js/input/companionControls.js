import { CONFIG } from '../config.js';
import { state } from '../core/state.js';
import { executeTeleport } from '../teleport/execute.js';
import { setMode } from '../ui/modeSwitch.js';

const $ = (id) => document.getElementById(id);

// Version 2: simulated Flutter phone (aim pad, depth slider, mode + teleport buttons).
// A real WebSocket transport would feed the same state/actions from here.
export function initCompanionControls() {
  const pad = $('aim-pad');
  const puck = $('aim-puck');
  let touching = false;

  function handlePadMove(clientX, clientY) {
    const rect = pad.getBoundingClientRect();
    let dx = clientX - (rect.left + rect.width / 2);
    let dy = clientY - (rect.top + rect.height / 2);
    const radius = rect.width / 2 - 15;

    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      dx = (dx / dist) * radius;
      dy = (dy / dist) * radius;
    }

    puck.style.transform = `translate(${dx}px, ${dy}px)`;

    const k = CONFIG.camera.padSensitivity;
    const lim = CONFIG.camera.pitchLimit;
    state.yaw -= (dx / radius) * k;
    state.pitch = Math.max(-lim, Math.min(lim, state.pitch - (dy / radius) * k));
  }

  const release = () => {
    touching = false;
    puck.style.transform = 'translate(0px, 0px)';
  };

  pad.addEventListener('mousedown', (e) => { touching = true; handlePadMove(e.clientX, e.clientY); });
  window.addEventListener('mousemove', (e) => { if (touching) handlePadMove(e.clientX, e.clientY); });
  window.addEventListener('mouseup', () => { if (touching) release(); });

  pad.addEventListener('touchstart', (e) => { touching = true; handlePadMove(e.touches[0].clientX, e.touches[0].clientY); });
  pad.addEventListener('touchmove', (e) => { if (touching) handlePadMove(e.touches[0].clientX, e.touches[0].clientY); });
  pad.addEventListener('touchend', release);

  $('phone-depth-slider').addEventListener('input', (e) => {
    state.depth = parseFloat(e.target.value);
    $('phone-depth-val').textContent = `${state.depth.toFixed(1)}m`;
  });

  $('phone-btn-ground').addEventListener('click', () => setMode('GROUND'));
  $('phone-btn-air').addEventListener('click', () => setMode('AIR'));
  $('phone-btn-teleport').addEventListener('click', executeTeleport);
}
