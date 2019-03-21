let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ExtentValues = require(Path.join(Filepath.ConstantsDir(), 'gradient_extent.json')).values;
let GradientBaseClass = require(Path.join(Filepath.GradientDir(), 'gradientbaseclass.js')).GradientBaseClass;

//-----------------------------

class RadialGradient extends GradientBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'RadialGradient';
        this.args = {};
      }

      /**
       * @param {Color} color Start color for radial gradient.
       */
      startColor(color) {
        this.args.startColor = color;
        return this;
      }

      /**
       * @param {Color} color End color for radial gradient.
       */
      endColor(color) {
        this.args.endColor = color;
        return this;
      }

      /**
       * @param {Coordinates} coordinates Coordinates for the center of the radial gradient. (Optional)
       */
      center(coordinates) {
        this.args.center = coordinates;
        return this;
      }

      /**
       * 
       * @param {number} n Width of the radial gradient. (Optional)
       */
      radialWidth(n) {
        this.args.radialWidth = n;
        return this;
      }

      /**
       * 
       * @param {number} n Height of the radial gradient. (Optional)
       */
      radialHeight(n) {
        this.args.radialHeight = n;
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
       * @param {string} str Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
       */
      extent(str) {
        this.args.extent = str;
        return this;
      }

      build() {
        return new RadialGradient(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override
   */
  Args() {
    let args = [];

    if (this.args.center)
      args.push('-define', `gradient:center=${this.args.center.String()}`);

    if (this.args.radialWidth || this.args.radialHeight) {
      if (this.args.radialWidth && this.args.radialHeight)
        args.push('-define', `gradient:radii=${this.args.radialWidth}, ${this.args.radialHeight}`);
      else {
        if (this.args.radialWidth)
          args.push('-define', `gradient:radii=${this.args.radialWidth}, ${this.args.radialWidth}`);
        else
          args.push('-define', `gradient:radii=${this.args.radialHeight}, ${this.args.radialHeight}`);
      }
    }

    if (this.args.angle)
      args.push('-define', `gradient:angle=${this.args.angle}`);

    if (this.args.boundingBox)
      args.push('-define', `gradient:bounding-box=${this.args.boundingBox.String()}`);

    if (this.args.extent)
      args.push('-define', `gradient:extent=${this.args.extent}`);

    args.push(`radial-gradient:${this.args.startColor.String()}-${this.args.endColor.String()}`);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = RadialGradient.Parameters();
    let errors = [];
    let prefix = 'RADIAL_GRADIENT_ERROR';

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

    if (this.args.center) {
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

    if (this.args.radialWidth) {
      let radialWidthErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Radial width')
        .condition(
          new Err.NumberCondition.Builder(this.args.radialWidth)
            .isInteger(true)
            .min(params.radialWidth.min)
            .build()
        )
        .build()
        .String();

      if (radialWidthErr)
        errors.push(radialWidthErr);
    }

    if (this.args.radialHeight) {
      let radialHeightErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Radial height')
        .condition(
          new Err.NumberCondition.Builder(this.args.radialHeight)
            .isInteger(true)
            .min(params.radialHeight.min)
            .build()
        )
        .build()
        .String();

      if (radialHeightErr)
        errors.push(radialHeightErr);
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

    if (this.args.boundinBox) {
      let boundingBoxErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Bounding box')
        .condition(
          new Err.ObjectCondition.Builder(this.args.boundinBox)
            .typeName('BoundingBox')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (boundingBoxErr)
        errors.push(boundingBoxErr);
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
            .build()
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
        type: 'Inputs.Color',
        required: true
      },
      endColor: {
        type: 'Inputs.Color',
        required: true
      },
      center: {
        type: 'Inputs.Coordinates',
        required: false
      },
      radialWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        required: false
      },
      radialHeight: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        required: false
      },
      angle: {
        type: 'number',
        required: false
      },
      boundinBox: {
        type: 'Inputs.Gradient.BoundingBox',
        required: false
      },
      extent: {
        type: 'string',
        options: ExtentValues,
        required: false
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.RadialGradient = RadialGradient;