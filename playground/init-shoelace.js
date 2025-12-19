import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import '@shoelace-style/shoelace/dist/shoelace.js';

// Set the base path for Shoelace assets
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.1/cdn/');

// Wait for Shoelace to be ready, then render the icons
customElements.whenDefined('sl-icon').then(() => {
  // Replace the placeholder buttons with proper Shoelace icons
  const buttonsContainer = document.querySelector('.buttons');
  if (buttonsContainer) {
    buttonsContainer.innerHTML = `
      <div class="toggle-button" onclick="toggleTray()">
        <sl-icon name="list"></sl-icon>
      </div>
      <div class="toggle-button" onclick="nextColor()">
        <sl-icon name="star-fill"></sl-icon>
      </div>
      <div class="toggle-button" onclick="toggleTheme()">
        <sl-icon name="moon"></sl-icon>
      </div>
    `;
  }
});

