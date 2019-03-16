let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let MaskBaseClass = require(Path.join(Filepath.ModMasksDir(), 'maskbaseclass.js')).MaskBaseClass;

//------------------------------

class ColorMask extends MaskBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ColorMask';
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
       * @param {Color} color
       */
      color(color) {
        this.args.color = color;
        return this;
      }

      build() {
        return new ColorMask(this);
      }
    }
    return new Builder();
  }


  /**
   * @override
   */
  Args() {
    return ['-alpha', 'extract', '-background', this.args.color.String(), '-alpha', 'shape'];
  }

  /**
   * @override
   */
  Errors() {
    let params = ColorMask.Parameters();
    let errors = [];
    let prefix = 'COLOR_MASK_MASK_MOD_ERROR';

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isempty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);

    let colorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.color)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (colorErr)
      errors.push(colorErr);

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
      color: {
        type: 'Color'
      }
    }
  }
}

//----------------------
// EXPORTS

exports.ColorMask = ColorMask;