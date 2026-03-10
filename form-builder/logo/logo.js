const logoContainer = document.querySelector('.glitch-logo');
const logos = {
  1: document.getElementById('logo1'),
  2: document.getElementById('logo2'),
  3: document.getElementById('logo3'),
};

const logoSources = {
  logo1: new URL('./1.svg', import.meta.url).toString(),
  logo2: new URL('./2.svg', import.meta.url).toString(),
  logo3: new URL('./3.svg', import.meta.url).toString(),
};

let autoAnimationTimeout;

async function loadSvgLayer(logo) {
  if (!logo) return;
  const src = logoSources[logo.id] ?? logo.dataset.src ?? logo.dataset.mask;
  if (!src) return;
  try {
    const response = await fetch(src);
    if (!response.ok) return;
    const svgText = await response.text();
    const withoutXml = svgText.replace(/<\?xml[^>]*\?>\s*/i, '');
    const updatedSvgText = withoutXml.replace(
      /fill:\s*#0284c7\s*;/g,
      'fill: var(--logo-accent-color, var(--sl-color-primary-500, #0284c7));',
    );
    logo.innerHTML = updatedSvgText;
    const svg = logo.querySelector('svg');
    if (svg instanceof SVGElement) {
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
    }
  } catch (_error) {
    return;
  }
}

function syncAccentColor() {
  const formBuilder = document.querySelector('form-builder');
  if (!formBuilder) return;
  const accent = getComputedStyle(formBuilder).getPropertyValue('--sl-color-primary-500').trim();
  if (accent) {
    document.documentElement.style.setProperty('--logo-accent-color', accent);
  }
}

function showLogo(num) {
  Object.values(logos).forEach((logo) => {
    if (logo) {
      logo.style.display = 'none';
    }
  });
  if (logos[num]) {
    logos[num].style.display = 'block';
  }
}

if (logoContainer) {
  // Hover animation
  logoContainer.addEventListener('mouseenter', () => showLogo(2));
  logoContainer.addEventListener('mouseleave', () => showLogo(1));
}

// Periodic animation
function autoAnimate() {
  setTimeout(() => {
    showLogo(3);
    setTimeout(() => {
      showLogo(2);
      setTimeout(() => {
        showLogo(1);
      }, 200);
    }, 200);
  }, 200);
}

// Run animation every ~10 seconds
function startAutoAnimation() {
  autoAnimate();
  const offset = Math.random() * 3000;
  autoAnimationTimeout = setTimeout(startAutoAnimation, 10000 + offset);
}

async function initLayers() {
  for (const logo of Object.values(logos)) {
    await loadSvgLayer(logo);
  }
  syncAccentColor();
}

const formBuilder = document.querySelector('form-builder');
if (formBuilder) {
  const observer = new MutationObserver(() => syncAccentColor());
  observer.observe(formBuilder, { attributes: true, attributeFilter: ['accent', 'data-theme'] });
}

void initLayers();
showLogo(1);
startAutoAnimation();

function cleanup() {
  if (autoAnimationTimeout) {
    clearTimeout(autoAnimationTimeout);
  }
}

window.addEventListener('beforeunload', cleanup);
