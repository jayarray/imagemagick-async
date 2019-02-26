let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let HelperFunctions = require(Path.join(Filepath.ShapesDir(), 'helperfunctions.js'));
let PathPrimitive = require(Path.join(Filepath.PrimitivesDir(), 'path.js')).Path;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-------------------------------

class Polygon extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Polygon';
        this.args = {};
      }

      /**
       * @param {number} n The number of sides on the polygon.
       */
      sides(n) {
        this.args.sides = n;
        return this;
      }

      /**
       * @param {Coordinates} coordinates The center of the polygon.
       */
      center(coordinates) {
        this.args.center = coordinates;
        return this;
      }

      /**
       * @param {Coordinates} coordinates A vertex belonging to the polygon. Determines the distance from center for all other vertices.
       */
      vertex(coordinates) {
        this.args.vertex = coordinates;
        return this;
      }

      /**
       * @param {Color} color The color of the outline that makes up the polygon. (Optional)
       */
      strokeColor(color) {
        this.args.strokeColor = color;
        return this;
      }

      /**
       * @param {number} n Width of the outline that makes up the polygon. Larger values produce thicker lines. (Optional)
       */
      strokeWidth(n) {
        this.args.strokeWidth = n;
        return this;
      }

      /**
       * @param {Color} color The color that will fill the polygon. (Optional)
       */
      fillColor(color) {
        this.args.fillColor = color;
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
        return new Polygon(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override
   */
  Args() {
    // Rotate points
    let degrees = 360 / this.args.sides;
    let vertices = [this.args.vertex];

    for (let i = 0; i < this.args.sides - 1; ++i) {
      let currDegrees = degrees * (i + 1);
      let rotatedPoint = HelperFunctions.GetRotatedPoint(this.args.center, this.args.vertex, currDegrees);
      vertices.push(rotatedPoint);
    }

    // Build path
    let path = PathPrimitive.Builder
      .points(vertices)
      .strokeColor(this.args.strokeColor)
      .strokeWidth(this.args.strokeWidth)
      .fillColor(this.args.fillColor)
      .isClosed(true)
      .build();

    return path.Args();
  }

  /**
   * @override
   */
  Errors() {
    let params = Polygon.Parameters();
    let errors = [];
    let prefix = 'POLYGON_SHAPE_ERROR';

    // Check required args

    let sidesErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Sides')
      .condition(
        new Err.NumberCondition.Builder(this.args.sides)
          .isInteger(true)
          .min(params.sides.min)
          .build()
      )
      .build()
      .String();

    if (sidesErr)
      errors.push(sidesErr);

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

    let vertexErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Vertex')
      .condition(
        new Err.ObjectCondition.Builder(this.args.vertex)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (vertexErr)
      errors.push(vertexErr);

    // Check optional args

    if (this.args.strokeColor) {
      let strokeColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.strokeColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (strokeColorErr)
        errors.push(strokeColorErr);
    }

    if (this.args.strokeWidth) {
      let strokeWidthErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke width')
        .condition(
          new Err.NumberCondition.Builder(this.args.strokeWidth)
            .isInteger(true)
            .min(params.sides.min)
            .build()
        )
        .build()
        .String();

      if (strokeWidthErr)
        errors.push(strokeWidthErr);
    }

    if (this.args.fillColor) {
      let fillColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Fill color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.fillColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (fillColorErr)
        errors.push(fillColorErr);
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      sides: {
        type: 'number',
        subtype: 'integer',
        min: 3
      },
      center: {
        type: 'Coordinates'
      },
      vertex: {
        type: 'Coordinates'
      },
      strokeColor: {
        type: 'Color'
      },
      strokeWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      fillColor: {
        type: 'Color'
      }
    };
  }
}

//-----------------------
// EXPORTS

exports.Polygon = Polygon;