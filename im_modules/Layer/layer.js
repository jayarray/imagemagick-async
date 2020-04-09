let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Offset = require(Path.join(Filepath.InputsDir(), 'offset.js')).Offset;
let GravityValues = require(Path.join(Filepath.ConstantsDir(), 'gravity.json')).values;
let ObjectInterface = require(Path.join(RootDir, 'objectinterface.js')).ObjectInterface;
let Composite = require(Path.join(Filepath.ModComposeDir(), 'composite.js')).Composite;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));

let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//-------------------------------------
// HELPERS
//-------------------------------------


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

//--------------------------

/**
 * @param {string} imgPath The path to the image you will be drawing to.
 * @param {Array<>} primitives A list of primitives you want to draw on the image.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise that resolves if successful and returns the output path of the newly rendered image.
 */
function DrawPrimitives(imgPath, primitives, dest) {
  return new Promise((resolve, reject) => {
    if (!primitives || primitives.length == 0) {
      resolve(dest);
      return;
    }

    let cmd = 'convert';
    let args = [imgPath];

    primitives.forEach(p => {
      args = args.concat(p.Args());
    });

    args.push(dest);

    LocalCommand.Execute(cmd, args).then(output => {
      if (output.stderr) {
        reject(output.stderr);
        return;
      }

      resolve(dest);
    }).catch(error => reject(`Failed to draw primitives: ${error}`));
  });
}


/**
 * @param {string} imgPath The path to the image you will be drawing to.
 * @param {Array<>} effects A list of effects you want to apply to the image.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise with the output path of the newly rendered image.
 */
function ApplyEffects(imgPath, effects, dest) {
  return new Promise((resolve, reject) => {

    let applyEffectsInSequence = (source, fxArr, outputPath) => {
      return new Promise((resolve, reject) => {
        if (!fxArr || fxArr.length == 0) {
          resolve(outputPath);
          return;
        }

        let currEffect = fxArr[0];
        let nextEffects = fxArr.slice(1);

        if (currEffect.args.source1 != null)
          currEffect.args.source1 = source;
        else if (currEffect.args.source != null)
          currEffect.args.source = source;

        currEffect.Render(outputPath).then(newOutputPath => {
          resolve(applyEffectsInSequence(newOutputPath, nextEffects, newOutputPath));
        }).catch(error => reject(error));
      });
    };

    applyEffectsInSequence(imgPath, effects, dest).then(outputPath => {
      resolve(outputPath);
    }).catch(error => reject(error));
  });
}


/**
 * @param {string} imgPath The path to the image you will be drawing to.
 * @param {Array<>} primitives A list of primitives you want to draw on the image.
 * @param {Array<>} effects A list of effects you want to apply to the image.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise with the output path of the newly rendered image. 
 */
function DrawPrimitivesFirst(imgPath, primitives, effects, dest) {
  return new Promise((resolve, reject) => {
    DrawPrimitives(imgPath, primitives, dest).then(outputPath1 => {
      ApplyEffects(outputPath1, effects, outputPath1).then(outputPath2 => {
        resolve(outputPath2);
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}


/**
 * @param {string} imgPath The path to the image you will be drawing to.
 * @param {Array<>} primitives A list of primitives you want to draw on the image.
 * @param {Array<>} effects A list of effects you want to apply to the image.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise with the output path of the newly rendered image. 
 */
function ApplyEffectsFirst(imgPath, primitives, effects, dest) {
  return new Promise((resolve, reject) => {
    ApplyEffects(imgPath, effects, dest).then(outputPath1 => {
      DrawPrimitives(outputPath1, primitives, outputPath1).then(outputPath2 => {
        resolve(outputPath2);
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}


/**
 * @param {Array<>} overlays A list of Layer objects.
 * @param {string} parentDir The directory where you want to render the overlays.
 * @param {string} extension The file extension type to render the image in.
 * @returns {Promise<Array<{filepath: string, offset: object}>>} Returns a Promise with a list of objects.
 */
function RenderOverlays(overlays, parentDir, extension) {
  return new Promise((resolve, reject) => {

    // Create render actions for each overlay.

    let offsetArr = [];
    let actions = [];

    overlays.forEach(o => {

      // Get offset
      offsetArr.push(o.args.offset);

      // Get render action
      let filename = GetRandomFileName(extension);
      let dest = Path.join(parentDir, filename);
      let a = o.Render(dest);
      actions.push(a);
    });

    Promise.all(actions).then(results => {

      let filepathOffsetPairs = [];

      for (let i = 0; i < results.length; ++i) {
        let currOverlay = overlays[i];
        let currOffset = offsetArr[i];
        let currFilepath = results[i];

        let pair = {
          filepath: currFilepath,
          offset: currOffset
        };

        filepathOffsetPairs.push(pair);
      }

      resolve(filepathOffsetPairs);
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
function CreateComposite(foundationOutputPath, filepathOffsetPairs, gravity, dest) {
  return new Promise((resolve, reject) => {
    let args = [foundationOutputPath];

    if (gravity)
      args.push('-gravity', gravity);

    filepathOffsetPairs.forEach(t => {
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

//-------------------------------------

class Layer extends ObjectInterface {
  constructor(builder) {
    super({
      category: 'layer',
      type: 'Layer',
      name: 'Layer',
      args: builder.args
    });
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.args = {
          foundation: null,
          overlays: [],
          appliedEffects: [],
          primitives: [],
          offset: Offset.Builder.x(0).y(0).build(),
          id: null,
          drawPrimitivesFirst: true,
          gravity: 'Center'
        };
      }

      /**
       * Declare the layer that will serve as the canvas.
       * @param {Canvas | Effect} drawableLayer
       */
      foundation(drawableLayer) {
        this.args.foundation = drawableLayer;
        return this;
      }

      /**
       * Add a layer on top of the others.
       * @param {Layer} layer 
       */
      overlay(layer) {
        this.args.overlays.push(layer);
        return this;
      }

      /**
       * Add many layers on top of the others.
       * @param {Array<Layer>} layersArr
       */
      overlays(layersArr) {
        this.args.overlays = this.args.overlays.concat(layersArr);
        return this;
      }

      /**
       * @param {Effect} effect 
       */
      applyEffect(effect) {
        this.args.appliedEffects.push(effect);
        return this;
      }

      /**
       * @param {Array<Effect>} effectsArr
       */
      applyManyEffects(effectsArr) {
        this.args.appliedEffects = this.args.appliedEffects.concat(effectsArr);
        return this;
      }

      /**
       * Draw a Primitive type on the foundation layer.
       * @param {Primitive} primitive 
       */
      draw(primitive) {
        this.args.primitives.push(primitive);
        return this;
      }

      /**
       * Draw a list of Primitive types on the foundation layer.
       * @param {Array<Primitive>} primitivesArr
       */
      drawMany(primitivesArr) {
        this.args.primitives = this.args.primitives.concat(primitivesArr);
        return this;
      }

      /**
       * Establish the offset for the foundation layer. (The resulting image will inherit this offset.)
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
        return this;
      }

      /**
       * Declare a name for this layer.
       * @param {string} str Name of the layer. (Optional)
       */
      id(str) {
        this.args.id = str;
        return this;
      }

      /**
       * Call this function if you want to draw primitives first and apply effects after.
       */
      drawPrimitivesFirst() {
        this.args.drawPrimitivesFirst = true;
        return this;
      }

      /**
       * Call this function if you want to apply effects first and draw primitives on the resulting image.
       */
      applyEffectsFirst() {
        this.args.drawPrimitivesFirst = false;
        return this;
      }

      /**
       * Specify the gravity that will be used when overlaying layers.
       * @param {string} str 
       */
      gravity(str) {
        this.args.gravity = str;
        return this;
      }

      build() {
        return new Layer(this);
      }
    }
    return new Builder();
  }


  /**
   * @param {string} dest The desired output path for the render.
   * @returns {Promise<string>} Returns a Promise with the output path for the newly rendered layer.
   */
  Render(dest) {
    return new Promise((resolve, reject) => {

      // Render foundation (canvas)
      this.args.foundation.Render(dest).then(imgPath1 => {

        // Apply primitives or effects (check order)

        let action = null;

        if (this.args.drawPrimitivesFirst)
          action = DrawPrimitivesFirst(imgPath1, this.args.primitives, this.args.appliedEffects, imgPath1);
        else
          action = ApplyEffectsFirst(imgPath1, this.args.primitives, this.args.appliedEffects, imgPath1);


        action.then(outputPath=> {

          // Render any overlays

          let overlays = this.args.overlays;  // <- these are all Layer objects

          if (!overlays || overlays.length == 0) {
            resolve(outputPath);
            return;
          }
          else {
            let parentDir = LinuxCommands.Path.ParentDir(outputPath);
            let extension = GetFileExtension(outputPath);

            RenderOverlays(overlays, parentDir, extension).then(filepathOffsetPairs => {
              CreateComposite(outputPath, filepathOffsetPairs, this.args.gravity, outputPath).then(compOutputPath => {

                // Clean up overlay temp files

                let tempFilepaths = filepathOffsetPairs.map(x => x.filepath);
                LinuxCommands.Remove.Files(tempFilepaths, LocalCommand).then(success => {
                  resolve(compOutputPath);
                }).catch(error => reject(error));
              }).catch(error => reject(error));
            }).catch(error => reject(error));
          }
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  /**
   * @override
   */
  Errors() {
    let params = Layer.Parameters();
    let errors = [];
    let prefix = 'LAYER_ERROR';

    // foundation
    let foundationErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Foundation')
      .condition(
        new Err.ObjectCondition.Builder(this.args.foundation)
          .typeNames(params.foundation.types)
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (foundationErr)
      errors.push(foundationErr);


    // overlays
    let overlaysErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Overlays')
      .condition(
        new Err.ArrayCondition.Builder(this.args.overlays)
          .validType(params.overlays.type)
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (overlaysErr)
      errors.push(overlaysErr);

    // applied effects
    let appliedEffectsErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Applied effects')
      .condition(
        new Err.ArrayCondition.Builder(this.args.appliedEffects)
          .validType(params.appliedEffects.type)
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (appliedEffectsErr)
      errors.push(appliedEffectsErr);

    // primitives
    let primitivesErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Primitives')
      .condition(
        new Err.ArrayCondition.Builder(this.args.primitives)
          .validType(params.primitives.type)
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (primitivesErr)
      errors.push(primitivesErr);

    // offset
    if (Validate.IsDefined(this.args.offset)) {
      let offsetErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Offset')
        .condition(
          new Err.ObjectCondition.Builder(this.args.offset)
            .typeName(params.offset.type)
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (offsetErr)
        errors.push(offsetErr);
    }

    // id
    if (Validate.IsDefined(this.args.id)) {
      let idErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('ID')
        .condition(
          new Err.StringCondition.Builder(this.args.id)
            .isEmpty(false)
            .isWhitespace(false)
            .build()
        )
        .build()
        .String();

      if (idErr)
        errors.push(idErr);
    }


    // drawPrimitivesFirst
    let drawPrimitivesFirstErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Draw primitives first flag')
      .condition(
        new Err.BooleanCondition.Builder(this.args.drawPrimitivesFirst)
          .build()
      )
      .build()
      .String();

    if (drawPrimitivesFirstErr)
      errors.push(drawPrimitivesFirstErr);

    // gravity
    let gravityErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Gravity')
      .condition(
        new Err.StringCondition.Builder(this.args.gravity)
          .isEmpty(false)
          .isWhitespace(false)
          .include(params.gravity.options)
          .build()
      )
      .build()
      .String();

    if (gravityErr)
      errors.push(gravityErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      foundation: {
        category: 'drawable',
        types: ['Drawables.Canvases', 'Drawables.Effects'],
        required: true
      },
      overlays: {
        category: 'drawable',
        type: 'Layer.Layer',
        isArray: true,
        required: false
      },
      appliedEffects: {
        category: 'drawable',
        type: 'Drawables.Effects',
        isArray: true,
        required: false
      },
      primitives: {
        category: 'drawable',
        type: 'Drawables.Primitives',
        isArray: true,
        required: false
      },
      offset: {
        type: 'Inputs.Offset',
        required: false
      },
      id: {
        type: 'string',
        required: false
      },
      drawPrimitivesFirst: {
        type: 'boolean',
        default: true,
        required: false
      },
      gravity: {
        type: 'string',
        options: GravityValues,
        required: false
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.Layer = Layer;