let Path = require('path');
let RootDir = Path.resolve('.');
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
        this.offset = null;
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

      /**
       * @param {number} x 
       * @param {number} y 
       */
      offset(x, y) {
        this.offset = { x: x, y: y };
        return this;
      }

      build() {
        return new BarrelDistortion(this);
      }
    }
    return new Builder();
  }

  constructor(src, a, b, c, d, center) {
    super();
    this.src_ = src;
    this.a_ = a;
    this.b_ = b;
    this.c_ = c;
    this.d_ = d;
    this.center_ = center;
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
    let prefix = 'BARREL_DISTORTION_DISTORT_MOD_ERROR';

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