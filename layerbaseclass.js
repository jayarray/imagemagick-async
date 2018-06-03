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

      console.log(`\nLAYER: ${this.Name()}`);
      console.log(`CMD: ${cmd} ${args.join(' ')}`);

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

      let prevOutputPath = null;

      // Create temp directory
      let tempDir = PATH.join(outputDir, GUID.Create(GUID.DEFAULT_LENGTH));

      LINUX_COMMANDS.Mkdir.MakeDirectory(tempDir, LOCAL_COMMAND).then(success => {
        this.RenderTempFile_(outputDir, format).then(outputPath => {

          let apply = (groups) => {
            return new Promise((resolve, reject) => {
              if (groups.length == 0) {
                resolve(prevOutputPath);
                return;
              }

              prevOutputPath = outputPath;

              let currGroup = groups[0];

              let mainEffect = currGroup[0];
              mainEffect.UpdateSource(prevOutputPath); // prev is undefined (???)
              // NOTE: Find a way to make an "apply" function for Render() function.

              let tempOutputPath = PATH.join(tempDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));
              let args = [mainEffect.Command()].concat(mainEffect.RenderArgs());

              let consolidatedEffects = currGroup.slice(1);
              consolidatedEffects.forEach(c => args = args.concat(c.Args()));
              args.push(tempOutputPath);

              let cmd = args.join(' ');

              console.log(`\nLAYER: ${mainEffect.Name()}`);
              console.log(`CMD: ${cmd}`);

              LOCAL_COMMAND.Execute(cmd, []).then(output => {
                if (output.stderr) {
                  reject(output.stderr);
                  return;
                }

                prevOutputPath = tempOutputPath;

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
      let prevOutputPath = null;

      let parentDir = LINUX_COMMANDS.Path.ParentDir(outputPath);
      let format = LINUX_COMMANDS.Path.Extension(outputPath).replace('.', '');
      let tempDirPath = PATH.join(parentDir, GUID.Create());

      // Create temp directory
      LINUX_COMMANDS.Mkdir.MakeDirectory(tempDirPath, LOCAL_COMMAND).then(success => {

        // Render all canvases into temp directory
        let canvasList = OPTIMIZER.GroupIntoSeparateCanvases(this);

        let tempFilepaths = []; // delete these after composing final image

        let apply = (canvases) => {
          return new Promise((resolve, reject) => {
            if (canvases.length == 0) {
              resolve(prevOutputPath);
              return;
            }

            let currCanvas = canvases[0];

            let action = null;
            if (currCanvas.AppliedFxAndMods().length > 0)
              action = currCanvas.RenderTempFileWithAppliedFxAndMods_(tempDirPath, format);
            else
              action = currCanvas.RenderTempFile_(tempDirPath, format);

            action.then(filepath => {
              tempFilepaths.push(filepath);
              resolve(apply(canvases.slice(1)));
            }).catch(error => reject(error));
          });
        };

        apply(canvasList).then(filepath => {
          // Compose all rendered images
          let gravity = 'Northwest';
          CreateComposite(tempFilepaths, gravity, outputPath).then(success => {

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

//--------------------------------------
// EXPORTS

exports.LayerBaseClass = LayerBaseClass;