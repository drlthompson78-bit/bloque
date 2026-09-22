(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.bloque-social').forEach((button) => {
    const icon = button.querySelector('.bloque-social__icon');
    let motion;

    function animateIcon() {
      if (reducedMotion.matches || !window.gsap || motion?.isActive()) return;

      // Monks' out/in hover: exit right, re-enter left; the circle stays fixed.
      const distance = button.offsetWidth * .75;
      motion = window.gsap.timeline();
      motion.to(icon, { x: distance, duration: .2, ease: 'power2.in' });
      motion.set(icon, { x: -distance });
      motion.to(icon, { x: 0, duration: .5, ease: 'power2.out', clearProps: 'transform' });
    }

    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') animateIcon();
    });
    button.addEventListener('focus', animateIcon);
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        motion?.kill();
        icon.style.removeProperty('transform');
      }
    });
    // Profile URLs are not available yet. These buttons deliberately have no click action.
  });
})();
