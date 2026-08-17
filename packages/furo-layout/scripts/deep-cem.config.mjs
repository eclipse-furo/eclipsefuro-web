import { generateCustomData } from 'cem-plugin-vs-code-custom-data-generator';
import { customElementJetBrainsPlugin } from 'custom-element-jet-brains-integration';
import path from 'path';
import fs from 'fs';

let typeChecker;
let typeProgram;

const nullSafeLocaleCompare = (a, b) => {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
  if (b === null || b === undefined) return 1;
  return a.localeCompare(b);
};

export default {
  globs: ['./src/**/*.ts'],
  exclude: ['./dist/**/*', './test/**/*'],
  outdir: './',
  dev: false,
  litelement: true,
  dependencies: true,
  overrideModuleCreation: ({ ts, globs }) => {
    typeProgram = ts.createProgram(globs, {
      noEmitOnError: false,
      allowJs: true,
      experimentalDecorators: true,
      target: 99,
      downlevelIteration: true,
      module: 99,
      strictNullChecks: true,
      moduleResolution: 3,
      esModuleInterop: true,
      noEmit: true,
      pretty: true,
      allowSyntheticDefaultImports: true,
      allowUnreachableCode: true,
      allowUnusedLabels: true,
      skipLibCheck: true,
    });
    typeChecker = typeProgram.getTypeChecker();

    return globs.map(glob => {
      const fullPath = path.resolve(process.cwd(), glob);
      const source = fs.readFileSync(fullPath).toString();

      return ts.createSourceFile(glob, source, ts.ScriptTarget.ES2015, true);
    });
  },
  mergeDescription: true,
  fast: false,
  stencil: false,
  catalyst: false,
  plugins: [
    {
      // Make sure to always give your plugins a name, this helps when debugging
      name: "deep-cem",
      // Runs before analysis starts
      initialize({ ts, customElementsManifest, context }) {},
      // Runs for all modules in a project, before continuing to the `analyzePhase`
      collectPhase({ ts, node, context }) {},
      // Runs for each module
      analyzePhase({ ts, node, moduleDoc, context }) {
        switch (node.kind) {
          case ts.SyntaxKind.ClassDeclaration:
            const currDocDeclaration = moduleDoc?.declarations?.find(declaration => {
              return declaration?.name?.toString() === node?.name?.escapedText;
            });

            // event refs
            node.jsDoc?.forEach((docBlock) => {
              docBlock?.tags?.forEach((tag) => {

                // class annotation
                if (tag?.tagName.escapedText === "classref") {
                  tag?.text
                  const matches = /([^\s]+)\s+-\s+"([^\/]+\/[^\/]+)\/(.*)"/.exec(tag.comment);
                  currDocDeclaration.superclass = {
                    "name": matches[1],
                    "package": matches[2],
                    "module": matches[3]
                  }
                }

                if (tag?.tagName.escapedText === "eventref") {
                  const matches = /^([^\s]+)\s+-\s+([^\s]+)\s+-\s+"([^\/]+\/[^\/]+)\/(.*)"/.exec(tag.comment);
                  if (matches !== null && matches.length === 5) {
                    // find event
                    const eventDoc = currDocDeclaration.events?.find(eventDoc => {
                        return eventDoc?.name?.toString() === matches[1];
                    });
                    if (eventDoc) {
                      if (!eventDoc.type["references"]) {
                        eventDoc.type["references"] = [];
                      }

                      eventDoc.type["references"].push(
                        {
                          "name": matches[2],
                          "package": matches[3],
                          "module": matches[4]
                      });
                    }
                  }
                }
              });
            });


            node.members?.forEach((member, memberIndex) => {
              switch (member.kind) {
                case ts.SyntaxKind.MethodDeclaration:
                  member?.jsDoc?.forEach((docBlock) => {
                    docBlock?.tags?.forEach((tag) => {
                      if (tag?.tagName.escapedText === "paramref") {
                        // find current member
                        const currDocMember = currDocDeclaration?.members?.find(docMember => {
                          return docMember?.name?.toString() === member?.name?.escapedText;
                        });
                        const matches = /^([^\s]+)\s+-\s+([^\s]+)\s+-\s+"([^\/]+\/[^\/]+)\/(.*)"/.exec(tag.comment);
                        if (matches !== null && matches.length === 5) {
                          // find correct parameters[p] from matches 1
                          const docParameter = currDocMember?.parameters.find(param => {
                              return param.name === matches[1];
                          });
                          if (!docParameter) {
                            console.log("\x1b[31m%s\x1b[0m", `Param ${matches[1]} does not exist on method ${member?.name?.escapedText} in module ${node?.name?.escapedText}`);
                            process.exit(1);
                          }
                          if (!docParameter.type["references"]) {
                            docParameter.type["references"] = [];
                          }

                          docParameter.type["references"].push(
                            {
                              "name": matches[2],
                              "package": matches[3],
                              "module": matches[4]
                          });
                        }
                      }else{
                        console.log(tag?.tagName.escapedText)
                      }
                    });
                  });
                  break;


                case ts.SyntaxKind.PropertyDeclaration:
                  member?.jsDoc?.forEach((docBlock) => {
                    docBlock?.tags?.forEach((tag) => {
                      if (tag?.tagName.escapedText === "typeref") {
                        // find current member
                        const currDocMember = currDocDeclaration?.members?.find(docMember => {
                          return docMember?.name?.toString() === member?.name?.escapedText;
                        });

                        if (!currDocMember.type["references"]) {
                          currDocMember.type["references"] = [];
                        }
                        const matches = /^([^\s]+)\s+-\s+"([^\/]+\/[^\/]+)\/(.*)"/.exec(tag.comment);
                        if (matches !== null && matches.length === 4) {
                          currDocMember.type["references"].push(
                            {
                              "name": matches[1],
                              "package": matches[2],
                              "module": matches[3]
                          });
                        }
                      }
                    });


                    // transform enum types to string list for attribute
                    const filename = node.getSourceFile().fileName;
                    const sourceFile = typeProgram.getSourceFile(filename);
                    const tsProgramClassNode = sourceFile.statements.find(statement => ts.isClassDeclaration(statement) && statement.name?.text === node.name?.text);
                    const tsProgramMember = tsProgramClassNode?.members.find(m => {
                        return ts.isPropertyDeclaration(m) && m.name?.text === member.name.escapedText;
                      }
                    );
                    const list = typeChecker.getTypeAtLocation(tsProgramMember).types?.map(t => {
                        if (t.value) {
                          return `"${t.value}"`;
                        }
                        return false;
                    }).filter(x => x);

                    const attributeValue = typeChecker.typeToString(typeChecker.getTypeAtLocation(tsProgramMember));
                    attributeValue;
                    if (list?.length && list.length > 0) {
                      const currDocMember = currDocDeclaration?.members?.find(docMember => {
                        return docMember?.name?.toString() === member?.name?.escapedText;
                      });
                      currDocMember.type.text = list.join(" | ");
                    }
                  });

                  break;

                case ts.SyntaxKind.SetAccessor:
                case ts.SyntaxKind.GetAccessor:
                  member?.jsDoc?.forEach((docBlock) => {
                    docBlock?.tags?.forEach((tag) => {
                      if (tag?.tagName.escapedText === "typeref") {
                        // find current member
                        const currDocMember = currDocDeclaration?.members?.find(docMember => {
                          return docMember?.name?.toString() === member?.name?.escapedText;
                        });

                        if(!currDocMember.type){
                          currDocMember.type = {"references":[] };
                          if(currDocMember.parameters.length > 0 && currDocMember.parameters[0].type){
                            currDocMember.type.text = currDocMember.parameters[0].type.text;
                          }
                        }

                        if (!currDocMember.type["references"]) {
                          currDocMember.type["references"] = [];
                        }

                        const matches = /^([^\s]+)\s+-\s+"([^\/]+\/[^\/]+)\/(.*)"/.exec(tag.comment);
                        console.log(matches !== null && matches.length === 5);
                        if (matches !== null && matches.length === 4) {
                          if(!currDocMember.type.text){
                            currDocMember.type.text = matches[1];
                          }
                          currDocMember.type["references"].push(
                            {
                              "name": matches[1],
                              "package": matches[2],
                              "module": matches[3]
                            });
                        }
                      }
                    });
                  });
                  break
              }


            });

            break;
        }


      },
      // Runs for each module, after analyzing, all information about your module should now be available
      moduleLinkPhase({ moduleDoc, context }) {
        moduleDoc.path = moduleDoc.path.replace(/src\/(.*).ts/, "dist/$1.js");
        const decl = moduleDoc.declarations[0];
        if (decl === undefined || decl.kind !== "class") {
          return;
        }

        // superclass
        if (decl.superclass?.name) {
          if (decl.superclass.name === "LitElement") {
            delete (decl.superclass);
          } else {
            const matches = /^(@[^\/]+\/[^\/]+)\/(.*)$/.exec(decl.superclass.package);
            if (matches !== null && matches.length === 3) {
              decl.superclass.package = matches[1];
              decl.superclass.module = matches[2];
            }
          }
        }


      },
      // Runs after modules have been parsed and after post-processing
      packageLinkPhase({ customElementsManifest, context }) {

        for (let i = 0; i < customElementsManifest.modules.length; i++) {
          const decl = customElementsManifest.modules[i].declarations[0];

          if (decl === undefined || decl.kind !== "class") {
            continue;
          }
          // The filenames do not start with Furo, the wrapper generator would create FuroXxxxComponents
          if (decl.name.startsWith("FuroUi5")) {
            decl.name = decl.name.replace(/^FuroUi5/, "");
          }

          if (decl.superclass?.module) {
            // Get superclass description and append it to this description
            let externalDoc;
            context.thirdPartyCEMs?.find((pkg) => {
              externalDoc = pkg.modules.find((m) => {
                return m.path === decl.superclass?.module;
              });
              return externalDoc;
            });
            // merge the descriptions
            if(externalDoc === undefined) {
              // check local cem for descriptions
              externalDoc = customElementsManifest.modules.find((m) => {
                return m.path === decl.superclass?.module;
              });
            }

            if (externalDoc?.declarations[0]?.description) {
              decl.description += "\n\n" + externalDoc.declarations[0]?.description;
            }else{
              console.log("No external doc for " , decl.name)
            }
          }

          // Replace inherited ui5 descriptions with furo in main description
          decl.description = decl.description
            .replaceAll("ui5-", "furo-ui5-")
            .replaceAll("@ui5/webcomponents/", "@furo/ui5/")
            .replaceAll("@ui5/webcomponents-fiori/", "@furo/ui5/");

          // Replace inherited ui5 descriptions with furo in attributes description
          decl.attributes?.map(attribute => {
            attribute.description = attribute.description?.replaceAll("ui5-", "furo-ui5-")
              .replaceAll("@ui5/webcomponents/", "@furo/ui5/")
              .replaceAll("@ui5/webcomponents-fiori/", "@furo/ui5/")
          });

          // Replace inherited ui5 descriptions with furo/ui5 in members description
          decl.members?.map(member => {
            member.description = member.description?.replaceAll("ui5-", "furo-ui5-")
              .replaceAll("@ui5/webcomponents/", "@furo/ui5/")
              .replaceAll("@ui5/webcomponents-fiori/", "@furo/ui5/")
          });
          // Replace inherited ui5 descriptions with furo/ui5 in events description
          decl.events?.map(event => {
            event.description = event.description?.replaceAll("ui5-", "furo-ui5-")
              .replaceAll("@ui5/webcomponents/", "@furo/ui5/")
              .replaceAll("@ui5/webcomponents-fiori/", "@furo/ui5/")
          });
        }

        /* sort as much as possible to avoid changes on generated files every time */
        for (const mod of customElementsManifest.modules) {
          for (const decl of mod.declarations) {

            decl.members?.sort((a, b) => nullSafeLocaleCompare(a.name, b.name));
            decl.attributes?.sort((a, b) => nullSafeLocaleCompare(a.name, b.name));
            decl.events?.sort((a, b) => nullSafeLocaleCompare(a.name, b.name));
            decl.mixins?.sort((a, b) => nullSafeLocaleCompare(a.name, b.name));
            decl.parameters?.sort((a, b) => nullSafeLocaleCompare(a.name, b.name));
          }
           mod.exports.sort((a, b) => nullSafeLocaleCompare(a.name, b.name))
        }
        customElementsManifest.modules.sort((a, b) => nullSafeLocaleCompare(a.path, b.path))
      }
    },
    generateCustomData({
      outdir: 'dist',
      cssFileName: null,
      cssPropertiesDocs: true,
      htmlFileName: 'furo-layout.html-data.json',
    }),
    customElementJetBrainsPlugin({
      outdir: './',
      defaultIcon: 'icon.svg',
      packageJson: true,
      // referenceTemplate: (name, tag) => {return {name:tag,"url":"xxxxxxx"} }
    }),
  ],
};
