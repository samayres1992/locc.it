const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'node_modules', 'mutationobserver-shim', 'dist');
const expectedSource = path.join(distDir, 'MutationObserver.js');
const fallbackSource = path.join(distDir, 'mutationobserver.min.js');

try {
  if (!fs.existsSync(distDir)) {
    process.exit(0);
  }

  if (!fs.existsSync(expectedSource) && fs.existsSync(fallbackSource)) {
    fs.copyFileSync(fallbackSource, expectedSource);
    console.log('Created mutationobserver-shim/dist/MutationObserver.js to satisfy sourcemap references.');
  }
} catch (err) {
  console.warn('Unable to patch mutationobserver-shim sourcemap source:', err.message);
}
