// Lightweight zero-dependency 3D Canvas Hero (Shield + Rotating ₹ + Orbiting Gold Coins)
// Respects prefers-reduced-motion, low-memory mobile, and pauses off-screen via IntersectionObserver.

export function mountHero3D(container) {
  if (!container) return () => {};

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const lowMemMobile =
    typeof window !== 'undefined' &&
    window.innerWidth < 480 &&
    typeof nav.deviceMemory === 'number' &&
    nav.deviceMemory <= 2;

  if (reducedMotion || lowMemMobile) {
    return () => {};
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas-overlay';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return () => {};
  }

  let width = 520;
  let height = 380;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let rafId = 0;
  let isVisible = true;
  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;

  function resize() {
    const rect = container.getBoundingClientRect();
    width = Math.max(rect.width || 520, 260);
    height = Math.max(rect.height || 380, 240);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  resize();

  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    pointerX = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointerY = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
  };
  container.addEventListener('pointermove', onPointerMove, { passive: true });

  const coins = [
    { rx: -0.34, ry: -0.26, phase: 0.2, speed: 1.05, size: 22 },
    { rx: 0.35, ry: -0.22, phase: 1.8, speed: 0.9, size: 19 },
    { rx: -0.31, ry: 0.27, phase: 3.3, speed: 1.15, size: 18 },
    { rx: 0.33, ry: 0.24, phase: 4.7, speed: 0.95, size: 24 },
  ];

  const startTime = performance.now();

  function drawShield(cx, cy, scale, tiltX, tiltY) {
    ctx.save();
    ctx.translate(cx + tiltX * 14, cy + tiltY * 10);
    ctx.scale(scale, scale);

    // Outer gold shield rim
    ctx.beginPath();
    ctx.moveTo(0, -104);
    ctx.lineTo(84, -72);
    ctx.quadraticCurveTo(86, 28, 0, 108);
    ctx.quadraticCurveTo(-86, 28, -84, -72);
    ctx.closePath();

    const rimGrad = ctx.createLinearGradient(-84, -104, 84, 108);
    rimGrad.addColorStop(0, '#F5D47A');
    rimGrad.addColorStop(0.5, '#D4A53A');
    rimGrad.addColorStop(1, '#9A711A');
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // Inner deep navy shield face
    ctx.beginPath();
    ctx.moveTo(0, -94);
    ctx.lineTo(75, -65);
    ctx.quadraticCurveTo(77, 24, 0, 96);
    ctx.quadraticCurveTo(-77, 24, -75, -65);
    ctx.closePath();

    const faceGrad = ctx.createLinearGradient(-70, -90, 70, 90);
    faceGrad.addColorStop(0, '#163B6E');
    faceGrad.addColorStop(1, '#091A32');
    ctx.fillStyle = faceGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 212, 122, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawCoin(x, y, radius, spin) {
    const scaleX = Math.max(0.18, Math.abs(Math.cos(spin)));
    ctx.save();
    ctx.translate(x, y);

    // Gold edge thickness
    ctx.beginPath();
    ctx.ellipse(2.5, 1.5, radius * scaleX, radius, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#8F6714';
    ctx.fill();

    // Main coin face
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * scaleX, radius, 0, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    grad.addColorStop(0, '#FBE294');
    grad.addColorStop(0.5, '#D4A53A');
    grad.addColorStop(1, '#A67A1E');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#FFF0B8';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    if (scaleX > 0.42) {
      ctx.fillStyle = '#6B4B0A';
      ctx.font = `700 ${Math.round(radius * 0.95)}px Poppins, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₹', 0, 1);
    }
    ctx.restore();
  }

  function drawRupee(cx, cy, t, tiltX, tiltY) {
    const spin = t * 1.1;
    const widthFactor = Math.max(0.24, Math.abs(Math.cos(spin)));
    ctx.save();
    ctx.translate(cx + tiltX * 22, cy + tiltY * 14 + Math.sin(t * 1.6) * 5);
    ctx.scale(widthFactor, 1);

    // Extruded shadow layer
    ctx.fillStyle = '#8B6514';
    ctx.font = '700 108px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₹', 5, 5);

    // Brushed gold face
    const grad = ctx.createLinearGradient(-40, -55, 40, 55);
    grad.addColorStop(0, '#FFF1BA');
    grad.addColorStop(0.45, '#D4A53A');
    grad.addColorStop(1, '#B3831E');
    ctx.fillStyle = grad;
    ctx.fillText('₹', 0, 0);
    ctx.restore();
  }

  function render(now) {
    if (!isVisible) return;
    const t = (now - startTime) * 0.001;
    smoothX += (pointerX - smoothX) * 0.08;
    smoothY += (pointerY - smoothY) * 0.08;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.5;
    const scale = Math.min(width / 460, height / 350, 1.15);

    // Subtle radial ambient glow behind emblem
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 175 * scale);
    glow.addColorStop(0, 'rgba(212, 165, 58, 0.24)');
    glow.addColorStop(1, 'rgba(11, 31, 58, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    drawShield(cx, cy, scale, smoothX, smoothY);
    drawRupee(cx, cy + 4 * scale, t, smoothX, smoothY);

    for (const c of coins) {
      const x = cx + c.rx * width + smoothX * 18;
      const y = cy + c.ry * height + Math.sin(t * c.speed + c.phase) * 10 + smoothY * 12;
      drawCoin(x, y, c.size * scale, t * c.speed + c.phase);
    }

    rafId = requestAnimationFrame(render);
  }

  const io = new IntersectionObserver(
    (entries) => {
      const visible = Boolean(entries[0]?.isIntersecting);
      if (visible && !isVisible) {
        isVisible = true;
        rafId = requestAnimationFrame(render);
      } else {
        isVisible = visible;
        if (!visible) cancelAnimationFrame(rafId);
      }
    },
    { threshold: 0.05 }
  );
  io.observe(container);

  const ro = new ResizeObserver(resize);
  ro.observe(container);

  canvas.style.opacity = '1';
  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    io.disconnect();
    ro.disconnect();
    container.removeEventListener('pointermove', onPointerMove);
    canvas.remove();
  };
}
