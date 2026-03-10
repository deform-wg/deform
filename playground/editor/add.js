function toggleTheme() {
  const form = document.getElementById('myForm');
  form.theme = form.theme === 'dark' ? 'light' : 'dark';
  document.body.classList.toggle('light');

  const tray = document.getElementById('editorTray');
  tray.toggleDarkMode();
}

function nextColor() {
  const form = document.getElementById('myForm');
  const { accents, current } = form.getAccents();

  // Find next colour, cycling to start if at end of array.
  const currentIndex = accents.findIndex((accent) => accent.name === current.name);
  const nextIndex = (currentIndex + 1) % accents.length;

  // Set new accent colour
  form.accent = accents[nextIndex].name;

  // Little bit fancy, tweak logo colour.
  changeLogoColor({ hex: accents[nextIndex].hex });

  // Update editor
  const editorTray = document.getElementById('editorTray');
  editorTray.reflectAccent(accents[nextIndex].name);
}

function toggleTray() {
  const tray = document.getElementById('editorTray');
  tray.toggle();
}

document.addEventListener('deform-value-change', (e) => {
  console.log('"deform-value-change" event occurred', e.detail);

  // Do a thing when the editor picks a new accent.
  if (e.detail.fieldName === 'accent') {
    const form = document.getElementById('myForm');

    // set demo form accent
    form.accent = e.detail.newValue;

    // change logo color.
    const { current } = form.getAccents();
    changeLogoColor({ hex: current.hex });
  }
});
