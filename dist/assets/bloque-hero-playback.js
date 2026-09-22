/* Playback of a single rendered 3D scene. No drawn letter overlays. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let active = null;
  window.BloqueHeroPlayback = {
    init(root = document) {
      active?.destroy();
      active = null;
      const video = root.querySelector('video.bloque-hero-video');
      if (!video) return;
      const image = video.parentElement.querySelector('img.cover-image');
      let revealed = false, visible = true, ended = false, disposed = false;
      const finalImage = './assets/bloque-3d-filled-orange-4k.jpg';
      function settle() {
        ended = true;
        video.pause();
        image.src = finalImage;
        image.style.visibility = 'visible';
        video.style.visibility = 'hidden';
      }
      function sync() {
        if (disposed || ended) return;
        if (reduce.matches) { settle(); return; }
        if (!revealed || !visible || document.hidden) { video.pause(); return; }
        // Its first 1.5 seconds are a held raised pose, included in the render.
        video.play().then(() => {
          if (!disposed && !ended) image.style.visibility = 'hidden';
        }).catch(error => {
          // Pausing during a pending play() is normal when the tab goes away.
          if (!disposed && error.name !== 'AbortError') settle();
        });
      }
      function reveal() { revealed = true; sync(); }
      function finish() { ended = true; video.pause(); }
      function motionChanged() { if (reduce.matches) settle(); }
      video.muted = true;
      video.addEventListener('canplay', sync);
      video.addEventListener('ended', finish);
      video.addEventListener('error', settle);
      document.addEventListener('visibilitychange', sync);
      window.addEventListener('bloque:hero-revealed', reveal);
      reduce.addEventListener('change', motionChanged);
      const observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        sync();
      });
      observer.observe(video.parentElement);
      // Also support an in-site return when the entrance has already finished.
      const loader = document.querySelector('.loading-screen');
      if (!loader || getComputedStyle(loader).visibility === 'hidden') revealed = true;
      if (reduce.matches) settle();
      else sync();
      active = { destroy() {
        disposed = true;
        video.pause();
        observer.disconnect();
        video.removeEventListener('canplay', sync);
        video.removeEventListener('ended', finish);
        video.removeEventListener('error', settle);
        document.removeEventListener('visibilitychange', sync);
        window.removeEventListener('bloque:hero-revealed', reveal);
        reduce.removeEventListener('change', motionChanged);
      } };
    }
  };
})();
