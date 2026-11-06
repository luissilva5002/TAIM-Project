// Entry point: wires the modules together.
// THREE and lucide are globals loaded from CDN <script> tags in index.html.

import { initScene, resizeScene } from './scene/setup.js';
import { initTeleportVisualizers } from './teleport/visualizers.js';
import { initPcControls } from './input/pcControls.js';
import { initCompanionControls } from './input/companionControls.js';
import { initPanels } from './ui/panels.js';
import { initSpeedOverlay, resizeSpeedOverlay } from './ui/speedOverlay.js';
import { animate } from './core/loop.js';

lucide.createIcons();

initScene(document.getElementById('canvas-container'));
initTeleportVisualizers();
initSpeedOverlay();
initPcControls();
initCompanionControls();
initPanels();

window.addEventListener('resize', () => {
  resizeScene();
  resizeSpeedOverlay();
});

animate();
