import { CONFIG } from '../config.js';
import { state } from '../core/state.js';

const $ = (id) => document.getElementById(id);
const deg = (r) => (r * 180) / Math.PI;

let keycaps = [];

export function initInputMonitor() {
  keycaps = [...document.querySelectorAll('.keycap')];
}

// Per-frame: light pressed keys, rotate dial, fill gauges
export function updateInputMonitor(isHeld) {
  keycaps.forEach((el) => el.classList.toggle('active', isHeld(el.dataset.key) || (el.dataset.key === 'ShiftLeft' && isHeld('ShiftRight'))));

  const yaw = ((-deg(state.yaw) % 360) + 360) % 360; // compass heading, 0 = start direction
  const pitch = deg(state.pitch);
  $('mon-needle').setAttribute('transform', `rotate(${yaw})`);
  $('mon-yaw').textContent = `${yaw.toFixed(0)}°`;
  $('mon-pitch').textContent = `${pitch >= 0 ? '+' : ''}${pitch.toFixed(0)}°`;

  const half = deg(CONFIG.camera.pitchLimit);
  const pct = Math.min(Math.abs(pitch) / half, 1) * 50;
  const bar = $('mon-pitch-bar');
  bar.style.left = pitch >= 0 ? '50%' : `${50 - pct}%`;
  bar.style.width = `${pct}%`;

  const { min, max } = CONFIG.depth;
  $('mon-depth-bar').style.width = `${((state.depth - min) / (max - min)) * 100}%`;
  $('mon-depth-val').textContent = `${state.depth.toFixed(1)}m`;
}
