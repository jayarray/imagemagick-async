let Path_ = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let Path = require(Path_.join(Filepath.PrimitivesDir(), 'path.js')).Path;
let Coordinates = require(Path_.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let HelperFunctions = require(Path_.join(Filepath.ShapesDir(), 'helperfunctions.js'));
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//---------------------------------

class Star extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Star';
        this.args = {};
      }

      /**
       * @param {number} vertices Number of points on the star. 
       */
      vertices(vertices) {
        this.args.vertices = vertices;
        return this;
      }

      /**
       * @param {Coordinates} center The center of the star.
       */
      center(center) {
        this.args.center = center;
        return this;
      }


      /**
       * @param {Coordinates} vertex A point belonging to the star.
       */
      vertex(vertex) {
        this.args.vertex = vertex;
        return this;
      }

      /**
       * @param {number} bloat Factor equal to or greater than zero that affects the thickness of the star. The higher the value, the more 'bloated' the star will look, and will eventually invert.
       */
      bloat(bloat) {
        this.args.bloat = bloat;
        return this;
      }

      /**
       * @param {Color} strokeColor The color of the outline of the star. (Optional)
       */
      strokeColor(strokeColor) {
        this.args.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {number} strokeWidth Width of the outline of the star. Larger values produce thicker lines. (Optional)
       */
      strokeWidth(strokeWidth) {
        this.args.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * @param {Color} fillColor The color that will fill the star. (Optional)
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
        return new Star(this);
      }
    }
    return Builder;
  }

  /** 
   * @override
   */
  Args() {
    // Get all major vertices
    let majorDegrees = 360 / this.args.vertices;
    let majorVertices = [this.args.vertex];

    for (let i = 0; i < this.args.vertices - 1; ++i) {
      let rotatedPoint = HelperFunctions.GetRotatedPoint(this.args.center, this.args.vertex, majorDegrees * (i + 1));
      majorVertices.push(rotatedPoint);
    }

    // Compute minor vertex
    let slope = HelperFunctions.GetSlope(this.args.center, this.args.vertex);
    let yIntercept = this.args.center.args.y - (this.args.center.args.x * slope);
    let minorX = null;
    let minorY = null;

    if (this.args.center.args.x == this.args.vertex.args.x) { // Vertical slope
      minorX = this.args.center.args.x;
      minorY = this.args.center.args.y < this.args.vertex.args.y ? this.args.center.args.y + this.args.bloat : this.args.center.args.y - this.args.bloat;
    }
    else {
      if (this.args.center.args.y == this.args.vertex.args.y) { // Horizontal slope
        minorX = this.args.center.args.x > this.args.vertex.args.x ? this.args.center.args.x - this.args.bloat : this.args.center.args.x + this.args.bloat;
        minorY = this.args.center.args.y;
      }
      else { // Diagonal slope
        minorX = this.args.center.args.x < this.args.vertex.args.x ? this.args.center.args.x + this.args.bloat : this.args.center.args.x - this.args.bloat;
        minorY = (slope * minorX) + yIntercept;
      }
    }

    // Get all minor vertices
    let minorDegrees = majorDegrees / 2;

    let minorVertex = Coordinates.Builder()
      .x(parseInt(minorX))
      .y(parseInt(minorY))
      .build();

    let rotatedMinorVertex = HelperFunctions.GetRotatedPoint(this.args.center, minorVertex, minorDegrees);
    let minorVertices = [rotatedMinorVertex];

    for (let i = 0; i < this.args.vertices - 1; ++i) {
      let rotatedPoint = HelperFunctions.GetRotatedPoint(this.args.center, rotatedMinorVertex, majorDegrees * (i + 1));
      minorVertices.push(rotatedPoint);
    }

    // Connect major and minor vertices in alternating order
    let combinedVertices = [];
    for (let i = 0; i < this.args.vertices; ++i) {
      combinedVertices.push(majorVertices[i], minorVertices[i]);
    }

    // Build path
    let path = Path.Builder()
      .points(combinedVertices)
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
    let params = Star.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.vertices))
      errors.push('STAR_SHAPE_ERROR: Vertices is undefined.');
    else {
      if (!Validate.IsInteger(this.args.vertices))
        errors.push('STAR_SHAPE_ERROR: Vertices is not an integer.');
      else {
        if (this.args.vertices < params.vertices.min)
          errors.push(`STAR_SHAPE_ERROR: Vertices is out of bounds. Assigned value is: ${this.args.vertices}. Value must be greater than or equal to ${params.vertices.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.center))
      errors.push('STAR_SHAPE_ERROR: Center is undefined.');
    else {
      if (this.args.center.type != 'Coordinates')
        errors.push('STAR_SHAPE_ERROR: Center is not a Coordinates object.');
      else {
        let errs = this.args.center.Errors();
        if (errs.length > 0)
          errors.push(`STAR_SHAPE_ERROR: Center has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.vertex))
      errors.push('STAR_SHAPE_ERROR: Vertex is undefined.');
    else {
      if (this.args.vertex.type != 'Coordinates')
        errors.push('STAR_SHAPE_ERROR: Vertex is not a Coordinates object.');
      else {
        let errs = this.args.vertex.Errors();
        if (errs.length > 0)
          errors.push(`STAR_SHAPE_ERROR: Vertex has errors: ${errs.join(' ')}`);
      }
    }

    // Check optional args

    if (this.args.bloat) {
      if (!Validate.IsInteger(this.args.bloat))
        errors.push('STAR_SHAPE_ERROR: Bloat is not an integer.');
      else {
        if (this.args.bloat < params.bloat.min)
          errors.push(`STAR_SHAPE_ERROR: Bloat is out of bounds. Assigned value is: ${this.args.bloat}. Value must be greater than or equal to ${params.bloat.min}.`);
      }
    }

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type != 'Color')
        errors.push('STAR_SHAPE_ERROR: Stroke color is not a Color object.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`STAR_SHAPE_ERROR: Stroke color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsInteger(this.args.strokeWidth))
        errors.push('STAR_SHAPE_ERROR: Stroke width is not an integer.');
      else {
        if (this.args.strokeWidth < params.strokeWidth.min)
          errors.push(`STAR_SHAPE_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${params.strokeWidth.min}.`);
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type != 'Color')
        errors.push('STAR_SHAPE_ERROR: Fill color is not a Color object.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`STAR_SHAPE_ERROR: Fill color has errors: ${errs.join(' ')}`);
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      vertices: {
        type: 'number',
        subtype: 'integer',
        min: 4
      },
      center: {
        type: 'Coordinates'
      },
      vertex: {
        type: 'Coordinates'
      },
      bloat: {
        type: 'number',
        subtype: 'integer',
        min: 0
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

//---------------------------
// EXPORTS

exports.Star = Star;