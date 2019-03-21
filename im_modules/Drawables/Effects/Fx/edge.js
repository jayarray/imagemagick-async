let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Edge extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Edge';
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
       * @param {number} n Value used to determine how thick to draw edges around an image. The higher the value, the thicker the lines.
       */
      edgeValue(n) {
        this.args.edgeValue = n;
        return this;
      }

      build() {
        return new Edge(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-edge', this.args.edgeValue];
  }

  /**
     * @override
     */
  Errors() {
    let params = Edge.Parameters();
    let errors = [];
    let prefix = 'EDGE_FX_ERROR';

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

    let edgeValueErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Edge value')
      .condition(
        new Err.NumberCondition.Builder(this.args.edgeValue)
          .isInteger(true)
          .min(params.edgeValue.min)
          .build()
      )
      .build()
      .String();

    if (edgeValueErr)
      errors.push(edgeValueErr);

    return errors;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return true;
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
      edgeValue: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        required: true
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Edge = Edge;