import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const cache = new Map();
export function getCEM(packageName) {
  if (!cache.has(packageName)) {
    const require = createRequire(import.meta.url);
    try {
      const customElementManifestPath = require.resolve(`${packageName}/dist/custom-elements-internal.json`);
      const customElementManifest = JSON.parse(readFileSync(customElementManifestPath, { encoding: 'utf-8' }));
      cache.set(packageName, customElementManifest);
    } catch (e) {
      const customElementManifestPath = require.resolve(`${packageName}/custom-elements.json`);
      const customElementManifest = JSON.parse(readFileSync(customElementManifestPath, { encoding: 'utf-8' }));
      cache.set(packageName, customElementManifest);
    }
  }
  const cem = cache.get(packageName);
  if (!cem) {
    throw new Error(`Could not load CEM for ${packageName}`);
  }
  return cem;
}
