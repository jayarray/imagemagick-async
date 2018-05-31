let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;
let PATH = require('path');
let OPTIMIZER = require('./optimizer.js');
let LINUX_COMMANDS = require('linux-commands-async');
let GUID = require('./guid.js');

//--------------------------------
// CONSTANTS

const MIN_FILEPATHS = 2;

//---------------------------------
// ARGS

function GetArgs(layer) {
  if (layer) {
    if (layer.Type() == 'canvas')
      return layer.Args();
    return layer.RenderArgs();
  }
  return null;
}

//---------------------------------
// LAYER (Base class)

class LayerBaseClass {
  constructor() {
    this.layers_ = [];
  }

  /**
   * Get the command used to render the layer.
   */
  Command() {
    // Override (Different layers use different command keywords: i.e. 'convert <...>', 'compare <...>', etc)
  }

  /**
   * Add a layer to this layer.
   * @param {Layer} layer 
   * @param {number} xOffset 
   * @param {number} yOffset 
   */
  Draw(layer, x, y) {
    this.layers_.push({ layer: layer, x: x, y: y });
  }

  /**
   * @returns {string} Returns the type of layer.
   */
  Type() {
    // Override
  }

  /**
   * @returns {string} Returns the name of the layer.
   */
  Name() {
    // Override
  }

  /**
   * Use this function to render an image without applying any effects or layers to it.
   * @param {string} outputDir
   * @param {string} format 
   * @returns {Promise<string>} Returns a Promise. If successful, it returns a string representing the output path. Else, it returns an error.
   */
  RenderTempFile_(outputDir, format) {
    return new Promise((resolve, reject) => {
      let outputPath = PATH.join(outputDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));
      let cmd = this.Command();
      let args = GetArgs(this).concat(outputPath);

      LOCAL_COMMAND.Execute(cmd, args).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        resolve(outputPath);
      }).catch(error => reject(error));
    });
  }

  /**
   * Write to disk.
   * @param {string} outputPath 
   */
  Render(outputPath) {
    return new Promise((resolve, reject) => {
      let parentDir = LINUX_COMMANDS.Path.ParentDir(outputPath);
      let format = LINUX_COMMANDS.Path.Extension(outputPath).replace('.', '');
      let tempDirPath = PATH.join(parentDir, GUID.Create());

      LINUX_COMMANDS.Mkdir.MakeDirectory(tempDirPath, LOCAL_COMMAND).then(success => {
        // Render all canvases
        let canvasList = OPTIMIZER.GroupIntoSeparateCanvases(this);
        let actions = canvasList.map(canvas => canvas.RenderTempFile_(tempDirPath, format));

        Promise.all(actions).then(filepaths => {
          let gravity = 'Northwest';
          CreateComposite(filepaths, gravity, outputPath).then(success => {
            resolve();

            // Cleanup temp files
            LINUX_COMMANDS.Directory.Remove(tempDirPath, LOCAL_COMMAND).then(success => {
              resolve();
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }
}

//-------------------------------------
// COMPOSITE

function CreateComposite(filepaths, gravity, outputPath) {
  if (filepaths.length < MIN_FILEPATHS)
    return Promise.reject(`Failed to create composite: ${MIN_FILEPATHS} or more filepaths required.`);

  return new Promise((resolve, reject) => {
    let args = [];

    if (gravity)
      args.push('-gravity', gravity);

    // Add first 2 paths
    args.push(filepaths[0], filepaths[1]);

    // Add other parts accordingly
    for (let i = 2; i < filepaths.length; ++i) {
      args.push('-composite', filepaths[i]);
    }
    args.push('-composite', outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to render composite: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to render composite: ${error}`);
  });
}

//---------------------------------------
// RENDER METHODS (Experimenting)

function ApplyEffectsInSequence(layers, outputDir, format) {
  return new Promise((resolve, reject) => {
    let filepaths = [];
    let actions = [];

    // Set order of renders
    for (let i = 0; i < layer.length; ++i) {
      let currLayer = layers[i];
      let path = PATH.join(outputDir, GUID.Filename(GUID_LENGTH, format));
      filepaths.push(path);

      if (i == 0) { // Render first layer as is.
        let action = currLayer.RenderTempFile_(outputDir, format);
        actions.push(action);
      }
      else { // Apply effects to previous result.
        if (i < layer.length - 1 && currLayer.NumberOfSources() == 1) {
          let nextLayer = layers[i + 1];

          if (nextLayer.NumberOfSources() == 1) {
            let newSrc = filepaths[i - 1];
            nextLayer.UpdateSource(newSrc);
          }
          else if (nextLayer.NumberOfSources() > 1) {
            let newSources = [filepaths[i - 1], null];
            nextLayer.UpdateSources(newSources);
          }
        }
      }
    }

    // Render images
    let filepaths = [];

    let apply = (currLayer, nextLayers) => {
      if (!currLayer)
        return;

      currLayer.RenderTempFile_(outputDir, format).then(filepath => {
        filepaths.push(filepath);
        resolve();
      }).catch(error => reject(error));
    }

    apply(nextLayers[0], nextLayers.slice(1)).then(success => {
      resolve(filepaths[-1]);
    }).catch(error => reject(error));
  });
}

//--------------------------------------
// EXPORTS

exports.LayerBaseClass = LayerBaseClass;