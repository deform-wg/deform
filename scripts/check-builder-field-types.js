import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(process.cwd());
const CORE_TYPEDEFS = path.join(ROOT_DIR, 'src', 'typedefs', 'index.ts');
const BUILDER_REGISTRY = path.join(ROOT_DIR, 'form-builder', 'builder', 'field-registry.ts');

function readFileOrNull(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function extractCoreFieldTypes(source) {
  const types = new Set();
  const lines = source.split('\n');
  for (const line of lines) {
    if (!line.includes('type:')) continue;
    if (line.includes('type?:')) continue;
    if (!line.includes("'")) continue;
    const matches = line.matchAll(/'([^']+)'/g);
    for (const match of matches) {
      types.add(match[1]);
    }
  }
  return types;
}

function extractBuilderFieldTypes(source) {
  const orderMatch = source.match(/const FIELD_TYPE_ORDER[^[]*\[([\s\S]*?)\];/);
  if (!orderMatch) {
    return { types: new Set(), warning: 'FIELD_TYPE_ORDER not found in builder registry.' };
  }
  const body = orderMatch[1];
  const types = new Set();
  const matches = body.matchAll(/'([^']+)'/g);
  for (const match of matches) {
    types.add(match[1]);
  }
  return { types, warning: null };
}

function diffSets(a, b) {
  const missing = [];
  for (const value of a) {
    if (!b.has(value)) missing.push(value);
  }
  return missing.sort();
}

const coreSource = readFileOrNull(CORE_TYPEDEFS);
const builderSource = readFileOrNull(BUILDER_REGISTRY);

if (!coreSource || !builderSource) {
  console.warn('[builder-field-types] Unable to read source files.');
  if (!coreSource) console.warn(`- Missing: ${CORE_TYPEDEFS}`);
  if (!builderSource) console.warn(`- Missing: ${BUILDER_REGISTRY}`);
  process.exitCode = 0;
} else {
  const coreTypes = extractCoreFieldTypes(coreSource);
  const { types: builderTypes, warning } = extractBuilderFieldTypes(builderSource);

  if (warning) {
    console.warn(`[builder-field-types] ${warning}`);
  }

  const missingInBuilder = diffSets(coreTypes, builderTypes);
  const extraInBuilder = diffSets(builderTypes, coreTypes);

  if (!missingInBuilder.length && !extraInBuilder.length) {
    console.log('[builder-field-types] Builder field types match core typedefs.');
  } else {
    console.warn('[builder-field-types] Builder/core field types differ.');
    if (missingInBuilder.length) {
      console.warn(`- Missing in builder: ${missingInBuilder.join(', ')}`);
    }
    if (extraInBuilder.length) {
      console.warn(`- Extra in builder: ${extraInBuilder.join(', ')}`);
    }
  }
}
