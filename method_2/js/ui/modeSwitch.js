import { state } from '../core/state.js';

const $ = (id) => document.getElementById(id);

const BADGE = 'px-2 py-0.5 rounded';
const BTN_INACTIVE = `${BADGE} text-slate-500 bg-slate-800/60`;

const MODES = {
  GROUND: {
    btnActive: `${BADGE} bg-cyan-500 text-slate-950`,
    hudText: 'GROUND ARC MODE',
    hudTextClass: 'font-tech text-lg font-bold text-cyan-300',
    icon: 'arrow-down-to-dot',
    iconClass: 'text-cyan-400 w-6 h-6',
    title: 'Ground Parabola Arc',
    desc: 'Projects a dynamic parabolic trajectory curve to ground surfaces. Land safely on terrain or elevated platforms.',
  },
  AIR: {
    btnActive: `${BADGE} bg-pink-600 text-white`,
    hudText: 'AIR FLIGHT MODE',
    hudTextClass: 'font-tech text-lg font-bold text-pink-400',
    icon: 'plane-takeoff',
    iconClass: 'text-pink-400 w-6 h-6',
    title: 'Air Flight Vector Mode',
    desc: 'Projects a linear forward laser ending in a volumetric ghost avatar. Teleport freely into 3D airspace at variable altitude.',
  },
};

export function setMode(newMode) {
  state.mode = newMode;
  const m = MODES[newMode];

  $('mon-mode-ground').className = newMode === 'GROUND' ? m.btnActive : BTN_INACTIVE;
  $('mon-mode-air').className = newMode === 'AIR' ? m.btnActive : BTN_INACTIVE;

  const hudText = $('hud-mode-text');
  hudText.textContent = m.hudText;
  hudText.className = m.hudTextClass;

  const icon = $('mode-icon-hud');
  icon.setAttribute('data-lucide', m.icon);
  icon.className = m.iconClass;

  $('mode-info-title').textContent = m.title;
  $('mode-info-desc').textContent = m.desc;

  lucide.createIcons();
}
