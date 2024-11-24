export default {
  plugins: [
    {
      name: 'furo',
      // Runs for all modules in a project, before continuing to the analyzePhase
      collectPhase({js, node, context}){},
      // Runs for each module
      analyzePhase({js, node, moduleDoc, context}){},
      // Runs for each module, after analyzing, all information about your module should now be available
      moduleLinkPhase({moduleDoc, context}){},
      // Runs after modules have been parsed and after post-processing
      packageLinkPhase({customElementsManifest, context}){},
    }
  ]
}
