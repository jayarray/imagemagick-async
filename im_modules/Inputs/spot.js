let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------
// CONSTANTS

let SHAPES = {
  circle: 'circle',
  diamond: 'diamond',
  square: 'square'
};

//-------------------------------

class Spot extends InputsBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'Spot';
        this.name = 'Spot';

        this.args = {
          width: 5,
          height: 5,
          shape: SHAPES.circle,
          padding: 1
        };
      }

      /**
       * @param {number} n 
       */
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n 
       */
      height(n) {
        this.args.height = n;
        return this;
      }

      /**
       * @param {string} str
       */
      shape(str) {
        this.args.shape = str;
        return this;
      }

      /**
       * @param {number} n 
       */
      padding(n) {
        this.args.padding = n;
        return this;
      }

      build() {
        return new Spot(this);
      }
    }

    return new Builder();
  }

  SizeString() {
    return `${this.args.width}x${this.args.height}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'SPOT_ERROR';
    let params = Spot.Parameters();

    let widthErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Width')
      .condition(
        new Err.NumberCondition.Builder(this.args.width)
          .min(params.width.min)
          .build()
      )
      .build()
      .String();

    if (widthErr)
      errors.push(widthErr);


    let heightErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Height')
      .condition(
        new Err.NumberCondition.Builder(this.args.height)
          .min(params.height.min)
          .build()
      )
      .build()
      .String();

    if (heightErr)
      errors.push(heightErr);


    let shapeErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Shape')
      .condition(
        new Err.StringCondition.Builder(this.args.shape)
          .isEmpty(false)
          .isWhitespace(false)
          .include(SHAPES)
          .build()
      )
      .build()
      .String();

    if (shapeErr)
      errors.push(shapeErr);


    let paddingErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Padding')
      .condition(
        new Err.NumberCondition.Builder(this.args.padding)
          .min(params.padding.min)
          .build()
      )
      .build()
      .String();

    if (paddingErr)
      errors.push(paddingErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      width: {
        type: 'number',
        subtype: 'integer',
        min: 5,
        default: 5,
        required: false
      },
      height: {
        type: 'number',
        subtype: 'integer',
        min: 5,
        default: 5,
        required: false
      },
      shape: {
        type: 'string',
        default: SHAPES.circle,
        options: [SHAPES.circle, SHAPES.diamond, SHAPES.square],
        required: false
      },
      padding: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        default: 1,
        required: false
      }
    }
  }
}

//------------------------------------
// EXPORTS

exports.SHAPES = SHAPES;
exports.Spot = Spot;