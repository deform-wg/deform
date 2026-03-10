const originalWarn = console.warn;

console.warn = (...args: unknown[]) => {
  const first = args[0];
  if (typeof first === 'string' && first.includes('Lit is in dev mode')) {
    return;
  }
  originalWarn(...args);
};
