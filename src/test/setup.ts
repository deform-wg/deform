const originalWarn = console.warn;
const originalHeadAppend = HTMLHeadElement.prototype.append;

function isShoelaceThemeUrl(url: string): boolean {
  return /https:\/\/cdn\.jsdelivr\.net\/npm\/@shoelace-style\/shoelace@[^/]+\/cdn\/themes\/(light|dark)\.css$/.test(
    url,
  );
}

HTMLHeadElement.prototype.append = function (...nodes: Array<Node | string>): void {
  for (const node of nodes) {
    if (node instanceof HTMLLinkElement && isShoelaceThemeUrl(node.href)) {
      node.href = 'data:text/css,';
    }
  }

  originalHeadAppend.apply(this, nodes);
};

console.warn = (...args: unknown[]) => {
  const first = args[0];
  if (typeof first === 'string' && first.includes('Lit is in dev mode')) {
    return;
  }
  originalWarn(...args);
};
