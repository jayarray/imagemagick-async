let Path = require('path');
let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));

let SpecialRendererBaseClass = require(Path.join(Filepath.RenderDir(), 'specialrendererbaseclass.js')).SpecialRendererBaseClass;
let LinuxCommands = require('linux-commands-async');

//--------------------------------------

/**
 * Use when executing chain!
 * @param {Array} chainItems 
 * @param {string} tempDirPath 
 */
function ExecuteChain(chainItems, tempDirPath, format) {
  return new Promise((resolve, reject) => {
    if (chainItems.length == 0) {
      resolve();
      return;
    }

    let currItem = chainItems[0];
    let nextItems = chainItems.slice(1);

    if (currItem.type == 'string') {  // STRING
      let cmd = currItem.obj;

      LocalCommand.Execute(cmd, []).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        resolve(ExecuteChain(nextItems, tempDirPath, format));
      }).catch(error => reject(error));
    }
    else if (currItem.type == 'render') {  // RENDER
      let layer = currItem.obj;

      RenderLayer(layer, tempDirPath, format).then(recentFilepath => {

        // Move them back to intended location. (Previous function renames them by nature)
        LinuxCommands.Move.Move(recentFilepath, currItem.outputPath, LocalCommand).then(success => {

          resolve(ExecuteChain(nextItems, tempDirPath, format));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }
  });
}

/**
 * Use when rendering a chain!
 * @param {Layer} layer
 * @param {string} outputDir
 * @param {string} format
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function RenderChain(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let foundation = layer.args.foundation;
    let chain = foundation.Chain();
    let tempDirPath = chain.tempDirPath;
    let items = chain.items;
    let outputPath = chain.outputPath;

    // Create temp dir (from chain)
    LinuxCommands.Directory.Create(tempDirPath, LocalCommand).then(success => {

      // Execute chain
      ExecuteChain(items, tempDirPath, format).then(success => {

        // Get recent render info
        Identify.GetInfo(outputPath).then(info => {
          let dimensions = info.Dimensions();

          let imgCanvas = ImageCanvas.Builder
            .width(dimensions.width)
            .height(dimensions.height)
            .source(outputPath)
            .build();

          layer.args.foundation = imgCanvas;

          RenderLayer(layer, tempDirPath, format).then(recentFilepath => {

            // Move file to output dir
            let filename = LinuxCommands.Path.Filename(outputPath);
            let newPath = Path.join(outputDir, filename);

            LinuxCommands.Move.Move(outputPath, newPath, LocalCommand).then(success => {

              // Clean up temp dir
              LinuxCommands.Directory.Remove(tempDirPath, LocalCommand).then(success => {

                // Return recent path
                resolve(newPath);
              }).catch(error => reject(error));
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

//-----------------------------

class SpecialChainRenderer extends SpecialRendererBaseClass {
  constructor() {
  }

  Render(layer, outputDir, format) {
    return new Promise((resolve, reject) => {
      RenderChain(layer, outputDir, format).then(filepath => {
        resolve(filepath);
      }).catch(error => `Failed to render special chain render: ${error}`);
    });
  }
}

//------------------------------
// EXPORTS

exports.SpecialChainRenderer = SpecialChainRenderer;