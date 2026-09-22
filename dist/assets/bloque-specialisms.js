(() => {
  let trigger = null;
  const dialogs = document.querySelectorAll('.bloque-specialism-dialog');

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-specialism]');
    if (!button) return;
    const dialog = document.getElementById(button.getAttribute('aria-controls'));
    if (!dialog || dialog.open) return;
    trigger = button;
    document.documentElement.classList.add('bloque-reading');
    dialog.showModal();
    dialog.scrollTop = 0;
  });

  dialogs.forEach((dialog) => {
    dialog.querySelector('[data-specialism-close]').addEventListener('click', () => dialog.close());
    // Only an actual backdrop click closes the reading panel.
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('bloque-reading');
      trigger?.focus({ preventScroll: true });
      trigger = null;
    });
  });
})();
