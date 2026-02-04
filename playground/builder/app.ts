import './form-builder.js';

const existingLogo = document.querySelector('.glitch-logo');

if (!existingLogo) {
  const page = document.querySelector('.page');
  const container = document.createElement('div');
  container.className = 'glitch-logo';
  container.setAttribute('aria-hidden', 'true');

  const logoSources = [
    { id: 'logo1', className: 'glitch-logo__layer glitch-logo__layer--one', src: '../logo/1.svg' },
    { id: 'logo2', className: 'glitch-logo__layer glitch-logo__layer--two', src: '../logo/2.svg' },
    {
      id: 'logo3',
      className: 'glitch-logo__layer glitch-logo__layer--three',
      src: '../logo/3.svg',
    },
  ];

  for (const logo of logoSources) {
    const layer = document.createElement('div');
    layer.id = logo.id;
    layer.className = logo.className;
    layer.dataset.src = new URL(logo.src, import.meta.url).toString();
    container.appendChild(layer);
  }

  if (page) {
    page.prepend(container);
  } else {
    document.body.prepend(container);
  }

  void import('../logo/logo.js');
}
