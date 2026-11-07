// Gentle falling snow behind the page content. Sparser and slower for people who ask for reduced motion.
(function () {
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0';
  document.body.prepend(c);
  document.querySelectorAll('body > :not(canvas)').forEach(function (el) {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.zIndex = el.style.zIndex || '1';
  });
  var ctx = c.getContext('2d'), w, h, dpr, flakes = [];
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
    var n = Math.round(Math.min(110, innerWidth / 8) * (calm ? 0.4 : 1));
    while (flakes.length < n) flakes.push(make(true));
    flakes.length = n;
  }
  function make(anywhere) {
    var r = (Math.random() * 2.2 + 0.8) * dpr;
    return { x: Math.random() * w, y: anywhere ? Math.random() * h : -10 * dpr, r: r,
      vy: (0.35 + r / dpr * 0.35) * dpr * (calm ? 0.4 : 1), drift: Math.random() * Math.PI * 2,
      a: 0.35 + Math.random() * 0.5 };
  }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.drift += 0.01; f.y += f.vy; f.x += Math.sin(f.drift) * 0.4 * dpr;
      if (f.y > h + 10 * dpr) flakes[i] = f = make(false);
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + f.a + ')'; ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  addEventListener('resize', size);
  size(); tick();
})();
