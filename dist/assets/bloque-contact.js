(() => {
  'use strict';
  const element = document.getElementById('bloque-contact-map');
  if (!element || !window.L) return;
  function createMap() {
    // BAG address centroid, verified through PDOK for Westerkade 31A, 3016CM.
    const office = [51.90520213, 4.47503497];
    const map = L.map(element, { scrollWheelZoom: false, zoomControl: false })
      .setView(office, 15);
    L.control.zoom({ position: 'topright', zoomInTitle: 'Inzoomen', zoomOutTitle: 'Uitzoomen' }).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap-bijdragers</a>'
    }).addTo(map);
    const pin = L.divIcon({
      className: 'bloque-contact__pin', iconSize: [36, 48], iconAnchor: [18, 46], popupAnchor: [0, -38],
      html: '<svg width="36" height="48" viewBox="0 0 36 48" aria-hidden="true"><path d="M18 1C8.6 1 1 8.6 1 18c0 12 17 28 17 28s17-16 17-28C35 8.6 27.4 1 18 1Z" fill="#ff4600" stroke="#fff" stroke-width="2"/><circle cx="18" cy="18" r="6" fill="#fff"/></svg>'
    });
    L.marker(office, { icon: pin, title: 'BLOQUE Vastgoed B.V. — Westerkade 31/A', alt: 'BLOQUE Vastgoed B.V.' })
      .addTo(map)
      .bindPopup('<strong>BLOQUE Vastgoed B.V.</strong><br>Westerkade 31/A<br>3016 CM Rotterdam');
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(element);
  }
  // Request map tiles only when the contact map enters the viewport.
  const visible = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    visible.disconnect();
    createMap();
  });
  visible.observe(element);
})();
