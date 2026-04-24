// Chaos Icons Animation
(function() {
  const chaosIcons = document.querySelectorAll('.chaos-icon');
  const chaosContainer = document.querySelector('.chaos-icons');

  if (!chaosContainer || chaosIcons.length === 0) return;

  function getContainerSize() {
    const rect = chaosContainer.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  let { width: containerWidth, height: containerHeight } = getContainerSize();

  const icons = Array.from(chaosIcons).map((icon, i) => {
    const speed = parseFloat(icon.dataset.speed) || 2;
    return {
      el: icon,
      x: Math.random() * (containerWidth - 48),
      y: Math.random() * (containerHeight - 48),
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      scale: 0.9 + Math.random() * 0.2,
      baseScale: 0.9 + Math.random() * 0.2,
      speed: speed
    };
  });

  let mouseX = -1000;
  let mouseY = -1000;
  let containerOffsetX = 0;
  let containerOffsetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Update container offset on scroll/resize
  function updateContainerOffset() {
    const rect = chaosContainer.getBoundingClientRect();
    containerOffsetX = rect.left;
    containerOffsetY = rect.top;
  }

  updateContainerOffset();
  window.addEventListener('scroll', updateContainerOffset);
  window.addEventListener('resize', () => {
    updateContainerOffset();
    const size = getContainerSize();
    containerWidth = size.width;
    containerHeight = size.height;
  });

  function animate() {
    icons.forEach(icon => {
      // Update position
      icon.x += icon.vx;
      icon.y += icon.vy;
      icon.rotation += icon.rotationSpeed;

      // Scale pulsing
      icon.scale = icon.baseScale + Math.sin(Date.now() * 0.002 + icon.x * 0.01) * 0.15;

      // Bounce off walls
      const maxX = containerWidth - 48;
      const maxY = containerHeight - 48;

      if (icon.x <= 0 || icon.x >= maxX) {
        icon.vx *= -1;
        icon.x = Math.max(0, Math.min(maxX, icon.x));
      }
      if (icon.y <= 0 || icon.y >= maxY) {
        icon.vy *= -1;
        icon.y = Math.max(0, Math.min(maxY, icon.y));
      }

      // Mouse repulsion (convert to container-relative coordinates)
      const iconCenterX = icon.x + 24;
      const iconCenterY = icon.y + 24;
      const mouseRelX = mouseX - containerOffsetX;
      const mouseRelY = mouseY - containerOffsetY;
      const dx = iconCenterX - mouseRelX;
      const dy = iconCenterY - mouseRelY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120 && distance > 0) {
        const force = (120 - distance) / 120;
        icon.vx += (dx / distance) * force * 0.8;
        icon.vy += (dy / distance) * force * 0.8;
      }

      // Apply friction
      icon.vx *= 0.985;
      icon.vy *= 0.985;

      // Ensure minimum velocity
      const minVel = icon.speed * 0.3;
      if (Math.abs(icon.vx) < minVel) icon.vx = (Math.random() - 0.5) * icon.speed;
      if (Math.abs(icon.vy) < minVel) icon.vy = (Math.random() - 0.5) * icon.speed;

      // Clamp max velocity
      const maxVel = icon.speed * 2;
      icon.vx = Math.max(-maxVel, Math.min(maxVel, icon.vx));
      icon.vy = Math.max(-maxVel, Math.min(maxVel, icon.vy));

      // Apply transforms
      icon.el.style.transform = `translate(${icon.x}px, ${icon.y}px) rotate(${icon.rotation}deg) scale(${icon.scale})`;
      icon.el.style.zIndex = '1';
    });

    requestAnimationFrame(animate);
  }

  animate();
})();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Pricing toggle
const pricingToggle = document.getElementById('pricingToggle');
const proPrice = document.getElementById('proPrice');
const proPeriod = document.getElementById('proPeriod');
const toggleLabels = document.querySelectorAll('.toggle-label');

if (pricingToggle) {
  pricingToggle.addEventListener('click', () => {
    pricingToggle.classList.toggle('active');
    const isYearly = pricingToggle.classList.contains('active');

    if (proPrice) {
      proPrice.textContent = isYearly ? '$72' : '$8';
    }
    if (proPeriod) {
      proPeriod.textContent = isYearly ? '/year' : '/month';
    }

    toggleLabels.forEach((label, i) => {
      if ((i === 0 && !isYearly) || (i === 1 && isYearly)) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });
  });
}

// Scroll animations (fade in on scroll)
const fadeElements = document.querySelectorAll('.feature-card, .pricing-card, .cta-container, .ai-container');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

fadeElements.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Set current year in footer
const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
