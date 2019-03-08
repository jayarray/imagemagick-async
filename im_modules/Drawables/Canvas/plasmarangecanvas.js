let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//----------------------------------------
// COLOR CANVAS

class PlasmaRangeCanvas extends CanvasBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'PlasmaRangeCanvas';
        this.args = {};
        this.primitives = [];
      }

      /**
       * @param {number} n Width in pixels. 
       */
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n Height in pixels.
       */
      height(n) {
        this.args.height = n;
        return this;
      }

      /**
       * @param {Color} color Start color for the plasma.
       */
      startColor(color) {
        this.args.startColor = color;
        return this;
      }

      /**
       * @param {Color} color End color for the plasma.
       */
      endColor(color) {
        this.args.endColor = color;
        return this;
      }

      build() {
        return new PlasmaRangeCanvas(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let plasmaStr = 'plasma:';

    if (this.args.startColor) {
      if (this.args.endColor)
        plasmaStr += `${this.args.startColor.String()}-${this.args.endColor.String()}`;
      else
        plasmaStr += this.args.startColor.String();
    }

    let args = ['-size', `${this.args.width}x${this.args.height}`, plasmaStr];

    return args;
  }


  /**
   * @override
   */
  Errors() {
    let params = PlasmaRangeCanvas.Parameters();
    let errors = [];
    let prefix = 'PLASMA_RANGE_CANVAS_ERROR';

    // Check required args

    let widthErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Width')
      .condition(
        new Err.NumberCondition.Builder(this.args.width)
          .isInteger(true)
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
          .isInteger(true)
          .min(params.height.min)
          .build()
      )
      .build()
      .String();

    if (heightErr)
      errors.push(heightErr);

    let startColorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Start color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.startColor)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (startColorErr)
      errors.push(startColorErr);

    // Check optional args

    if (this.args.endColor) {
      let endColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('End color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.color)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (endColorErr)
        errors.push(endColorErr);
    }

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
        min: 1
      },
      height: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      startColor: {
        type: 'Color'
      },
      endColor: {
        type: 'Color'
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.PlasmaRangeCanvas = PlasmaRangeCanvas;