let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DistortBaseClass = require(Path.join(Filepath.TransformDistortDir(), 'distortbaseclass.js')).DistortBaseClass;

//-----------------------------------

class PolarDistortion extends DistortBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'PolarDistortion';
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
       * @param {Coordinates} coordinates
       */
      center(coordinates) {
        this.args.center = coordinates;
        return this;
      }

      /**
       * @param {number}
       */
      radiusMin(n) {
        this.args.radiusMin = n;
        return this;
      }

      /**
       * @param {number}
       */
      radiusMax(n) {
        this.args.radiusMax = n;
        return this;
      }

      /**
       * @param {number}
       */
      startAngle(n) {
        this.args.startAngle = n;
        return this;
      }

      /**
       * @param {number}
       */
      endAngle(n) {
        this.args.endAngle = n;
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
        return new PolarDistortion(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let allInputsDefined = Validate.IsDefined(this.args.center)
      && Validate.IsDefined(this.args.radiusMin)
      && Validate.IsDefined(this.args.radiusMax)
      && Validate.IsDefined(this.args.startAngle)
      && Validate.IsDefined(this.args.endAngle);

    let args = ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Polar'];

    if (allInputsDefined) {
      let polarStr = `${this.args.radiusMax},${this.args.radiusMin} ${this.center.String()} ${this.args.startAngle},${this.args.endAngle}`;
      args.push(polarStr);
    }
    else
      args.push(0); // Default (standard) polar distortion

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = PolarDistortion.Parameters();
    let errors = [];
    let prefix = 'POLAR_DISTORTION_DISTORT_TRANSFORM_ERROR';

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

    if (Validate.IsDefined(this.args.radiusMin)) {
      let radiusMinErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Radius min')
        .condition(
          new Err.NumberCondition.Builder(this.args.radiusMin)
            .isInteger(true)
            .min(params.radiusMin.min)
            .build()
        )
        .build()
        .String();

      if (radiusMinErr)
        errors.push(radiusMinErr);
    }

    if (Validate.IsDefined(this.args.radiusMax)) {
      let radiusMaxErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Radius max')
        .condition(
          new Err.NumberCondition.Builder(this.args.radiusMax)
            .isInteger(true)
            .min(params.radiusMax.min)
            .build()
        )
        .build()
        .String();

      if (radiusMaxErr)
        errors.push(radiusMaxErr);
    }

    if (Validate.IsDefined(this.args.startAngle)) {
      let startAngleErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Start angle')
        .condition(
          new Err.NumberCondition.Builder(this.args.startAngle)
            .build()
        )
        .build()
        .String();

      if (startAngleErr)
        errors.push(startAngleErr);
    }

    if (Validate.IsDefined(this.args.endAngle)) {
      let endAngleErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('End angle')
        .condition(
          new Err.NumberCondition.Builder(this.args.endAngle)
            .build()
        )
        .build()
        .String();

      if (endAngleErr)
        errors.push(endAngleErr);
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
      center: {
        type: 'Coordinates'
      },
      radiusMin: {
        type: 'number',
        subtype: 'integer',
        min: 0
      },
      radiusMax: {
        type: 'number',
        subtype: 'integer',
        min: 0
      },
      startAngle: {
        type: 'number'
      },
      endAngle: {
        type: 'number'
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.PolarDistortion = PolarDistortion;