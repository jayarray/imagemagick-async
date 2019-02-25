let Path_ = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let HelperFunctions = require(Path_.join(Filepath.ShapesDir(), 'helperfunctions.js'));
let Path = require(Path_.join(Filepath.PrimitivesDir(), 'path.js')).Path;
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

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
       * @param {number} sides The number of sides on the polygon.
       */
      sides(sides) {
        this.args.sides = sides;
        return this;
      }

      /**
       * @param {Coordinates} center The center of the polygon.
       */
      center(center) {
        this.args.center = center;
        return this;
      }

      /**
       * @param {Coordinates} vertex A vertex belonging to the polygon. Determines the distance from center for all other vertices.
       */
      vertex(vertex) {
        this.args.vertex = vertex;
        return this;
      }

      /**
       * @param {Color} strokecolor The color of the outline that makes up the polygon. (Optional)
       */
      strokeColor(strokecolor) {
        this.args.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {number} strokeWidth Width of the outline that makes up the polygon. Larger values produce thicker lines. (Optional)
       */
      strokeWidth(strokeWidth) {
        this.args.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * @param {Color} fillColor The color that will fill the polygon. (Optional)
       */
      fillColor(fillColor) {
        this.args.fillColor = fillColor;
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
    return Builder;
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
    let path = Path.Builder()
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

    // Check required args

    if (!Validate.IsDefined(this.args.sides))
      errors.push('POLYGON_SHAPE_ERROR: Sides is undefined.');
    else {
      if (!Validate.IsInteger(this.args.sides))
        errors.push('POLYGON_SHAPE_ERROR: Sides is not an integer.');
      else {
        if (this.args.sides < params.sides.min)
          errors.push(`POLYGON_SHAPE_ERROR: Sides is out of bounds. Assigned value is: ${this.args.sides}. Value must be greater than or equal to ${params.sides.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.center))
      errors.push('POLYGON_SHAPE_ERROR: Center is undefined.');
    else {
      if (this.args.center.type != 'Coordinates')
        errors.push('POLYGON_SHAPE_ERROR: Center is not a Coordinates object.');
      else {
        let errs = this.args.center.Errors();
        if (errs.length > 0)
          errors.push(`POLYGON_SHAPE_ERROR: Center has errros: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.vertex))
      errors.push('POLYGON_SHAPE_ERROR: Vertex is undefined.');
    else {
      if (this.args.vertex.type != 'Coordinates')
        errors.push('POLYGON_SHAPE_ERROR: Vertex is not a Coordinates object.');
      else {
        let errs = this.args.vertex.Errors();
        if (errs.length > 0)
          errors.push(`POLYGON_SHAPE_ERROR: Vertex has errros: ${errs.join(' ')}`);
      }
    }

    // Check optional args

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type != 'Color')
        errors.push('POLYGON_SHAPE_ERROR: Stroke color is not a Color object.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`POLYGON_SHAPE_ERROR: Stroke color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsInteger(this.args.strokeWidth))
        errors.push('POLYGON_SHAPE_ERROR: Stroke width is not an integer.');
      else {
        if (this.args.strokeWidth < params.strokeWidth.min)
          errors.push(`POLYGON_SHAPE_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${params.strokeWidth.min}.`);
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type != 'Color')
        errors.push('POLYGON_SHAPE_ERROR: Fill color is not a Color object.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`POLYGON_SHAPE_ERROR: Fill color has errors: ${errs.join(' ')}`);
      }
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