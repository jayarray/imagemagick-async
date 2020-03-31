let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Offset = require(Path.join(Filepath.InputsDir(), 'offset.js'));
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));
let Consolidator = require(Path.join(Filepath.LayerDir(), 'consolidator.js'));
let PreProcessor = require(Path.join(Filepath.RenderDir(), 'preprocessor.js'));
let Layer = require(Path.join(Filepath.LayerDir(), 'layer.js')).Layer;
let ImageCanvas = require(Path.join(Filepath.CanvasDir(), 'imagecanvas.js')).ImageCanvas;
let Identify = require(Path.join(Filepath.QueryInfoDir(), 'identify.js'));

let SpecialRenderer = require(Path.join(Filepath.RenderDir(), 'specialrenderer.js')).SpecialRenderer;
let CanvasRenderer = require(Path.join(Filepath.RenderDir(), 'canvasrenderer.js')).Render;
let PrimitivesRenderer = require(Path.join(Filepath.RenderDir(), 'primitivesrenderer.js')).Render;
let EffectsRenderer = require(Path.join(Filepath.RenderDir(), 'effectsrenderer.js')).Render;
let SpecialRenderer = require(Path.join(Filepath.RenderDir(), 'specialrenderer.js')).SpecialRenderer;

//-----------------------------------
// HELPER FUNCTIONS

/**
 * @returns {string} Returns a random dir name.
 */
function GetRandomDirectoryName() {
  let name = Guid.Create(Guid.DEFAULT_LENGTH);
  return name;
}

/**
 * @param {string} extension The file type (i.e. png, jpeg, etc)
 * @returns {string} Returns a random file name.
 */
function GetRandomFileName(extension) {
  let name = Guid.Filename(Guid.DEFAULT_LENGTH, extension);
  return name;
}

/**
 * @param {string} filepath The file location
 * @returns {string} Returns the file extension
 */
function GetFileExtension(filepath) {
  let extension = LinuxCommands.Path.Extension(filepath).replace('.', '');
  return extension;
}

/**
 * @param {string} tempDir The full path to the temp dir
 * @param {string} dest The output path
 * @returns {string} Returns a generated filepath
 */
function GetTempFilepath(tempDir, dest) {
  let extension = GetFileExtension(dest);
  let filename = GetRandomFileName(extension);
  let tempFilepath = Path.join(tempDir, filename);
  return tempFilepath;
}

/**
 * @param {string} fromPath The source path
 * @param {string} toPath The output path
 * @returns {Promise} Returns a Promise that resolves if successful.
 */
function MoveFile(fromPath, toPath) {
  return new Promise((resolve, reject) => {
    LinuxCommands.Move.Move(fromPath, toPath, LocalCommand.Command.LOCAL).then(success => {
      resolve();
    }).catch(error => reject(error));
  });
}

/**
 * @param {string} fromPath The source path
 * @param {string} toPath The output path
 * @returns {Promise} Returns a Promise that resolves if successful.
 */
function MoveDirectory(fromPath, toPath) {
  return new Promise((resolve, reject) => {
    LinuxCommands.Move.Move(fromPath, toPath, LocalCommand.Command.LOCAL).then(success => {
      resolve();
    }).catch(error => reject(error));
  });
}

/**
 * @param {string} parentDir The path to the parent directory
 * @returns {Promise<string>} Returns a Promise with the path for the newly created directory.
 */
function CreateTempDir(parentDir) {
  return new Promise((resolve, reject) => {
    let dirName = GetRandomDirectoryName();
    let tempDirPath = Path.join(parentDir, dirName);

    LinuxCommands.Directory.Create(tempDirPath, LinuxCommands.Command.LOCAL).then(success => {
      resolve(tempDirPath);
    }).catch(error => reject(error));
  });
}

/**
 * @param {string} dirPath The path to the directory
 * @returns {Promise} Returns a Promise that resolves if successful.
 */
function RemoveDir(dirPath) {
  return new Promise((resolve, reject) => {
    LinuxCommands.Directory.Remove(dirPath, LinuxCommands.Command.LOCAL).then(success => {
      resolve();
    }).catch(error => reject(error));
  });
}


/**
 * Execute the 1st step in rendering a layer.
 * @param {object} foundation A canvas object
 * @param {string} dest The output path for the render
 * @returns {Promise<string>} Returns a Promise with the output path of the newly rendered image.
 */
function RenderFoundation(foundation, dest) {
  return new Promise((resolve, reject) => {

    // Create temp dir
    let parentDir = LinuxCommands.Path.ParentDir(dest);
    CreateTempDir(parentDir).then(tempDirPath => {

      // Render canvas
      let tempFilepath = GetTempFilepath(tempDirPath, dest);
      CanvasRenderer(foundation, tempFilepath).then(outputPath => {

        // Move render to dest
        MoveFile(outputPath, dest).then(success => {

          // Clean up temp dir 
          RemoveDir(tempDirPath).then(success => {
            resolve(dest);
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => {

        // Clean up temp dir 
        RemoveDir(tempDirPath).then(success => {
          reject(error);
        }).catch(error => reject(error));
      });
    }).catch(error => reject(error));
  });
}


/**
 * Execute the 2nd/3rd step in rendering a layer.
 * @param {string} imgPath The filepath of the image you want to draw on
 * @param {Array<>} primitives A list of primitive objects. 
 * @param {string} dest The output path for the render
 * @returns {Promise<string>} Returns a Promise with the output path of the newly rendered image.
 */
function DrawPrimitives(imgPath, primitives, dest) {
  return new Promise((resolve, reject) => {

    // Create temp dir
    let parentDir = LinuxCommands.Path.ParentDir(dest);
    CreateTempDir(parentDir).then(tempDirPath => {

      // Render primitives
      let tempFilepath = GetTempFilepath(tempDirPath, dest);
      PrimitivesRenderer.Render(imgPath, primitives, tempFilepath).then(outputPath => {

        // Move render to dest
        MoveFile(outputPath, dest).then(success => {

          // Clean up temp dir 
          RemoveDir(tempDirPath).then(success => {
            resolve(dest);
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => {

        // Clean up temp dir 
        RemoveDir(tempDirPath).then(success => {
          reject(error);
        }).catch(error => reject(error));
      });
    }).catch(error => reject(error));
  });
}


/**
 * Execute the 2nd/3rd step in rendering a layer.
 * @param {string} imgPath The filepath of the image you want to draw on
 * @param {Array<>} effects A list of effect objects. 
 * @param {string} dest The output path for the render
 * @returns {Promise<string>} Returns a Promise with the output path of the newly rendered image.
 */
function ApplyEffects(imgPath, effects, dest) {
  return new Promise((resolve, reject) => {

    // Create temp dir
    let parentDir = LinuxCommands.Path.ParentDir(dest);
    CreateTempDir(parentDir).then(tempDirPath => {

      // Apply effects to image
      let tempFilepath = GetTempFilepath(tempDirPath, dest);
      EffectsRenderer.Render(imgPath, effects, tempFilepath).then(outputPath => {

        // Move render to dest
        MoveFile(outputPath, dest).then(success => {

          // Clean up temp dir 
          RemoveDir(tempDirPath).then(success => {
            resolve(dest);
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => {

        // Clean up temp dir 
        RemoveDir(tempDirPath).then(success => {
          reject(error);
        }).catch(error => reject(error));
      });
    }).catch(error => reject(error));
  });
}


/**
 * @param {string} foundationPath The location of the image used as a foundation. 
 * @param {string} dest The output path
 * @param {boolean} drawPrimitivesFirst If true, primitives will be drawn first and effects applied after. Otherwise, vice versa.
 * @returns {Promise<string>} Returns a Promise with the output path of the newly rendered image.
 */
function RenderPrimitivesAndEffects(foundationPath, primitives, effects, drawPrimitivesFirst) {
  return new Promise((resolve, reject) => {
    if (drawPrimitivesFirst) {
      DrawPrimitives(foundationPath, primitives, foundationPath).then(outputPath1 => {
        ApplyEffects(outputPath1, effects, outputPath1).then(outputPath2 => {
          resolve(outputPath2);
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }
    else {
      ApplyEffects(foundationPath, effects, foundationPath).then(outputPath1 => {
        DrawPrimitives(outputPath1, primitives, outputPath1).then(outputPath2 => {
          resolve(outputPath2);
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }
  });
}


/**
 * Execute the 4th step in rendering a layer.
 * @param {object} layer The layer object to be rendered
 * @param {string} dest The output path for the render
 * @returns {Promise<{filepath: string, offset: object}>} Returns a Promise containing an object with properties 'filepath' and 'offset'.
 */
function RenderOverlay(layer, dest) {
  return new Promise((resolve, reject) => {
    RenderFoundation(layer.args.foundation, dest).then(foundationPath => {
      RenderPrimitivesAndEffects(foundationPath, layer.args.primitives, layer.args.appliedEffects, layer.args.drawPrimitivesFirst).then(outputPath => {
        let o = {
          filepath: outputPath,
          offset: layer.args.offset
        };

        resolve(o);
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

/**
 * Execute the last step in rendering a layer.
 * @param {string} foundationOutputPath The location for the rendered foundation
 * @param {Array<{filepath: string, offset: object}>} filepathOffsetTuples A list of objects with properties 'filepath' and 'offset'.
 * @param {string} gravity A valid string value for gravity
 * @param {string} dest The output path of the render
 * @returns {Promise<string>} Returns a Promise with the output path of the newly rendered image
 */
function CreateComposite(foundationOutputPath, filepathOffsetTuples, gravity, dest) {
  return new Promise((resolve, reject) => {
    let args = [foundationOutputPath];

    if (gravity)
      args.push('-gravity', gravity);

    filepathOffsetTuples.forEach(t => {
      let currFilepath = t.filepath;
      let currOffset = t.offset;

      args.push('-draw', `image over ${currOffset.args.x},${currOffset.args.y} 0,0 '${currFilepath}'`);
    });

    args.push(dest);

    LocalCommand.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to compose images: ${output.stderr}`);
        return;
      }

      resolve(dest);
    }).catch(error => `Failed to compose images: ${error}`);
  });
}


/**
 * @param {object} layer The layer object to be rendered
 * @param {string} dest The output path of the render
 */
function RenderLayer(layer, dest) {
  return new Promise((resolve, reject) => {
    RenderFoundation(layer.args.foundation, dest).then(foundationPath => {
      RenderPrimitivesAndEffects(foundationPath, layer.args.primitives, layer.args.appliedEffects, layer.args.drawPrimitivesFirst).then(outputPath => {

        // Render any overlays

        let overlays = layer.args.overlays;

        if (!overlays || overlays.length == 0) {
          resolve(outputPath);
          return;
        }

        // Create temp dir
        let parentDir = LinuxCommands.Path.ParentDir(dest);
        CreateTempDir(parentDir).then(tempDirPath => {

          let overlayActions = [];

          layer.args.overlays.forEach(oLayer => {
            let tempFilePath = GetTempFilepath(tempDirPath, dest);
            let action = RenderOverlay(oLayer, tempFilePath);
            overlayActions.push(action);
          });

          Promise.all(overlayActions).then(results => {

            // Create a single composite image
            CreateComposite(foundationPath, results, layer.args.gravity, dest).then(compDest => {

              // Clean up temp stuff
              RemoveDir(tempDirPath).then(success => {
                resolve(dest);
              }).catch(error => reject(error));
            }).catch(error => reject(error));
          }).catch(error => {

            // Clean up temp dir
            RemoveDir(tempDirPath).then(success => {
              reject(error);
            }).catch(error => reject(error));
          });
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}



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

//-------------------------------

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

    let foundation = layer.args.foundation;
    let cmd = foundation.command;


    if (cmd != 'convert') {
      let args = foundation.Args();
      args.push(outputPath);

      // Render foundation first
      LocalCommand.Execute(cmd, args).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        // Draw primtives next
        let primitives = layer.args.primitives;

        DrawPrimitivesSecond(outputPath, primitives).then(success => {

          // Return render filepath
          resolve(outputPath);
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }
    else {
      let args = foundation.Args();

      // Insert source to args (if applicable)
      if (foundation.type != 'Canvas') {
        let source = foundation.args.source;

        if (source)
          args = [source].concat(args);
      }

      // Add any primitive args
      let primitives = layer.args.primitives;

      if (primitives.length > 0) {

        // Get all primitive args
        let primitiveArgs = [];
        primitives.forEach(p => {
          primitiveArgs = primitiveArgs.concat(p.Args())
        });

        // Determine orderof args
        if (layer.args.drawPrimitivesFirst)
          args = primitiveArgs.concat(args);
        else
          args = args.concat(primitiveArgs);
      }

      // Append destination
      args.push(outputPath);

      // Render image
      LocalCommand.Execute(cmd, args).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        // Return render filepath
        resolve(outputPath);
      }).catch(error => reject(error));
    }
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
    let args = [source];

    // Add primitive args

    let primitiveArgs = [];

    primitives.forEach(x => {
      primitiveArgs = primitiveArgs.concat(x.Args());
    });

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
          args.push(filepath);
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
 * Use when rendering a normal layer!
 * @param {Layer} layer
 * @param {string} outputDir
 * @param {string} format
 * @returns {Promise<string>} Returns a Promise with the output path.
 */
function RenderOrdinaryLayer(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let appliedEffects = layer.args.appliedEffects;

    if (appliedEffects.length == 0) {
      // Render foundation only
      RenderFoundationTempFileWithoutEffects(layer, outputDir, format).then(foundationTempOutputPath => {
        resolve(foundationTempOutputPath);
      }).catch(error => reject(error));
    }
    else {
      let drawPrimitivesFirst = layer.args.drawPrimitivesFirst;

      if (drawPrimitivesFirst) {
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

          if (primitives.length == 0) {
            resolve(recentFilepath);
          }
          else {
            // Draw primitives
            DrawPrimitivesSecond(recentFilepath, primitives).then(success => {

              // Return path to rendered image
              resolve(recentFilepath);
            }).catch(error => reject(error));
          }
        }).catch(error => reject(error));
      }
    }
  });
}

//---------------------------------------------
// SPECIAL CHAIN

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

      RenderOrdinaryLayer(layer, tempDirPath, format).then(recentFilepath => {

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

          RenderOrdinaryLayer(layer, tempDirPath, format).then(recentFilepath => {

            // Move file to output dir
            let filename = LinuxCommands.Path.Filename(outputPath);
            let newPath = Path.join(outputDir, filename);

            LinuxCommands.Move.Move(recentFilepath, newPath, LocalCommand).then(success => {

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

//---------------------------------
// SPECIAL COMMAND

/**
   * @override
   */
function RenderCommand(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let filename = Guid.Filename(Guid.DEFAULT_LENGTH, format);
    let outputPath = Path.join(outputDir, filename);
    let cmd = `${layer.args.foundation.Command()} ${outputPath}`;

    LinuxCommands.Command.LOCAL.Execute(cmd, []).then(output => {
      if (output.stderr) {
        reject(`Failed to render special command: ${output.stderr}`);
        return;
      }

      resolve(outputPath);
    }).catch(error => reject(`Failed to render special command: ${error}`));
  });
}

//---------------------------------
// SPECIAL IMAGE STACK

/**
   * @override
   */
function RenderImageStack(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let filename = Guid.Filename(Guid.DEFAULT_LENGTH, format);
    let outputPath = Path.join(outputDir, filename);
    let cmd = `${layer.args.foundation.Command()} ${outputPath}`;

    LinuxCommands.Command.LOCAL.Execute(cmd, []).then(output => {
      if (output.stderr) {
        reject(`Failed to render special image stack: ${output.stderr}`);
        return;
      }

      resolve(outputPath);
    }).catch(error => reject(`Failed to render special image stack: ${error}`));
  });
}

//---------------------------------
// SPECIAL PROCEDURE
/**
   * @override
   */
function RenderProcedure(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let filename = Guid.Filename(Guid.DEFAULT_LENGTH, format);
    let outputPath = Path.join(outputDir, filename);

    let foundation = layer.args.foundation;
    let desiredDest = foundation.args.dest;

    // Temporarily change the output path
    foundation.args.dest = outputPath;

    foundation.Render().then(success => {

      // Restore dest
      foundation.args.dest = desiredDest;

      // Move file to desired dest
      LinuxCommands.Move.Move(outputPath, desiredDest, LinuxCommands.Command.LOCAL).then(success => {
        resolve(desiredDest);
      }).catch(error => `Failed to move special procedure render: ${error}`);
    }).catch(error => `Failed to render special procedure render: ${error}`);
  });
}

//---------------------------------
// SPECIAL RENDERER

function RenderSpecialLayer(layer, outputDir, format) {
  return new Promise((resolve, reject) => {
    let subtype = layer.args.foundation.subtype;
    let specialRenderer = null;

    if (subtype == 'chain')
      specialRenderer = RenderChain(layer, outputDir, format);
    else if (subtype == 'command')
      specialRenderer = RenderCommand(layer, outputDir, format);
    else if (subtype == 'stack')
      specialRenderer = RenderImageStack(layer, outputDir, format);
    else if (subtype == 'procedure')
      specialRenderer = RenderProcedure(layer, outputDir, format);
    else {
      reject(`Failed to render: unknown special type "${subtype}".`);
      return;
    }

    specialRenderer.then(tempFilepath => {

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

        RenderOrdinaryLayer(tempLayer, outputDir, format).then(recentFilepath => {
          resolve(recentFilepath);
        }).catch(error => reject(`Special renderer failed: ${error}`));
      }).catch(error => reject(`Special renderer failed: ${error}`));
    }).catch(error => reject(error));
  });
}

//----------------------------------
// RENDERER

class Renderer {
  constructor(builder) {
    this.layer_ = builder.layer_;
    this.format_ = builder.format_;
    this.outputPath_ = builder.outputPath_;
    this.animation_ = builder.animation_;
    this.isAnimation_ = builder.isAnimation_;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.layer_ = null;
        this.format_ = 'png';
        this.outputPath_ = null;
        this.isAnimation_ = false;
      }

      /**
       * Specify the drawable layer you want to render.
       * @param {Canvas | Effect} layer 
       */
      layer(layer) {
        this.layer_ = layer;
        this.isAnimation_ = false;
        return this;
      }

      /**
       * Specify an animation type to render.
       * @param {Animation} a
       */
      animation(a) {
        this.animation_ = a;
        this.isAnimation_ = true;
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

    let layerErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Layer')
      .condition(
        new Err.ObjectCondition.Builder(this.layer_)
          .typeName('Layer')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (layerErr)
      errors.push(layerErr);

    let formatErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Format')
      .condition(
        new Err.StringCondition.Builder(this.format_)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (formatErr)
      errors.push(formatErr);

    let outputPathErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Output path')
      .condition(
        new Err.StringCondition.Builder(this.outputPath_)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (outputPathErr)
      errors.push(outputPathErr);

    return errors;
  }

  /**
   * Render the specified layer.
   * @returns {Promise<string>} Returns a Promise with the output path.
   */
  Render() {
    return new Promise((resolve, reject) => {
      if (this.isAnimation_) {  // ANIMATION
        let name = this.animation_.name;

        if (name == 'Gif') {
          let cmd = this.animation_.command;
          let args = this.animation_.Args();

          LocalCommand.Execute(cmd, args).then(output => {
            if (output.stderr) {
              reject(output.stderr);
              return;
            }

            resolve();
          }).catch(error => reject(`RENDERER_ERROR: ${error}`));
        }
      }
      else {  // IMAGE
        // Create temp directory

        let parentDir = LinuxCommands.Path.ParentDir(this.outputPath_);
        let tempDirPath = Path.join(parentDir, Guid.Create());

        LinuxCommands.Mkdir.MakeDirectory(tempDirPath, LocalCommand).then(success => {

          // Render foundation

          let layer = this.layer_;
          let format = this.format_;
          let type = layer.args.foundation.type;

          let renderer = null;

          if (type == 'Special') {
            let sRenderer = new SpecialRenderer();
            renderer = sRenderer.Render(layer, tempDirPath, format);
          }
          else {
            let filename = Guid.Filename(Guid.DEFAULT_LENGTH, format);
            let outputPath = Path.join(tempDirPath, filename);

            renderer = OrdinaryRenderer.Builder
              .layer(layer)
              .format(format)
              .outputPath(outputPath)
              .build()
              .Render();
          }

          renderer.then(recentFilepath => {

            // Check if there are any overlays to render.
            let overlays = layer.args.overlays;

            if (overlays.length == 0) {

              // Move file to destination
              LinuxCommands.Move.Move(recentFilepath, this.outputPath_, LocalCommand).then(success => {

                // Clean up temp directory
                return LinuxCommands.Directory.Remove(tempDirPath, LocalCommand);
              }).then(success => {

                // Return render filepath
                resolve(this.outputPath_);
              }).catch(error => reject(`RENDERER_ERROR: ${error}`));
            }
            else {
              // Render all overlays in parallel

              let actions = [];

              overlays.forEach(oLayer => {
                let type = oLayer.args.foundation.type;
                let a = null;

                if (type == 'Special') {
                  let sRenderer = new SpecialRenderer();
                  a = sRenderer.Render(layer, tempDirPath, format);
                }
                else {
                  let filename = Guid.Filename(Guid.DEFAULT_LENGTH, format);
                  let outputPath = Path.join(outputDir, filename);

                  a = OrdinaryRenderer.Builder
                    .layer(layer)
                    .format(format)
                    .outputPath(outputPath)
                    .build()
                    .Render();
                }

                actions.push(a);
              });

              Promise.all(actions).then(results => {

                // Merge layers together and move to destination
                let outputPaths = results;
                let filepathOffsetTuples = [];

                for (let i = 0; i < outputPaths.length; ++i) {
                  let currOverlay = overlays[i];
                  let currOffset = currOverlay.args.offset;
                  let currOutputPath = outputPaths[i];
                  let tuple = { filepath: currOutputPath, offset: null };

                  // Check if recent render was from RotateImage module. (Its enlarged dimensions require offsetting!)

                  let currFoundation = currOverlay.args.foundation;
                  let renderedFromRotateImage = currFoundation.name == 'RotateImage';

                  if (renderedFromRotateImage) {
                    let rotateImageOffsets = currFoundation.offset;

                    let adjustedOffset = Offset.Builder
                      .x(currOffset.args.x + rotateImageOffsets.x)
                      .y(currOffset.args.y + rotateImageOffsets.y)
                      .build();

                    tuple.offset = adjustedOffset;
                  }
                  else {
                    tuple.offset = currOffset;
                  }

                  filepathOffsetTuples.push(tuple);
                }

                let gravity = this.layer_.args.gravity;

                // Render final image to destination
                ComposeImages(recentFilepath, filepathOffsetTuples, gravity, this.outputPath_).then(success => {

                  // Clean up temp dir
                  LinuxCommands.Directory.Remove(tempDirPath, LocalCommand).then(success => {

                    // Return render filepath
                    resolve(this.outputPath_);
                  }).catch(error => reject(`RENDERER_ERROR: ${error}`));
                }).catch(error => reject(`RENDERER_ERROR: ${error}`));
              }).catch(error => reject(`RENDERER_ERROR: ${error}`));
            }
          }).catch(error => reject(`RENDERER_ERROR: ${error}`));
        }).catch(error => reject(`RENDERER_ERROR: ${error}`));
      }
    });
  }
}

//-------------------------------------
// EXPORTS

exports.Renderer = Renderer;