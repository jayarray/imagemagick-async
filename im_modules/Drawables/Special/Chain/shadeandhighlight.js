let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ChainBaseClass = require(Path.join(Filepath.SpecialChainDir(), 'chainbaseclass.js')).ChainBaseClass;
let Chain = require(Path.join(Filepath.SpecialChainDir(), 'chain.js')).Chain;
let Item = require(Path.join(Filepath.SpecialChainDir(), 'item.js'));
let Mask = require(Path.join(Filepath.ModMasksDir(), 'mask.js')).Mask;
let Layer = require(Path.join(Filepath.LayerDir(), 'layer.js')).Layer;
let Impression = require(Path.join(Filepath.FxDir(), 'impression.js')).Impression;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));
let LinuxCommands = require('linux-commands-async');

//---------------------------------

class ShadeAndHighlight extends ChainBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ShadeAndHighlight';
        this.args = {};
      }

      /**
       * @param {string} str The path of the image file you are modifying.
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {number} n Value determines the direction of the light source. A value of zero degrees starts east of the screen. A positive value indicates clockwise direction and a negative value indicates counter clockwisem direction.
       */
      direction(n) {
        this.args.direction = n;
        return this;
      }

      /**
       * @param {number} n Value determines the elevation of the light source. A Value of zero degrees indicates the light source is parallel to the image, and a value of 90 degrees indicates the light source is right above the image.
       */
      elevation(n) {
        this.args.elevation = n;
        return this;
      }

      build() {
        return new ShadeAndHighlight(this);
      }
    }
    return new Builder();
  }

  /**
   * @override 
   */
  Chain() {
    let source = this.args.source;
    let sourceFormat = LinuxCommands.Path.Extension(source).replace('.', '');
    let sourceParentDir = LinuxCommands.Path.ParentDir(source);
    let tempDirPath = Path.join(sourceParentDir, Guid.Create());

    let chainBuilder = Chain.Builder
      .setTempDirPath(tempDirPath);


    // (1) Create shaded image without using 90x90 (light source NOT directly above image)

    let elevatedShade = Impression.Builder
      .source(source)
      .direction(this.args.direction)
      .elevation(this.args.elevation)
      .build();

    let elevateLayer = Layer.Builder
      .foundation(elevatedShade)
      .build();

    let tempFilename1 = Guid.Filename(Guid.DEFAULT_LENGTH, sourceFormat);
    let tempOutputPath1 = Path.join(tempDirPath, tempFilename1);

    let renderItem1 = Item.RenderItem.Builder
      .setOutputPath(tempOutputPath1)
      .setLayer(elevateLayer)
      .build();

    chainBuilder = chainBuilder.add(renderItem1);


    // (2) Create shaded image using 90x90 (light source IS directly above image)

    let directLightShade = Impression.Builder
      .source(this.args.source)
      .direction(90)
      .elevation(90)
      .build();

    let directLightLayer = Layer.Builder
      .foundation(directLightShade)
      .build();

    let tempFilename2 = Guid.Filename(Guid.DEFAULT_LENGTH, sourceFormat);
    let tempOutputPath2 = Path.join(tempDirPath, tempFilename2);

    let renderItem2 = Item.RenderItem.Builder
      .setOutputPath(tempOutputPath2)
      .setLayer(directLightLayer)
      .build();

    chainBuilder = chainBuilder.add(renderItem2);


    // 3) Combine (1) and (2) (in that order) to create a hollow "shaded shape"

    let tempFilename3 = Guid.Filename(Guid.DEFAULT_LENGTH, sourceFormat);
    let tempOutputPath3 = Path.join(tempDirPath, tempFilename3);
    let cmdStr = `convert ${tempOutputPath1} \\( ${tempOutputPath2} -normalize -negate \\) -alpha Off -compose CopyOpacity -composite ${tempOutputPath3}`;

    let cmdStrItem = Item.CommandStringItem.Builder
      .setOutputPath(tempOutputPath3)
      .setCommand(cmdStr)
      .build();

    chainBuilder = chainBuilder.add(cmdStrItem);
    chainBuilder = chainBuilder.setOutputPath(tempOutputPath3);

    // Return object
    
    let chainObj = chainBuilder.build();
    return chainObj;
  }

  /**
    * @override
    */
  Errors() {
    let params = ShadeAndHighlight.Parameters();
    let errors = [];
    let prefix = 'SHADE_AND_HIGHLIGHT_SPECIAL_CHAIN_ERROR';

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);

    let directionErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Direction')
      .condition(
        new Err.NumberCondition.Builder(this.args.direction)
          .build()
      )
      .build()
      .String();

    if (directionErr)
      errors.push(directionErr);


    let elevationErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Elevation')
      .condition(
        new Err.NumberCondition.Builder(this.args.elevation)
          .build()
      )
      .build()
      .String();

    if (elevationErr)
      errors.push(elevationErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string'
      },
      direction: {
        type: 'number',
      },
      elevation: {
        type: 'number',
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.ShadeAndHighlight = ShadeAndHighlight;