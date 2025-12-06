#!/usr/bin/env node

import fs from "fs";
import {render} from "./render.js";
import {recursiveManifestResolver} from "./recursiveManifestResolver.js";

let count =0;
try {

let pkg =  process.argv[2] || "";
if(pkg.length === 0){
  console.error("please specify the package.");
  process.exit(1);
}
  const cem = recursiveManifestResolver(pkg);
let index = []
  cem.modules
    .filter(m => m.declarations.length > 0)
    .forEach(module => {
      module.declarations.forEach(clazz => {
        count++;
        if(clazz.tagName){
          index.push(`import "./${clazz.name}"`);
          const filecontents =render(clazz,pkg);
          fs.writeFileSync(`./src/JSX/${clazz.name}.ts`, filecontents);
          fs.writeFileSync(`./src/JSX/index.ts`, index.join('\n'));
        }
      });
    });
} catch (e) {
  console.log(e);
  process.exit(1);
}

console.log(`✅ ${count} Intrinsic elements generated`);
