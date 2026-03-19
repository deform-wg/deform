import { getBasePath, setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

export type DeformTheme = 'light' | 'dark';
type ThemeTarget = Element;

// Shoelace version derived from package.json dependency
const SHOELACE_VERSION = '2.20.1';
const THEME_CLASS_BY_NAME = {
  light: 'sl-theme-light',
  dark: 'sl-theme-dark',
} satisfies Record<DeformTheme, string>;

function getDocument(): Document | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

function getThemeStylesheetHref(theme: DeformTheme): string {
  return `https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@${SHOELACE_VERSION}/cdn/themes/${theme}.css`;
}

function getThemeClassName(theme: DeformTheme): string {
  return THEME_CLASS_BY_NAME[theme];
}

export function ensureShoelaceBasePath(): void {
  const shoelaceBasePath = getBasePath();

  // Prefer a consumer-provided base path (e.g. via data-shoelace attribute). Fall back to CDN.
  if (!shoelaceBasePath || shoelaceBasePath === '/') {
    setBasePath(`https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@${SHOELACE_VERSION}/cdn/`);
  }
}

export function ensureThemeStyles(theme: DeformTheme): void {
  const currentDocument = getDocument();

  if (!currentDocument) {
    return;
  }

  const selector = `link[data-deform-shoelace-theme="${theme}"]`;
  const existingStylesheet = currentDocument.head.querySelector(selector);

  if (existingStylesheet) {
    return;
  }

  const link = currentDocument.createElement('link');
  link.rel = 'stylesheet';
  link.href = getThemeStylesheetHref(theme);
  link.dataset['deformShoelaceTheme'] = theme;
  currentDocument.head.append(link);
}

export function ensureAllThemeStyles(): void {
  ensureThemeStyles('light');
  ensureThemeStyles('dark');
}

export function applyThemeClass(theme: DeformTheme, target: ThemeTarget): void {
  ensureThemeStyles(theme);
  target.classList.remove(getThemeClassName('light'));
  target.classList.remove(getThemeClassName('dark'));
  target.classList.add(getThemeClassName(theme));
}
