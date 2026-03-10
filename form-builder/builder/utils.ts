import type {
  FieldConfig,
  FormConfig,
  FormSection,
  FormValue,
  RevealOn,
  RevealOperator,
  SelectOption,
} from '../../src/typedefs/index.js';

export function cloneConfig(config: FormConfig): FormConfig {
  try {
    return structuredClone(config);
  } catch {
    return cloneFormConfig(config);
  }
}

function cloneFormConfig(config: FormConfig): FormConfig {
  return {
    ...config,
    sections: config.sections.map((section) => cloneSection(section)),
  };
}

function cloneSection(section: FormSection): FormSection {
  return {
    ...section,
    fields: section.fields.map((field) => cloneField(field)),
  };
}

function cloneField(field: FieldConfig): FieldConfig {
  if (field.type === 'select') {
    return {
      ...field,
      options: cloneOptions(field.options),
    };
  }

  if (field.type === 'radio') {
    return {
      ...field,
      options: cloneOptions(field.options),
    };
  }

  if (field.type === 'radioButton') {
    return {
      ...field,
      options: cloneOptions(field.options),
    };
  }

  if (field.type === 'toggleField') {
    return {
      ...field,
      labels: [...field.labels],
      fields: field.fields.map((nestedField) => cloneField(nestedField)),
    };
  }

  const cloned: FieldConfig = { ...field };
  if (Array.isArray(field.value)) {
    cloned.value = [...field.value];
  }

  return cloned;
}

function cloneOptions(options: SelectOption[]): SelectOption[] {
  return options.map((option) => ({ ...option }));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isFormValue(value: unknown): value is FormValue {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every((item) => typeof item === 'string' || typeof item === 'number');
  }
  return false;
}

export function isTabGroup(value: unknown): value is { show: (panel: string) => void } {
  if (!isRecord(value)) return false;
  const show = value.show;
  return typeof show === 'function';
}

export function isFormConfig(value: unknown): value is FormConfig {
  if (!isRecord(value)) return false;
  if (!Array.isArray(value.sections)) return false;
  return value.sections.every((section) => {
    if (!isRecord(section)) return false;
    if (typeof section.name !== 'string') return false;
    if (!Array.isArray(section.fields)) return false;
    return section.fields.every((field) => {
      if (!isRecord(field)) return false;
      return typeof field.name === 'string' && typeof field.type === 'string';
    });
  });
}

export function toOptionalNumber(value: FormValue | undefined): number | undefined {
  if (typeof value === 'number') return Number.isNaN(value) ? undefined : value;
  if (typeof value === 'string') {
    if (!value.trim()) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

export function toOptionalString(value: FormValue | undefined): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return undefined;
}

export function toOptionalBoolean(value: FormValue | undefined): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return undefined;
}

function isRevealOperator(value: unknown): value is RevealOperator {
  return value === '=' || value === '!=';
}

export function parseRevealOn(raw: FormValue | undefined): RevealOn | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 3) return undefined;
    const [target, operator, value] = parsed;
    if (typeof target !== 'string') return undefined;
    if (!isRevealOperator(operator)) return undefined;
    if (!isFormValue(value)) return undefined;
    return [target, operator, value];
  } catch {
    return undefined;
  }
}

export function stringifyRevealOn(revealOn: RevealOn | undefined): string {
  if (!revealOn) return '';
  if (Array.isArray(revealOn)) {
    return JSON.stringify(revealOn);
  }
  return '';
}

export function levenshtein(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;
  const matrix = Array.from({ length: aLen + 1 }, () => Array(bLen + 1).fill(0));
  for (let i = 0; i <= aLen; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= bLen; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= aLen; i += 1) {
    for (let j = 1; j <= bLen; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[aLen][bLen];
}

export function suggestKey(unknownKey: string, knownKeys: string[]): string | null {
  let best: { key: string; distance: number } | null = null;
  for (const key of knownKeys) {
    const distance = levenshtein(unknownKey, key);
    if (!best || distance < best.distance) {
      best = { key, distance };
    }
  }
  if (!best) return null;
  return best.distance <= 2 ? best.key : null;
}
