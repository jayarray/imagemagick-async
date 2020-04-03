let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let SpecialBaseClass = require(Path.join(Filepath.SpecialDir(), 'specialbaseclass.js')).SpecialBaseClass;
let Impression = require(Path.join(Filepath.FxDir(), 'impression.js')).Impression;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));
let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//---------------------------------

class ShadeAndHighlight extends SpecialBaseClass {
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
  Render(dest) {
    return new Promise((resolve, reject) => {

      let source = this.args.source;
      let sourceFormat = LinuxCommands.Path.Extension(source).replace('.', '');
      let destParentDir = LinuxCommands.Path.ParentDir(dest);

      // Create shaded image without using 90x90 (light source NOT directly above image)

      let elevatedShade = Impression.Builder
        .source(source)
        .direction(this.args.direction)
        .elevation(this.args.elevation)
        .build();

      let tempFilename1 = Guid.Filename(Guid.DEFAULT_LENGTH, sourceFormat);
      let tempFilepath1 = Path.join(destParentDir, tempFilename1);

      elevatedShade.Render(tempFilepath1).then(outputPath1 => {

        // Create shaded image using 90x90 (light source IS directly above image)

        let directLightShade = Impression.Builder
          .source(this.args.source)
          .direction(90)
          .elevation(90)
          .build();

        let tempFilename2 = Guid.Filename(Guid.DEFAULT_LENGTH, sourceFormat);
        let tempFilepath2 = Path.join(destParentDir, tempFilename2);

        directLightShade.Render(tempFilepath2).then(outputPath2 => {

          // Combine 1st and 2nd render (in that order) to create a hollow "shaded shape"

          let cmdStr = `convert ${tempFilepath1} \\( ${tempFilepath2} -normalize -negate \\) -alpha Off -compose CopyOpacity -composite ${dest}`;

          LocalCommand.Execute(cmdStr, []).then(output => {
            if (output.stderr) {
              reject(output.stderr);
              return;
            }

            // Clean up temp files
            LinuxCommands.Remove.Files([tempFilepath1, tempFilepath2], LocalCommand).then(success => {

              // Return render location
              resolve(dest);
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
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
        type: 'string',
        required: true
      },
      direction: {
        type: 'number',
        required: true
      },
      elevation: {
        type: 'number',
        required: true
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.ShadeAndHighlight = ShadeAndHighlight;