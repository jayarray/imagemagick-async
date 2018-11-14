let PATH = require('path');
let GUID = require(PATH.join(__dirname, 'guid.js'));
let OPTIMIZER = require(PATH.join(__dirname, 'optimizer.js'));
let LINUX_COMMANDS = require('linux-commands-async');
let LOCAL_COMMAND = LINUX_COMMANDS.Command.LOCAL;
let COMPLEX_OPERATIONS = require(PATH.join(__dirname, 'complexoperations.js'));

//---------------------------------

class LayerBaseClass {
  constructor() {
    this.layers_ = [];
    this.appliedFxAndMods_ = [];
    this.xOffset_ = 0;
    this.yOffset_ = 0;
  }

  /**
   * Get the command used to render the layer.
   */
  Command() {
    // Override (Different layers use different command keywords: i.e. 'convert <...>', 'compare <...>', etc)
  }

  SetXoffset(x) {
    this.xOffset_ = x;
  }

  SetYoffset(y) {
    this.y0Offset_ = y;
  }

  SetOffsets(x, y) {
    this.xOffset_ = x;
    this.yOffset_ = y;
  }

  /**
   * Add a layer to this layer.
   * @param {Layer} layer 
   * @param {number} xOffset 
   * @param {number} yOffset 
   */
  Draw(layer, xOffset, yOffset) {
    layer.xOffset_ = xOffset;
    layer.yOffset_ = yOffset;
    this.layers_.push(layer);
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
      // Create temp file name
      let outputPath = PATH.join(outputDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));

      if (this.Name() == 'RotateImage') {
        RotateImage(this, this.src_, this.xOffset_, this.yOffset_, this.degrees_, [], outputPath).then(success => {
          resolve(outputPath);
        }).catch(error => reject(error));
      }
      else {
        let cmd = this.Command();
        let args = this.Type() == 'canvas' ? this.Args() : this.RenderArgs();
        args = args.concat(outputPath);

        LOCAL_COMMAND.Execute(cmd, args).then(output => {
          if (output.stderr) {
            reject(output.stderr);
            return;
          }

          resolve(outputPath);
        }).catch(error => reject(error));
      }
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

      LINUX_COMMANDS.Mkdir.MakeDirectory(tempDir, LINUX_COMMANDS.Command.LOCAL).then(success => {
        this.RenderTempFile_(outputDir, format).then(outputPath => {
          let apply = (groups) => {
            return new Promise((resolve, reject) => {
              if (groups.length == 0) {
                resolve(prevOutputPath);
                return;
              }

              if (!prevOutputPath)
                prevOutputPath = outputPath;

              let currGroup = groups[0];

              let mainEffect = currGroup[0];
              mainEffect.UpdateSource(prevOutputPath);

              let tempOutputPath = PATH.join(tempDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));
              let consolidatedEffects = currGroup.slice(1);

              if (mainEffect.Name() == 'RotateImage') {
                RotateImage(mainEffect, mainEffect.src_, mainEffect.xOffset_, mainEffect.yOffset_, mainEffect.degrees_, consolidatedEffects, tempOutputPath).then(success => {
                  prevOutputPath = tempOutputPath;
                  resolve(apply(groups.slice(1)));
                }).catch(error => reject(error));
              }
              else {
                if (currGroup.length == 1) {
                  let cmd = mainEffect.Command();
                  let args = mainEffect.RenderArgs();
                  args.push(tempOutputPath);

                  LOCAL_COMMAND.Execute(cmd, args).then(output => {
                    if (output.stderr) {
                      reject(output.stderr);
                      return;
                    }

                    prevOutputPath = tempOutputPath;
                    resolve(apply(groups.slice(1)));
                  }).catch(error => reject(error));
                }
                else {
                  let firstCommand = null;
                  let groupForNow = [];
                  let groupAppendedToHead = false;

                  for (let i = 0; i < currGroup.length; ++i) {
                    let currFxOrMod = currGroup[i];
                    let currCommand = currFxOrMod.Command();

                    if (i == 0) {
                      firstCommand = currCommand;
                      groupForNow.push(currFxOrMod);
                    }
                    else {
                      if (i == currGroup.length - 1 && currCommand == firstCommand) {
                        groupForNow.push(currFxOrMod);
                      }
                      else {
                        if (currCommand != firstCommand) {
                          groups = [currGroup.slice(i)].concat(groups);
                          groupAppendedToHead = true;
                          groupForNow = currGroup.slice(0, i);
                          break;
                        }
                        else {
                          groupForNow.push(currFxOrMod);
                        }
                      }
                    }
                  }

                  let args = [prevOutputPath];
                  groupForNow.forEach(fxOrMod => args = args.concat(fxOrMod.Args()));
                  args.push(tempOutputPath);

                  LOCAL_COMMAND.Execute(firstCommand, args).then(output => {
                    if (output.stderr) {
                      reject(output.stderr);
                      return;
                    }

                    prevOutputPath = tempOutputPath;

                    if (groupAppendedToHead)
                      resolve(apply(groups));
                    else
                      resolve(apply(groups.slice(1)));
                  }).catch(error => reject(error));
                }
              }
            });
          };

          // Render effects in order
          apply(effectGroups).then(outputPath => {
            let filename = LINUX_COMMANDS.Path.Filename(outputPath);
            let newOutputPath = PATH.join(outputDir, filename);

            LINUX_COMMANDS.Move.Move(outputPath, newOutputPath, LINUX_COMMANDS.Command.LOCAL).then(success => {
              // Clean up temp directory
              LINUX_COMMANDS.Directory.Remove(tempDir, LINUX_COMMANDS.Command.LOCAL).then(success => {
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
      LINUX_COMMANDS.Mkdir.MakeDirectory(tempDirPath, LINUX_COMMANDS.Command.LOCAL).then(success => {

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
              prevOutputPath = filepath;
              resolve(apply(canvases.slice(1)));
            }).catch(error => reject(error));
          });
        };

        apply(canvasList).then(filepath => {
          let src = tempFilepaths[0];
          let filepathOffsetTuples = [];

          for (let i = 1; i < tempFilepaths.length; ++i) {
            let path = tempFilepaths[i];

            let currCanvas = canvasList[i];
            filepathOffsetTuples.push({ filepath: path, xOffset: currCanvas.xOffset_, yOffset: currCanvas.yOffset_ });
          }

          let gravity = 'Northwest';

          // Render a composite image
          Composite(src, filepathOffsetTuples, gravity, outputPath).then(success => {
            // Clean up temp directory
            LINUX_COMMANDS.Directory.Remove(tempDirPath, LINUX_COMMANDS.Command.LOCAL).then(success => {
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

function Composite(src, filepathOffsetTuples, gravity, outputPath) {
  return new Promise((resolve, reject) => {
    let args = [src];

    if (gravity)
      args.push('-gravity', gravity);

    for (let i = 0; i < filepathOffsetTuples.length; ++i) {
      let currTuple = filepathOffsetTuples[i];
      args.push('-draw', `image over ${currTuple.xOffset},${currTuple.yOffset} 0,0 '${currTuple.filepath}'`);
    }
    args.push(outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to render composite: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to render composite: ${error}`);
  });
}

//------------------------------------
// ROTATE IMAGE

function RotateImage(layer, src, currXoffset, currYoffset, degrees, consolidatedEffects, outputPath) {
  return new Promise((resolve, reject) => {
    COMPLEX_OPERATIONS.RotateImage(src, degrees, consolidatedEffects, outputPath).then(rotationOffsets => {
      // Adjust offsets to offset any changes in original image used in accomodating the rotation
      let newXoffset = currXoffset - rotationOffsets.xOffset;
      let newYoffset = currYoffset - rotationOffsets.yOffset;
      layer.SetOffsets(newXoffset, newYoffset);

      resolve();
    }).catch(error => reject(error));
  });
}

//--------------------------------------
// EXPORTS

exports.LayerBaseClass = LayerBaseClass;
exports.ComponentType = 'private';