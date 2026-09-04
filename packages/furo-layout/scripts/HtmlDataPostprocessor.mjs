#!/usr/bin/env node

/**
 * Post-processes dist/furo-layout.html-data.json (VS Code HTML custom data, produced
 * by cem-plugin-vs-code-custom-data-generator) so it is usable by lit-analyzer /
 * ts-lit-plugin via their `customHtmlData` option.
 *
 * Two fixes, both needed because the VS Code HTML data format is lossier than the
 * custom elements manifest:
 *
 * 1. The generator emits `"values": []` for every attribute without enumerated
 *    values. lit-analyzer turns any `values` array into a UNION type, so an empty
 *    array becomes an *empty* union and it reports `no-complex-attribute-binding`:
 *    "assigning the primitive '"foo"' to a non-primitive type ''". Removing the
 *    empty arrays lets it fall back to `{ kind: "ANY" }`. Non-empty lists are kept —
 *    they carry the real enums.
 *
 * 2. The format has no concept of events, so everything the manifest knows about
 *    them is dropped and consumers report `no-unknown-event` for each one.
 *    lit-analyzer derives events from attributes named `on<event>` — its
 *    attrsToEvents() strips the `on` prefix — so re-encode them that way.
 *
 * Reads the deep manifest at ./custom-elements.json (written by deep-cem.config.mjs
 * with outdir './').
 */

import fs from 'fs';

const HTML_DATA = './dist/furo-layout.html-data.json';
const MANIFEST = './custom-elements.json';

let data;
let manifest;
try {
  data = JSON.parse(fs.readFileSync(HTML_DATA));
  manifest = JSON.parse(fs.readFileSync(MANIFEST));
} catch (e) {
  console.log(e);
  process.exit(1);
}

if (!data.tags?.length) {
  console.log(`⚠️  ${HTML_DATA} contains no tags!`);
  process.exit(1);
}

const eventsByTag = new Map();
manifest.modules?.forEach(module => {
  module.declarations?.forEach(declaration => {
    if (declaration.tagName) {
      eventsByTag.set(declaration.tagName, declaration.events ?? []);
    }
  });
});

let stripped = 0;
let events = 0;

data.tags.forEach(tag => {
  tag.attributes ??= [];

  tag.attributes.forEach(attribute => {
    if (Array.isArray(attribute.values) && attribute.values.length === 0) {
      delete attribute.values;
      stripped++;
    }
  });

  const existing = new Set(tag.attributes.map(attribute => attribute.name));
  (eventsByTag.get(tag.name) ?? []).forEach(event => {
    if (!event.name || existing.has(`on${event.name}`)) {
      return;
    }
    tag.attributes.push({
      name: `on${event.name}`,
      description: event.description ?? `Fired on "${event.name}".`,
    });
    events++;
  });
});

fs.writeFileSync(HTML_DATA, JSON.stringify(data));

console.log(`✅  Postprocessing of furo-layout.html-data.json (${data.tags.length} tags, ${events} events, ${stripped} empty value sets stripped)`);
