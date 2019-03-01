let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//-----------------------------------

class ImageCanvas extends CanvasBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ImageCanvas';
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
       * @param {string} str The source path.
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {Array<Primitive>} primitivesArr A list of Primitive types to draw onto the canvas (Optional)
       */
      primitives(primitivesArr) {
        this.primitives = primitivesArr;
        return this;
      }

      build() {
        return new ImageCanvas(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override 
   **/
  Args() {
    let args = [this.args.source];

    if (this.primitives.length > 0)
      this.primitives.forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = ImageCanvas.Parameters();
    let errors = [];
    let prefix = 'IMAGE_CANVAS_ERROR';

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

    // Check optional args

    if (this.primitives) {
      let primitivesErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Primitives')
        .condition(
          new Err.ArrayCondition.Builder(this.args.primitives)
            .validType('Primitive')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (primitivesErr)
        errors.push(primitivesErr);
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
      source: {
        type: 'string'
      },
      primitives: {
        type: 'Primitive',
        isArray: true
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.ImageCanvas = ImageCanvas;