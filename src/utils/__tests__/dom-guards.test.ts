import { describe, expect, it } from 'vitest';
import { isNamedElement, isValidatableElement } from '../dom-guards.js';

describe('dom-guards', () => {
  it('detects named elements', () => {
    const input = document.createElement('input');
    input.name = 'title';
    const div = document.createElement('div');

    expect(isNamedElement(input)).toBe(true);
    expect(isNamedElement(div)).toBe(false);
  });

  it('detects validatable elements', () => {
    const input = document.createElement('input');
    input.checkValidity = () => true;
    const div = document.createElement('div');

    expect(isValidatableElement(input)).toBe(true);
    expect(isValidatableElement(div)).toBe(false);
  });
});
