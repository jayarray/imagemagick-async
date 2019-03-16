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
// Perspective distortion

class BarrelDistortion extends DistortBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'BarrelDistortion';
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
       * @param {number} n
       */
      a(n) {
        this.args.a = n;
        return this;
      }

      /**
       * @param {number} n
       */
      b(n) {
        this.args.b = n;
        return this;
      }

      /**
       * @param {number} n
       */
      c(n) {
        this.args.c = n;
        return this;
      }

      /**
       * @param {number} n  (Optional)
       */
      d(n) {
        this.args.d = n;
        return this;
      }

      /**
       * @param {Coordinates} coordinates Can be provided after declaring the d-value. (Optional)
       */
      center(coordinates) {
        this.args.center = coordinates;
        return this;
      }

      build() {
        return new BarrelDistortion(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Barrel'];
    let barrelStr = `${this.args.a} ${this.args.b} ${this.args.c}`;

    if (Validate.IsDefined(this.args.d))
      barrelStr += ` ${this.args.d}`;

    if (this.args.center)
      barrelStr += ` ${this.args.center.String()}`;
    args.push(barrelStr);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = BarrelDistortion.Parameters();
    let errors = [];
    let prefix = 'BARREL_DISTORTION_DISTORT_TRANSFORM_ERROR';

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

    let aErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('A-value')
      .condition(
        new Err.NumberCondition.Builder(this.args.a)
          .build()
      )
      .build()
      .String();

    if (aErr)
      errors.push(aErr);

    let bErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('B-value')
      .condition(
        new Err.NumberCondition.Builder(this.args.b)
          .build()
      )
      .build()
      .String();

    if (bErr)
      errors.push(bErr);

    let cErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('C-value')
      .condition(
        new Err.NumberCondition.Builder(this.args.c)
          .build()
      )
      .build()
      .String();

    if (cErr)
      errors.push(cErr);

    if (Validate.IsDefined(this.args.d)) {
      let dErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('D-value')
        .condition(
          new Err.NumberCondition.Builder(this.args.d)
            .build()
        )
        .build()
        .String();

      if (dErr)
        errors.push(dErr);
    }

    if (Validate.IsDefined(this.args.center)) {
      let centerErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Center')
        .condition(
          new Err.ObjectCondition.Builder(this.args.center)
            .typeName('Coordinates')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (centerErr)
        errors.push(centerErr);
    }

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
      a: {
        type: 'number'
      },
      b: {
        type: 'number'
      },
      c: {
        type: 'number'
      },
      d: {
        type: 'number'
      },
      center: {
        type: 'Coordinates'
      }
    };
  }
}

//--------------------------

// EXPORTs

exports.BarrelDistortion = BarrelDistortion;