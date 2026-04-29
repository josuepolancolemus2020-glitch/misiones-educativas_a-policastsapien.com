'use strict';

// Basic validator (no dependencies) for editorial workflow.
// It checks that JSON files can be parsed and contain required root keys.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const checks = [
  { file: 'js/data/frases.json', required: ['items'] },
  { file: 'js/data/subjects.json', required: [] },
  { file: 'js/data/levels.json', required: [] }
];

let hasError = false;

for (const check of checks) {
  const target = path.join(ROOT, check.file);
  try {
    const content = JSON.parse(fs.readFileSync(target, 'utf8'));
    for (const key of check.required) {
      if (!(key in content)) {
        hasError = true;
        console.error('[ERROR] Missing key "' + key + '" in ' + check.file);
      }
    }
    console.log('[OK]', check.file);
  } catch (err) {
    hasError = true;
    console.error('[ERROR]', check.file, '-', err.message);
  }
}

if (hasError) process.exit(1);
console.log('Contenido editorial base validado.');
