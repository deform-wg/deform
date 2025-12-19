const logoContainer = document.getElementById('logo');
const logos = {
  1: document.getElementById('logo1'),
  2: document.getElementById('logo2'),
  3: document.getElementById('logo3')
};
let autoAnimationTimeout;

function showLogo(num) {
  Object.values(logos).forEach(logo => logo.style.display = 'none');
  logos[num].style.display = 'block';
}

// Hover animation
logoContainer.addEventListener('mouseenter', () => showLogo(2));
logoContainer.addEventListener('mouseleave', () => showLogo(1));

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

startAutoAnimation();

function cleanup() {
  clearTimeout(autoAnimationTimeout);
}

function changeLogoColor(options) {
  ['logo1', 'logo2', 'logo3'].forEach(id => {
    const svg = document.getElementById(id).contentDocument;
    const style = svg.querySelector('style');
    style.textContent = `.cls-1 { fill: ${options.hex} !important; }`;
  });
}