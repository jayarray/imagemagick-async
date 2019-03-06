let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DistortBaseClass = require(Path.join(Filepath.TransformDistortDir(), 'distortbaseclass.js')).DistortBaseClass;

//-----------------------------------
// Perspective distortion

class FourPointDistortion extends DistortBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'FourPointDistortion';
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
       * @param {Array<Coordinates>} coordinatesArr A set of at least 4 coordinates where the distortion begins. Must have same number of coordinates as control set 2.
       */
      controlSet1(coordinatesArr) {
        this.args.controlSet1 = coordinatesArr;
        return this;
      }

      /**
       * @param {Array<Coordinates>} coordinatesArr A set of at least 4 coordinates where the distortion ends. Must have same number of coordinates as control set 1.
       */
      controlSet2(coordinatesArr) {
        this.args.controlSet2 = coordinatesArr;
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
        return new FourPointDistortion(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let strArr = [];

    for (let i = 0; i < this.args.controlSet1.length; ++i) {
      let c1 = this.args.controlSet1[i];
      let c2 = this.args.controlSet2[i];
      let s = `${c1.String()} ${c2.String()}`;
      strArr.push(s);
    }

    return ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Perspective', strArr.join(' ')];
  }

  /**
    * @override
    */
  Errors() {
    let params = FourPointDistortion.Parameters();
    let errors = [];
    let prefix = 'FOUR_POINT_DISTORTION_DISTORT_TRANSFORM_ERROR';

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

    let controlSet1Err = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Control set 1')
      .condition(
        new Err.ArrayCondition.Builder(this.args.controlSet1)
          .validType('Coordinates')
          .minLength(params.controlSet1.min)
          .build()
      )
      .build()
      .String();

    if (controlSet1Err)
      errors.push(controlSet1Err);

    let controlSet2Err = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Control set 2')
      .condition(
        new Err.ArrayCondition.Builder(this.args.controlSet2)
          .validType('Coordinates')
          .minLength(params.controlSet2.min)
          .build()
      )
      .build()
      .String();

    if (controlSet2Err)
      errors.push(controlSet2Err);

    if (this.args.controlSet1.length != this.args.controlSet2.length)
      errors.push(`${prefix}: Control set sizes do not match.`);


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
      constrolSet1: {
        type: 'Coordinates',
        isArray: true,
        min: 4
      },
      constrolSet2: {
        type: 'Coordinates',
        isArray: true,
        min: 4
      }
    };
  }
}

//--------------------------

// EXPORTs

exports.FourPointDistortion = FourPointDistortion;