const $ = (id) => document.getElementById(id);

export function toggleMonitor() {
  const el = $('monitor-container');
  el.classList.toggle('translate-x-full');
  el.classList.toggle('opacity-0');
}

// Button is optional; every action has a key.
export function initPanels() {
  $('btn-toggle-monitor').addEventListener('click', toggleMonitor);
}
