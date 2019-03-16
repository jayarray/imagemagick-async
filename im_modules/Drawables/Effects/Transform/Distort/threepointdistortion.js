let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DistortBaseClass = require(Path.join(Filepath.TransformDistortDir(), 'distortbaseclass.js')).DistortBaseClass;

//-----------------------------------

class ThreePointDistortion extends DistortBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ThreePointDistortion';
        this.args = {};
      }

      /**
       * @param {string} str
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {Vector} vector
       */
      centerVector(vector) {
        this.args.centerVector = vector;
        return this;
      }

      /**
       * @param {Vector} vector
       */
      xAxisVector(vector) {
        this.args.xAxisVector = vector;
        return this;
      }

      /**
       * @param {Vector} vector
       */
      yAxisVector(vector) {
        this.args.yAxisVector = vector;
        return this;
      }

      build() {
        return new ThreePointDistortion(this);
      }
    }
    return new Builder();
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let cVectStr = `${this.args.centerVector.args.start.String()} ${this.args.centerVector.args.end.String()}`;
    let xVectStr = `${this.args.xAxisVector.args.start.String()} ${this.args.xAxisVector.args.end.String()}`;
    let yVectStr = `${this.args.yAxisVector.args.start.String()} ${this.args.yAxisVector.args.end.String()}`;
    return ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Affine', `${cVectStr} ${xVectStr} ${yVectStr}`];
  }

  /**
    * @override
    */
  Errors() {
    let params = ThreePointDistortion.Parameters();
    let errors = [];
    let prefix = 'THREE_POINT_DISTORTION_DISTORT_TRANSFORM_ERROR';

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

    let centerVectorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Center vector')
      .condition(
        new Err.ObjectCondition.Builder(this.args.centerVector)
          .typeName('Vector')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (centerVectorErr)
      errors.push(centerVectorErr);

    let xAxisVectorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('X-axis vector')
      .condition(
        new Err.ObjectCondition.Builder(this.args.xAxisVector)
          .typeName('Vector')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (xAxisVectorErr)
      errors.push(xAxisVectorErr);

    let yAxisVectorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Y-axis vector')
      .condition(
        new Err.ObjectCondition.Builder(this.args.yAxisVector)
          .typeName('Vector')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (yAxisVectorErr)
      errors.push(yAxisVectorErr);

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
      centerVector: {
        type: 'Vector'
      },
      xAxisVector: {
        type: 'Vector'
      },
      yAxisVector: {
        type: 'Vector'
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.Create = ThreePointDistortion.Create;
exports.Name = 'ThreePointDistortion';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';