let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));
let Consolidator = require(Path.join(Filepath.LayerDir(), 'consolidator.js'));
let PreProcessor = require(Path.join(Filepath.RenderDir(), 'preprocessor.js'));

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
 * Use when drawing primitives first OR when no effects are applied.
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
 * @param {string} source 
 * @param {Array<Primitive>} primitives 
 * @returns {Promise} Returns a promise that resolves if successful.
 */
function DrawPrimitivesSecond(source, primitives) {
  return new Promise((resolve, reject) => {
    let cmd = 'convert';
    let args = [];

    // Add primitive args
    let primitiveArgs = [];
    primitives.forEach(x => primitiveArgs.concat(x.Args()));
    args = args.concat(primitiveArgs);

    // Append destination (same as source)
    args = args.push(source);

    // Render
    LocalCommand.Execute(cmd, args).then(output => {
      if (output.stderr) {
        reject(output.stderr);
        return;
      }

      resolve();
    }).catch(error => reject(error));
  });
}

/**
 * Use when applying effects before drawing primitives!
 * @param {Layer} layer
 * @param {string} outputDir
 * @param {string} format
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function ApplyEffectsFirst(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let preProcessedItems = PreProcessor.PreprocessDrawablesForRendering(layer, outputDir, format, true);

    let filepathList = [];
    let dirpathList = [];

    // Create function to render effects in order.
    let apply = (preProcessedArr) => {
      return new Promise((resolve, reject) => {
        if (preProcessedArr.length == 0) {
          resolve();
          return;
        }

        let currObj = preProcessedArr[0];
        let dirpath = currObj.dirpath;
        dirpathList.push(dirpath);

        // Create temp folder
        LinuxCommands.Directory.Create(dirpath, LocalCommand).then(success => {

          let group = currObj.group;
          let foundation = group[0];
          let prevOutputPath = currObj.prevOutputPath;

          let cmd = foundation.command;
          let args = [];

          // Add foundation args
          if (foundation.args.source1) {
            if (prevOutputPath)
              foundation.args.source1 = prevOutputPath;

            args = foundation.Args();
          }
          else {
            let source = null;

            if (prevOutputPath)
              source = prevOutputPath;
            else
              source = foundation.args.source;

            args = [source].concat(foundation.Args());
          }

          // Add effect args
          let effects = group.slice(1);

          if (effects.length > 0) {
            let effectArgs = [];
            effects.forEach(x => effectArgs = effectArgs.concat(x.Args()));
            args = args.concat(effectArgs);
          }

          // Append destination
          let filepath = currObj.filepath;
          args = args.push(filepath);
          filepathList.push(filepath);

          // Render image
          LocalCommand.Execute(cmd, args).then(output => {
            if (output.stderr) {
              reject(output.stderr);
              return;
            }

            // Recurse
            resolve(apply(preProcessedArr.slice(1)));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      });
    };

    apply(preProcessedItems).then(success => {

      // Clean up temp directories (except last one)
      let theseDirpaths = dirpathList.slice(0, dirpathList.length - 1);
      LinuxCommands.Remove.Directories(theseDirpaths, LocalCommand).then(success => {

        // Return most recent render filepath
        let lastPath = filepathList[filepathList.length - 1];
        resolve(lastPath);
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}


/**
 * Use when applying effects before drawing primitives!
 * @param {Layer} layer
 * @param {string} outputDir
 * @param {string} format
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function ApplyEffectsSecond(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let preProcessedItems = PreProcessor.PreprocessDrawablesForRendering(layer, outputDir, format, false);

    let filepathList = [];
    let dirpathList = [];

    // Create function to render effects in order.
    let apply = (preProcessedArr) => {
      return new Promise((resolve, reject) => {
        if (preProcessedArr.length == 0) {
          resolve();
          return;
        }

        let currObj = preProcessedArr[0];
        let dirpath = currObj.dirpath;
        dirpathList.push(dirpath);

        // Create temp folder
        LinuxCommands.Directory.Create(dirpath, LocalCommand).then(success => {

          let group = currObj.group;
          let foundation = group[0];
          let prevOutputPath = currObj.prevOutputPath;

          let cmd = foundation.command;
          let args = [];

          // Add foundation args
          if (foundation.args.source1) {
            if (prevOutputPath)
              foundation.args.source1 = prevOutputPath;

            args = foundation.Args();
          }
          else {
            let source = null;

            if (prevOutputPath)
              source = prevOutputPath;
            else
              source = foundation.args.source;

            args = [source].concat(foundation.Args());
          }

          // Add effect args
          let effects = group.slice(1);

          if (effects.length > 0) {
            let effectArgs = [];
            effects.forEach(x => effectArgs = effectArgs.concat(x.Args()));
            args = args.concat(effectArgs);
          }

          // Append destination
          let filepath = currObj.filepath;
          args = args.push(filepath);
          filepathList.push(filepath);

          // Render image
          LocalCommand.Execute(cmd, args).then(output => {
            if (output.stderr) {
              reject(output.stderr);
              return;
            }

            // Recurse
            resolve(apply(preProcessedArr.slice(1)));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      });
    };

    apply(preProcessedItems).then(success => {

      // Clean up temp directories (except last one)
      let theseDirpaths = dirpathList.slice(0, dirpathList.length - 1);
      LinuxCommands.Remove.Directories(theseDirpaths, LocalCommand).then(success => {

        // Return most recent render filepath
        let lastPath = filepathList[filepathList.length - 1];
        resolve(lastPath);
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

/**
 * @param {Layer} layer
 * @param {string} outputDir
 * @param {string} format
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function RenderLayer(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let appliedEffects = layer.args.appliedEffects;

    if (appliedEffects.length == 0) {
      RenderFoundationTempFileWithoutEffects(layer, outputDir, format).then(foundationTempOutputPath => {
        resolve(foundationTempOutputPath);
      }).catch(error => reject(error));
    }
    else {
      if (layer.args.drawPrimitivesFirst) {

        // Render foundation with primitives
        RenderFoundationTempFileWithoutEffects(layer, outputDir, format).then(foundationTempOutputPath => {

          // Update source of first effect (so that pre-processor consolidates them correctly)
          let firstEffect = appliedEffects[0];

          if (firstEffect.args.source1)
            firstEffect.args.source1 = foundationTempOutputPath;
          else
            firstEffect.args.source = foundationTempOutputPath;

          // Apply effects
          ApplyEffectsSecond(layer, outputDir, format).then(recentFilepath => {
            resolve(recentFilepath);
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }
      else {
        // Render foundation with applied effects
        ApplyEffectsFirst(layer, outputDir, format).then(recentFilepath => {
          let primitives = layer.args.primitives;

          // Draw primitives
          DrawPrimitivesSecond(recentFilepath, primitives).then(success => {

            // Return path to rendered image
            resolve(recentFilepath);
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }
    }
  });
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

        RenderLayer(layer, tempDirPath, format).then(recentFilepath => {

          // Render all overlays in parallel

          let actions = [];

          overlays.forEach(oLayer => {
            let a = RenderLayer(oLayer, tempDirPath, format);
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

            ComposeImages(recentFilepath, filepathOffsetTuples, gravity, this.outputPath_).then(success => {

              // Clean up temp dir
              LinuxCommands.Directory.Remove(tempDirPath, LocalCommand).then(success => {
                resolve();
              }).catch(error => reject(`RENDERER_ERROR: ${error}`));
            }).catch(error => reject(`RENDERER_ERROR: ${error}`));
          }).catch(error => reject(`RENDERER_ERROR: ${error}`));
        }).catch(error => reject(`RENDERER_ERROR: ${error}`));
      }).catch(error => reject(`RENDERER_ERROR: ${error}`));
    });
  }
}

//-------------------------------------
// EXPORTS

exports.Renderer = Renderer;