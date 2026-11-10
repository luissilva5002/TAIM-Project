import { CONFIG } from '../config.js';
import { state, engine } from '../core/state.js';
import { hideAllIndicators } from './visualizers.js';
import { triggerSpeedOverlay } from '../ui/speedOverlay.js';
import { updateHUDStats, updateStatusBadge } from '../ui/hud.js';

const BADGE_WARP = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
const BADGE_READY = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

export function executeTeleport() {
  if (state.isTeleporting || !state.isValidTarget) return;

  const { camera } = engine;
  const { durationMs, fovPeak } = CONFIG.warp;
  const baseFov = CONFIG.camera.fov;

  state.isTeleporting = true;
  updateStatusBadge('WARPING...', BADGE_WARP);
  hideAllIndicators();

  const startPos = camera.position.clone();
  const endPos = state.targetPos.clone();
  if (state.mode === 'GROUND') endPos.y += CONFIG.groundArc.landingOffsetY;

  const startTime = performance.now();
  triggerSpeedOverlay(true);

  function step(now) {
    const progress = Math.min((now - startTime) / durationMs, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out

    camera.position.lerpVectors(startPos, endPos, ease);
    camera.fov = progress < 0.5
      ? baseFov + progress * 2 * (fovPeak - baseFov)
      : fovPeak - (progress - 0.5) * 2 * (fovPeak - baseFov);
    camera.updateProjectionMatrix();

    if (progress < 1) {
      requestAnimationFrame(step);
      return;
    }

    camera.position.copy(endPos);
    camera.fov = baseFov;
    camera.updateProjectionMatrix();

    state.isTeleporting = false;
    triggerSpeedOverlay(false);

    state.stats.totalJumps++;
    if (state.mode === 'GROUND') state.stats.groundJumps++;
    else state.stats.airJumps++;

    updateHUDStats();
    updateStatusBadge('READY', BADGE_READY);
  }

  requestAnimationFrame(step);
}
