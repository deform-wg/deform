export type NamedElement = Element & { name: string };

export function isNamedElement(node: Element): node is NamedElement {
  return 'name' in node && typeof (node as { name?: unknown }).name === 'string';
}

export type ValidatableElement = Element & { checkValidity: () => boolean };

export function isValidatableElement(node: Element): node is ValidatableElement {
  return 'checkValidity' in node && typeof (node as { checkValidity?: unknown }).checkValidity === 'function';
}

