let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));
let Consolidator = require(Path.join(Filepath.LayerDir(), 'consolidator.js'));

//-----------------------------------
// HELPER FUNCTIONS

/**
 * Use this for composing images
 * @param {string} source
 * @param {Array<{filepath: string, offset: Offset}>} filepathOffsetTuples 
 * @param {string} gravity 
 * @param {string} outputPath Destination for output file.
 * @returns {Promise} Returns a Promise taht resolves if successful.
 */
function ComposeImages(source, filepathOffsetTuples, gravity, outputPath) {
  return new Promise((resolve, reject) => {
    let args = [source];

    if (gravity)
      args.push('-gravity', gravity);

    for (let i = 0; i < filepathOffsetTuples.length; ++i) {
      let currTuple = filepathOffsetTuples[i];
      let currFilepath = currTuple.filepath;
      let currOffset = currTuple.offset;
      args.push('-draw', `image over ${currOffset.args.x},${currOffset.args.y} 0,0 '${currFilepath}'`);
    }
    args.push(outputPath);

    LocalCommand.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to compose images: ${output.stderr}`);
        return;
      }

      resolve();
    }).catch(error => `Failed to compose images: ${error}`);
  });
}

/**
 * @param {Layer} layer 
 * @returns {Array} Returns an array args associated with the foundation.
 */
function GetFoundationArgs(layer) {
  let foundation = layer.args.foundation;
  let cmd = foundation.command;
  let args = foundation.Args();
  let primitives = layer.args.primitives;

  // Add primitive args
  if (primitives.length > 0) {

    // Get all primitive args
    let primitiveArgs = [];
    primitives.forEach(p => primitiveArgs = primitiveArgs.concat(p.Args()));

    // Determine orderof args
    if (layer.args.drawPrimitivesFirst)
      args = primitiveArgs.concat(args);
    else
      args = args.concat(primitiveArgs);
  }

  // Append destination
  args = args.concat(outputPath);

  // Insert source (if applicable)
  let isCanvas = foundation.type == 'Canvas';
  let hasTwoSources = foundation.args.source1 && foundation.args.source2;

  if (!isCanvas && !hasTwoSources) {
    let source = foundation.args.source;
    args = [source].concat(args);
  }

  // Insert command as first arg
  args = [cmd].concat(args);

  return args;
}

/**
 * @param {Layer} layer
 * @param {string} outputDir
 * @param {string} format
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function RenderFoundationTempFileWithoutEffects(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    // Create temp file destination
    let outputPath = Path.join(outputDir, Guid.Filename(Guid.DEFAULT_LENGTH, format));

    // Get args
    let foundation = layer.args.foundation;
    let cmd = foundation.command;
    let args = foundation.Args();
    let primitives = layer.args.primitives;

    // Add any primitive args
    if (primitives.length > 0) {

      // Get all primitive args
      let primitiveArgs = [];
      primitives.forEach(p => primitiveArgs.concat(p.Args()));

      // Determine orderof args
      if (layer.args.drawPrimitivesFirst)
        args = primitiveArgs.concat(args);
      else
        args = args.concat(primitiveArgs);
    }

    // Append destination
    args = args.concat(outputPath);

    // Insert source (if applicable)
    if (foundation.type != 'Canvas') {
      let source = foundation.args.source;
      args = [source].concat(args);
    }

    // Render image
    LocalCommand.Execute(cmd, args).then(output => {
      if (output.stderr) {
        reject(output.stderr);
        return;
      }

      resolve(outputPath);
    }).catch(error => reject(error));
  });
}

/**
 * @param {Layer} layer
 * @param {string} outputDir
 * @param {string} format
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function RenderFoundationTempFileWithEffects(layer, outputDir, format) {
  return new Promise((resolve, reject) => {

    // Create temp directory
    let tempDir = Path.join(outputDir, GUID.Create(GUID.DEFAULT_LENGTH));

    LinuxCommands.Mkdir.MakeDirectory(tempDir, LocalCommand).then(success => {
      let effects = layer.args.appliedEffects;
      let effectGroups = Consolidator.GroupConsolableEffects(effects);
      let hasEffects = true;

      RenderFoundationTempFile(layer, outputDir, format, hasEffects).then(foundationOutputPath => {

        // Create function 
        let prevOutputPath = null;

        let apply = (effectGroups) => {
          return new Promise((resolve, reject) => {
            if (effectGroups.length == 0) {
              resolve(prevOutputPath);
              return;
            }

            if (!prevOutputPath)
              prevOutputPath = foundationOutputPath;

            let currGroup = effectGroups[0];

            // Update source
            // NOTE: Applied effects do not have the source (or source1) defined. It is dependent on the output path from the effect before it.

            let mainEffect = currGroup[0];

            if (mainEffect.args.source1)
              mainEffect.args.source1 = prevOutputPath;
            else
              mainEffect.args.source = prevOutputPath;

            // Render effects in sequence

            let tempOutputPath = Path.join(tempDir, Guid.Filename(Guid.DEFAULT_LENGTH, format));

            if (currGroup.length == 1) {
              let cmd = mainEffect.command;
              let args = mainEffect.Args();
              let primitives = layer.args.primitives;

              // Add any primitive args
              if (primitives.length > 0) {

                // Get all primitive args
                let primitiveArgs = [];
                primitives.forEach(p => primitiveArgs.concat(p.Args()));

                // Determine orderof args
                if (layer.args.drawPrimitivesFirst)
                  args = primitiveArgs.concat(args);
                else
                  args = args.concat(primitiveArgs);
              }

              args.push(tempOutputPath);

              // Render temp image
              LocalCommand.Execute(cmd, args).then(output => {
                if (output.stderr) {
                  reject(output.stderr);
                  return;
                }

                prevOutputPath = tempOutputPath;
                resolve(apply(effectGroups.slice(1)));
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
                      groups = [currGroup.slice(i)].concat(effectGroups);
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
                  resolve(apply(effectGroups));
                else
                  resolve(apply(effectGroups.slice(1)));
              }).catch(error => reject(error));
            }

          });
        };

        // Render effects in order

        apply(effectGroups).then(foundationOutputPath => {
          let filename = LinuxCommands.Path.Filename(foundationOutputPath);
          let newOutputPath = Path.join(outputDir, filename);

          LinuxCommands.Move.Move(foundationOutputPath, newOutputPath, LocalCommand).then(success => {

            // Clean up temp directory

            LinuxCommands.Directory.Remove(tempDir, LocalCommand).then(success => {
              resolve(newOutputPath);
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

function RenderFoundationTempFile(layer, outputDir, format, hasEffects) {
  return new Promise((resolve, reject) => {
    if (hasEffects)
      resolve(RenderFoundationTempFileWithEffects(layer, outputDir, format));
    else
      resolve(RenderFoundationTempFileWithoutEffects(layer, outputDir, format));
  });
}

function RenderInSequence(layers) {
  // TO DO
}

/**
 * @param {object} o
 * @param {string} outputPath
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function RenderJsonObject(o, outputPath) {
  return new Promise((resolve, rejects) => {
    // TO DO
    // return output path
  });
}

/**
 * @param {string} source
 * @param {string} outputPath
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function RenderFromFile(source, outputPath) {
  return new Promise((resolve, rejects) => {
    // TO DO
    // return output path
  });
}

//----------------------------------
// RENDERER

class Renderer {
  constructor(builder) {
    this.layer_ = builder.layer_;
    this.format_ = builder.format_;
    this.outputPath_ = builder.outputPath_;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.layer_ = null;
        this.format_ = 'png';
        this.outputPath_ = null;
      }

      /**
       * Specify the drawable layer you want to render.
       * @param {Canvas | Effect} layer 
       */
      layer(layer) {
        this.layer_ = layer;
        return this;
      }

      /**
       * Specify the format type for the output file.
       * @param {string} str
       */
      format(str) {
        this.format_ = str;
        return this;
      }

      /**
       * Specify the destination of the output file.
       * @param {*} str 
       */
      outputPath(str) {
        this.outputPath_ = str;
        return this;
      }

      build() {
        return new Renderer(this);
      }
    }
    return new Builder();
  }

  Errors() {
    let errors = [];
    let prefix = 'RENDERER_ERROR';

    return errors;
  }

  /**
   * Render the specified layer.
   * @returns {Promise<string>} Returns a Promise with the output path.
   */
  Render() {
    return new Promise((resolve, reject) => {

      // Create temp directory
      let parentDir = LinuxCommands.Path.ParentDir(this.outputPath_);
      let tempDirPath = Path.join(parentDir, Guid.Create());

      LinuxCommands.Mkdir.MakeDirectory(tempDirPath, LocalCommand).then(success => {

        // Render foundation
        let layer = this.layer_;
        let format = this.format_;
        let hasEffects = layer.args.appliedEffects.length > 0;

        RenderFoundationTempFile(layer, tempDirPath, format, hasEffects).then(foundationTempOutputPath => {

          // Render overlays (if any)
          let overlays = layer.args.overlays;

          if (overlays.length == 0) {

            // Rename and move file to destination
            LinuxCommands.Move.Move(foundationTempOutputPath, this.outputPath_, LocalCommand).then(success => {

              // Clean up temp dir
              LinuxCommands.Directory.Remove(tempDirPath, LocalCommand).then(success => {
                resolve();
              }).catch(error => reject(`RENDERER_ERROR: ${error}`));
            }).catch(error => reject(`RENDERER_ERROR: ${error}`));
          }
          else {

            // Render all overlays in parallel
            let actions = [];

            overlays.forEach(oLayer => {
              let oHasEffects = oLayer.args.appliedEffects.length > 0;
              let a = RenderFoundationTempFile(oLayer, tempDirPath, format, oHasEffects);
              actions.push(a);
            });

            Promise.all(actions).then(results => {

              // Merge layers together and move to destination
              let outputPaths = results;
              let filepathOffsetTuples = [];

              for (let i = 0; i < outputPaths.length; ++i) {
                let currOverlay = overlays[i];
                let currFoundation = currOverlay.args.foundation;
                let currOffset = currFoundation.offset;
                let currOutputPath = outputPaths[i];
                let tuple = { filepath: currOutputPath, offset: currOffset };
                filepathOffsetTuples.push(tuple);
              }

              let gravity = this.layer_.args.gravity;

              ComposeImages(foundationTempOutputPath, filepathOffsetTuples, gravity, this.outputPath_).then(success => {

                // Clean up temp dir
                LinuxCommands.Directory.Remove(tempDirPath, LocalCommand).then(success => {
                  resolve();
                }).catch(error => reject(`RENDERER_ERROR: ${error}`));
              }).catch();
            }).catch(error => reject(`RENDERER_ERROR: ${error}`));
          }
        }).catch(error => reject(`RENDERER_ERROR: ${error}`));



        //--------------------------------------
        // OLD CODE


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
              action = currCanvas.RenderTempFileWithAppliedFxAndMods_(tempDirPath, this.format_);
            else
              action = currCanvas.RenderTempFile_(tempDirPath, this.format_);

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

          ComposeImages(src, filepathOffsetTuples, gravity, this.outputPath_).then(success => {

            // Clean up temp directory

            LinuxCommands.Directory.Remove(tempDirPath, LocalCommand).then(success => {
              resolve();
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }
}

//-------------------------------------
// EXPORTS

exports.Renderer = Renderer;