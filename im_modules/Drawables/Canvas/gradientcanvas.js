let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//-----------------------------------

class GradientCanvas extends CanvasBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'GradientCanvas';
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
       * @param {Gradient} gradient 
       */
      gradient(gradient) {
        this.args.gradient = gradient;
        return this;
      }

      build() {
        return new GradientCanvas(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-size', `${this.args.width}x${this.args.height}`].concat(this.args.gradient.Args());
  }

  /**
   * @override
   */
  Errors() {
    let params = GradientCanvas.Parameters();
    let errors = [];
    let prefix = 'GRADIENT_CANVAS_ERROR';

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

    let gradientErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Gradient')
      .condition(
        new Err.ObjectCondition.Builder(this.args.gradient)
          .typeName('Gradient')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (gradientErr)
      errors.push(gradientErr);

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
      gradient: {
        type: 'Gradient'
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.GradientCanvas = GradientCanvas;