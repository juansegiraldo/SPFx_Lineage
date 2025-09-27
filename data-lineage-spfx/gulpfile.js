'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.externals = generatedConfiguration.externals || {};
    generatedConfiguration.externals['cytoscape'] = {
      path: 'https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.js',
      globalName: 'cytoscape'
    };

    // Add dagre and cytoscape-dagre as externals to ensure layout plugin is available in production
    generatedConfiguration.externals['dagre'] = {
      path: 'https://unpkg.com/dagre@0.8.5/dist/dagre.min.js',
      globalName: 'dagre'
    };
    generatedConfiguration.externals['cytoscape-dagre'] = {
      path: 'https://unpkg.com/cytoscape-dagre@2.5.0/cytoscape-dagre.js',
      globalName: 'cytoscapeDagre'
    };

    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));