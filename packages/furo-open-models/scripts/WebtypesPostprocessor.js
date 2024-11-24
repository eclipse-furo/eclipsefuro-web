#!/usr/bin/env node

import fs from "fs";

let wtraw = fs.readFileSync("./web-types.json");
let cemraw = fs.readFileSync("./custom-elements.json");

try {

  const wt = JSON.parse(wtraw);
  const cem = JSON.parse(cemraw);
  cem.modules.filter(m => m.declarations.length > 0).forEach(module => {
      module.declarations.forEach(clazz => {
        const wtModule = wt.contributions.html.elements.find(e => e.name === clazz.tagName);
        if (wtModule) {
          wtModule.js.methods = [];
          clazz.members.filter(m => m.kind === "method").forEach(method => {
            if (method.privacy === "public") {
              wtModule.js.methods.push(
                {
                  "name": method.name.replace(/([a-z])([A-Z])/g, "$1-$2")
                    .replace(/\s+/g, '-')
                    .toLowerCase(),
                  "description": method.description,
                  "value": {
                    "type": "string",
                    "required": true
                  }
                }
              );
            }
            // set priority for attributes
            wtModule.attributes = wtModule.attributes?.map(attr=>{
              attr.priority="high"
              return attr
            })
            // set priority for events
            wtModule.js.events = wtModule.js?.events?.map(event=>{
              event.priority="high"
              return event
            })
          });
        }
      });
    }
  );

  // write
  fs.writeFileSync("./web-types.json", JSON.stringify(wt));

} catch (e) {
  console.log(e);
  process.exit(1);
}


console.log("✅  Postprocessing of web-types.json");
