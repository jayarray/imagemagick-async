let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;
let PATH = require('path');
let OPTIMIZER = require('./optimizer.js');
let LINUX_COMMANDS = require('linux-commands-async');
let GUID = require('./guid.js');

//--------------------------------
// CONSTANTS

const MIN_FILEPATHS = 2;

//---------------------------------
// LAYER (Base class)

class LayerBaseClass {
  constructor() {
    this.layers_ = [];
    this.appliedFxAndMods_ = [];
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
   * Directly apply an effect or modification to this layer.
   * @param {Layer} fxOrMod An Fx or Mod layer
   */
  ApplyFxOrMod(fxOrMod) {
    this.appliedFxAndMods_.push(fxOrMod);
  }

  /**
   * @return {Array<Layer>} Returns an array of Fx and Mod layers applied to this layer.
   */
  AppliedFxAndMods() {
    return this.appliedFxAndMods_;
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
      let args = this.Args().concat(outputPath);

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
   * Use this function to render an image using a specific command string. (For use with applied FX and Mods command)
   * @param {string} cmd Command string
   * @param {string} outputDir
   * @param {string} format 
   * @returns {Promise<string>} Returns a Promise. If successful, it returns a string representing the output path. Else, it returns an error.
   */
  RenderTempFileByCmd_(cmd, outputDir, format) {
    return new Promise((resolve, reject) => {
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
   * Use this function to render an image without applying any effects or layers to it.
   * @param {string} outputDir
   * @param {string} format 
   * @returns {Promise<string>} Returns a Promise. If successful, it returns a string representing the output path. Else, it returns an error.
   */
  RenderTempFileWithAppliedFxAndMods_(outputDir, format) {
    return new Promise((resolve, reject) => {
      let effectGroups = OPTIMIZER.GroupConsolableFxAndMods(this.appliedFxAndMods_);
      let prevOutputPath = this.src_;

      // Create temp directory
      let tempDir = PATH.join(outputDir, GUID.Create(GUID.DEFAULT_LENGTH));

      LINUX_COMMANDS.Mkdir.MakeDirectory(tempDir, LOCAL_COMMAND).then(success => {
        this.RenderTempFile_(outputDir, format).then(ouputPath => {
          let apply = (groups) => {
            return new Promise((resolve, reject) => {
              if (groups.length == 0) {
                resolve(prevOutputPath);
                return;
              }

              let currGroup = groups[0];

              let mainEffect = currGroup[0];
              mainEffect.UpdateSource(prevOutputPath);

              let tempOutputPath = PATH.join(tempDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));
              prevOutputPath = tempOutputPath;

              let args = [mainEffect.Command()].concat(mainEffect.RenderArgs());

              let consolidatedEffects = currGroup.slice(1);
              consolidatedEffects.forEach(c => args = args.concat(c.Args()));
              args.push(tempOutputPath);

              let cmd = args.join(' ');
              LOCAL_COMMAND.Execute(cmd, []).then(output => {
                if (output.stderr) {
                  reject(output.stderr);
                  return;
                }
                resolve(apply(groups.slice(1)));
              }).catch(error => reject(error));
            });
          };

          // Render effects in order
          apply(effectGroups).then(outputPath => {
            // Move final image out of temp dir
            let filename = LINUX_COMMANDS.Path.Filename(outputPath);
            let newOutputPath = PATH.join(outputDir, filename);

            LINUX_COMMANDS.Move.Move(outputPath, newOutputPath, LOCAL_COMMAND).then(success => {
              // Clean up temp directory
              LINUX_COMMANDS.Directory.Remove(tempDir, LOCAL_COMMAND).then(success => {
                resolve(newOutputPath);
              }).catch(error => reject(error));
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
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

      // Create temp directory
      LINUX_COMMANDS.Mkdir.MakeDirectory(tempDirPath, LOCAL_COMMAND).then(success => {

        // Render all canvases into temp directory
        let canvasList = OPTIMIZER.GroupIntoSeparateCanvases(this);

        let actions = [];
        for (let i = 0; i < canvasList.length; ++i) {
          let currCanvas = canvasList[i];
          if (currCanvas.AppliedFxAndMods().length > 0)
            actions.push(currCanvas.RenderTempFileWithAppliedFxAndMods_(tempDirPath, format));
          else
            actions.push(currCanvas.RenderTempFile_(tempDirPath, format));
        }

        Promise.all(actions).then(filepaths => {
          // Compose all rendered images
          let gravity = 'Northwest';
          CreateComposite(filepaths, gravity, outputPath).then(success => {

            // Clean up temp directory
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