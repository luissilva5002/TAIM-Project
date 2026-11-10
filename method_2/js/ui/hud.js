import { state, engine } from '../core/state.js';

const $ = (id) => document.getElementById(id);

export function updateAltitude() {
  $('hud-altitude').textContent = `${engine.camera.position.y.toFixed(1)}m`;
}

export function updateHUDStats() {
  const { totalJumps, groundJumps, airJumps } = state.stats;
  $('hud-total-jumps').textContent = totalJumps;
  $('hud-jump-ratio').textContent = `${groundJumps} / ${airJumps}`;
}

export function updateStatusBadge(text, classNames) {
  const badge = $('teleport-status-badge');
  badge.textContent = text;
  badge.className = `px-3 py-1 rounded-md text-xs font-bold font-tech ${classNames}`;
}

