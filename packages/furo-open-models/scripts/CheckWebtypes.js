#!/usr/bin/env node

import fs from 'fs';

let rawdata = fs.readFileSync('./web-types.json');
try {
  JSON.parse(rawdata);
} catch (e) {
  console.log('⚠️  Syntax Error in WebTypes Json!');
  process.exit(1);
}


console.log('✅  WebTypes Json is valid.');
