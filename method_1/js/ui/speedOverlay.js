import { CONFIG } from '../config.js';

let canvas, ctx;

export function initSpeedOverlay() {
  canvas = document.getElementById('speed-overlay');
  ctx = canvas.getContext('2d');
  resizeSpeedOverlay();
}

export function resizeSpeedOverlay() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function triggerSpeedOverlay(active) {
  if (!active) {
    canvas.style.opacity = '0';
    return;
  }

  canvas.style.opacity = '1';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 2;

  for (let i = 0; i < CONFIG.warp.speedLines; i++) {
    const angle = Math.random() * Math.PI * 2;
    const d1 = 100 + Math.random() * 200;
    const d2 = d1 + 150 + Math.random() * 100;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * d1, cy + Math.sin(angle) * d1);
    ctx.lineTo(cx + Math.cos(angle) * d2, cy + Math.sin(angle) * d2);
    ctx.stroke();
  }
}
