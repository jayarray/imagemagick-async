let Path = require('path');
let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;

let SpecialChainRenderer = require(Filepath.RenderDir(), 'specialchainrenderer.js').SpecialChainRenderer;
let SpecialCommandRenderer = require(Filepath.RenderDir(), 'specialcommandrenderer.js').SpecialCommandRenderer;
let SpecialProcedureRenderer = require(Filepath.RenderDir(), 'specialprocedurerenderer.js').SpecialProcedureRenderer;
let SpecialSequenceRenderer = require(Filepath.RenderDir(), 'specialsequencerenderer.js').SpecialSequenceRenderer;

//--------------------------------------

class SpecialRenderer {
  constructor() {
  }

  Render(layer, outputDir, format) {
    return new Promise((resolve, reject) => {
      let foundation = layer.args.foundation;
      let subtype = foundation.subtype;
      let specialRenderer = null;

      if (subtype == 'chain')
        specialRenderer = SpecialChainRenderer(layer, outputDir, format);
      else if (subtype == 'command')
        specialRenderer = SpecialCommandRenderer(layer, outputDir, format);
      else if (subtype == 'procedure')
        specialRenderer = SpecialProcedureRenderer(layer, outputDir, format);
      else if (subtype == 'sequence')
        specialRenderer = SpecialSequenceRenderer(layer, outputDir, format);
      else {
        reject(`Failed to render: unknown special type "${subtype}".`);
        return;
      }

      specialRenderer.Render().then(tempFilepath => {
        resolve(tempFilepath);
      }).catch(error => reject(error));
    });
  }
}

//----------------------------
// EXPORTS

exports.SpecialRenderer = SpecialRenderer;