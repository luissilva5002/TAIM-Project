const $ = (id) => document.getElementById(id);

// Companion phone show/hide + Flutter WebSocket guide modal
export function initPanels() {
  const phone = $('phone-container');
  $('btn-toggle-phone').addEventListener('click', () => {
    phone.classList.toggle('translate-x-full');
    phone.classList.toggle('opacity-0');
  });

  const modal = $('modal-flutter');
  const open = () => modal.classList.remove('opacity-0', 'pointer-events-none');
  const close = () => modal.classList.add('opacity-0', 'pointer-events-none');

  $('btn-flutter-code').addEventListener('click', open);
  $('btn-close-modal').addEventListener('click', close);
  $('btn-close-modal-2').addEventListener('click', close);
}
