import { getCEM } from './cem-reader.js';
const fieldsToMerge = ['members', 'slots', 'events', 'cssParts','attributes'];
const EXCLUDED_MEMBERS = new Set([
  'detachComponentStateFinalized',
  'attachComponentStateFinalized',
  'effectiveDir',
  'isUI5Element',
  'attachInvalidate',
  'define',
  'detachInvalidate',
  'fireEvent',
  'fireDecoratorEvent',
  'focus',
  'getDomRef',
  'getFocusDomRef',
  'getFocusDomRefAsync',
  'getMetadata',
  'getSlottedNodes',
  'getUniqueDependencies',
  'onAfterRendering',
  'onBeforeRendering',
  'onEnterDOM',
  'onExitDOM',
  'onInvalidation',
  'getStaticAreaItemDomRef'
]);
function mergeArraysWithoutDuplicates(currentValues, newValue) {
  if (!currentValues.find((currentValue) => currentValue.name === newValue.name)) {
    if (!EXCLUDED_MEMBERS.has(newValue.name)) {
      currentValues.push(newValue);
    }
  }
  return currentValues;
}
function getSuperClassDeclaration(declaration) {
  if (declaration.superclass) {
    const cem = getCEM(declaration.superclass.package);
    const mod = cem.modules.find((mod) => mod.path === declaration.superclass.module);
    if (mod) {
      return mod.declarations?.find((decl) => decl.name === declaration.superclass.name) ?? null;
    }
  }
  return null;
}
function resolveTree(declaration, acc = []) {
  const superclass = getSuperClassDeclaration(declaration);
  if (superclass) {
    acc.push(superclass);
    resolveTree(superclass, acc);
  }
  return acc;
}
function resolveModule(mod) {
  for (const declaration of mod.declarations ?? []) {
    const customElementDeclaration = declaration;
    const superclasses = resolveTree(customElementDeclaration);
    for (const superClass of superclasses) {
      customElementDeclaration.description += "\n\n" + superClass.description;
      for (const field of fieldsToMerge) {
        const superClassFields = superClass[field];
        if (superClassFields) {
          customElementDeclaration[field] = superClassFields.reduce(
            mergeArraysWithoutDuplicates,
            customElementDeclaration[field] ?? []
          );
        }
      }
    }
  }
}
export function recursiveManifestResolver(pkgName) {
  const customElementManifest = getCEM(pkgName);
  for (const module of customElementManifest.modules) {
    resolveModule(module);
  }
  return customElementManifest;
}
