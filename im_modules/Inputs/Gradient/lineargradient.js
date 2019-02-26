let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let GradientBaseClass = require(Path.join(Filepath.GradientDir(), 'gradientbaseclass.js')).GradientBaseClass;

//-----------------------------

class LinearGradient extends GradientBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'LinearGradient';
        this.args = {};
      }

      /**
       * @param {Color} color Start color for linear gradient.
       */
      startColor(color) {
        this.args.startColor = color;
        return this;
      }

      /**
       * @param {Color} color End color for linear gradient.
       */
      endColor(color) {
        this.args.endColor = color;
        return this;
      }

      /**
       * @param {Vector} vector Vector that defines where the gradient will move through. (Optional)
       */
      vector(vector) {
        this.args.vector = vector;
        return this;
      }

      /**
       * @param {number} n Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up). (Optional)
       */
      angle(n) {
        this.args.angle = n;
        return this;
      }

      /**
       * @param {BoundingBox} boundingBox Limits the gradient to a larger or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background. (Optional)
       */
      boundingBox(boundingBox) {
        this.args.boundingBox = boundingBox;
        return this;
      }

      /**
       * @param {string} str Specifies the direction of the linear gradient towards the top/bottom/left/right or diagonal corners. Valid values are: NorthWest, North, Northeast, West, East, SouthWest, South, SouthEast. (Optional)
       */
      direction(str) {
        this.args.direction = str;
        return this;
      }

      /**
       * @param {string} str Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
       */
      extent(str) {
        this.args.extent = str;
        return this;
      }

      build() {
        return new LinearGradient(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override
   */
  Args() {
    let args = [];

    if (this.args.vector)
      args.push('-define', `gradient:vector=${this.args.vector.String()}`);

    if (this.args.angle)
      args.push('-define', `gradient:angle=${this.args.angle}`);

    if (this.args.boundingBox)
      args.push('-define', `gradient:bounding-box=${this.args.boundingBox.String()}`);

    if (this.args.direction)
      args.push('-define', `gradient:direction=${this.args.direction}`);

    if (this.args.extent)
      args.push('-define', `gradient:extent=${this.args.extent}`);

    args.push(`gradient:${this.args.startColor}-${this.args.endColor}`);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = LinearGradient.Parameters();
    let errors = [];
    let prefix = 'LINEAR_GRADIENT_ERROR';

    // Check required args

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

      let endColorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('End color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.endColor)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();
    
    if (endColorErr)
      errors.push(endColorErr);

    // Check optional args

    if (this.args.vector) {
      let vectorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Vector')
        .condition(
          new Err.ObjectCondition.Builder(this.args.vector)
            .typeName('Vector')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (vectorErr)
        errors.push(vectorErr);
    }
    
    if (this.args.angle) {
      let angleErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Angle')
        .condition(
          new Err.NumberCondition.Builder(this.args.angle)
            .build()
        )
        .build()
        .String();

      if (angleErr)
        errors.push(angleErr);
    }

    if (this.args.boundingBox) {
      let boundingBoxErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Bounding box')
        .condition(
          new Err.ObjectCondition.Builder(this.args.boundingBox)
            .typeName('BoundingBox')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (boundingBoxErr)
        errors.push(boundingBoxErr);
    }    

    if (this.args.direction) {
      let directionErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Direction')
        .condition(
          new Err.StringCondition.Builder(this.args.direction)
            .isEmpty(false)
            .isWhitespace(false)
            .include(params.direction.options)
            .build()
        )
        .build()
        .String();

      if (directionErr)
        errors.push(directionErr);
    }    

    if (this.args.extent) {
      let extentErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Extent')
        .condition(
          new Err.StringCondition.Builder(this.args.extent)
            .isEmpty(false)
            .isWhitespace(false)
            .include(params.extent.options)
            .built()
        )
        .build()
        .String();
    
      if (extentErr)
        errors.push(extentErr);
    }    

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      startColor: {
        type: 'Color'
      },
      endColor: {
        type: 'Color'
      },
      vector: {
        type: 'Vector'
      },
      boundingBox: {
        type: 'BoundingBox'
      },
      direction: {
        type: 'string',
        options: [
          'NorthWest',
          'North',
          'Northeast',
          'West',
          'East',
          'SouthWest',
          'South',
          'SouthEast'
        ]
      },
      extent: {
        type: 'string',
        options: [
          'Circle',
          'Diagonal',
          'Ellipse',
          'Maximum',
          'Minimum'
        ]
      }
    };
  }
}

//-------------------------------
// EXPORTs

exports.LinearGradient = LinearGradient;