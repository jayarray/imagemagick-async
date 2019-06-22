let Path = require('path');
let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;

let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));
let Layer = require(Path.join(Filepath.LayerDir(), 'layer.js')).Layer;
let ImageCanvas = require(Path.join(Filepath.CanvasDir(), 'imagecanvas.js')).ImageCanvas;
let GetInfo = require(Path.join(Filepath.QueryInfoDir(), 'identify.js')).GetInfo;
let OrdinaryRenderer = require(Path.join(Filepath.RenderDir(), 'ordinaryrenderer.js')).OrdinaryRenderer;
let SpecialChainRenderer = require(Path.join(Filepath.RenderDir(), 'specialchainrenderer.js')).SpecialChainRenderer;
let SpecialCommandRenderer = require(Path.join(Filepath.RenderDir(), 'specialcommandrenderer.js')).SpecialCommandRenderer;
let SpecialProcedureRenderer = require(Path.join(Filepath.RenderDir(), 'specialprocedurerenderer.js')).SpecialProcedureRenderer;
let SpecialSequenceRenderer = require(Path.join(Filepath.RenderDir(), 'specialsequencerenderer.js')).SpecialSequenceRenderer;
let SpecialImageStackRenderer = require(Path.join(Filepath.RenderDir(), 'specialimagestackrenderer.js')).SpecialImageStackRenderer;

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
        specialRenderer = new SpecialChainRenderer();
      else if (subtype == 'command')
        specialRenderer = new SpecialCommandRenderer(l);
      else if (subtype == 'procedure')
        specialRenderer = new SpecialProcedureRenderer();
      else if (subtype == 'sequence')
        specialRenderer = new SpecialSequenceRenderer();
      else if (subtype == 'stack')
        specialRenderer = new SpecialImageStackRenderer();
      else {
        reject(`Failed to render: unknown special type "${subtype}".`);
        return;
      }

      specialRenderer.Render(layer, outputDir, format).then(tempFilepath => {

        // Get dimensions

        GetInfo(tempFilepath).then(infoObj => {
          let info = infoObj.info;
          let w = info.dimensions.width;
          let h = info.dimensions.height;

          // Process rendered image as an image canvas

          let imgCanvas = ImageCanvas.Builder
            .source(tempFilepath)
            .width(w)
            .height(h)
            .build();

          let originalArgs = layer.args;

          let tempLayer = Layer.Builder
            .foundation(imgCanvas)
            .overlays(originalArgs.overlays)
            .applyManyEffects(originalArgs.appliedEffects)
            .drawMany(originalArgs.primitives)
            .offset(originalArgs.offset)
            .gravity(originalArgs.gravity)
            .id(originalArgs.id);

          if (originalArgs.drawPrimitivesFirst)
            tempLayer = tempLayer.drawPrimitivesFirst();
          else
            tempLayer = tempLayer.applyEffectsFirst();

          tempLayer = tempLayer.build();

          let filename = Guid.Filename(Guid.DEFAULT_LENGTH, format);
          let outputPath = Path.join(outputDir, filename);

          let ordRenderer = OrdinaryRenderer.Builder
            .layer(tempLayer)
            .format(format)
            .outputPath(outputPath)
            .build();

          ordRenderer.Render(filepath => {
            resolve(filepath);
          }).catch(error => reject(`Special renderer failed: ${error}`));
        }).catch(error => reject(`Special renderer failed: ${error}`));
      }).catch(error => reject(error));
    });
  }
}

//----------------------------
// EXPORTS

exports.SpecialRenderer = SpecialRenderer;