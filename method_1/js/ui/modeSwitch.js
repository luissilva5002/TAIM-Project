import { state } from '../core/state.js';

const $ = (id) => document.getElementById(id);

const BTN_BASE = 'flex-1 py-1.5 rounded-lg text-xs font-tech font-bold transition';
const BTN_INACTIVE = `${BTN_BASE} text-slate-400 hover:text-white`;

const MODES = {
  GROUND: {
    btnActive: `${BTN_BASE} bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]`,
    hudText: 'GROUND ARC MODE',
    hudTextClass: 'font-tech text-lg font-bold text-cyan-300',
    icon: 'arrow-down-to-dot',
    iconClass: 'text-cyan-400 w-6 h-6',
    title: 'Ground Parabola Arc',
    desc: 'Projects a dynamic parabolic trajectory curve to ground surfaces. Land safely on terrain or elevated platforms.',
  },
  AIR: {
    btnActive: `${BTN_BASE} bg-magenta-500 text-white bg-pink-600 shadow-[0_0_10px_rgba(255,0,127,0.4)]`,
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

  $('phone-btn-ground').className = newMode === 'GROUND' ? m.btnActive : BTN_INACTIVE;
  $('phone-btn-air').className = newMode === 'AIR' ? m.btnActive : BTN_INACTIVE;

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
