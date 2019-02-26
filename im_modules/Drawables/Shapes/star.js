let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let PathPrimitive = require(Path.join(Filepath.PrimitivesDir(), 'path.js')).Path;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let HelperFunctions = require(Path.join(Filepath.ShapesDir(), 'helperfunctions.js'));
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

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
       * @param {number} n Number of points on the star. 
       */
      vertices(n) {
        this.args.vertices = n;
        return this;
      }

      /**
       * @param {Coordinates} coordinates The center of the star.
       */
      center(coordinates) {
        this.args.center = coordinates;
        return this;
      }


      /**
       * @param {Coordinates} coordinates A point belonging to the star.
       */
      vertex(coordinates) {
        this.args.vertex = coordinates;
        return this;
      }

      /**
       * @param {number} n Factor equal to or greater than zero that affects the thickness of the star. The higher the value, the more 'bloated' the star will look, and will eventually invert.
       */
      bloat(n) {
        this.args.bloat = n;
        return this;
      }

      /**
       * @param {Color} color The color of the outline of the star. (Optional)
       */
      strokeColor(color) {
        this.args.strokeColor = color;
        return this;
      }

      /**
       * @param {number} n Width of the outline of the star. Larger values produce thicker lines. (Optional)
       */
      strokeWidth(n) {
        this.args.strokeWidth = n;
        return this;
      }

      /**
       * @param {Color} color The color that will fill the star. (Optional)
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
        return new Star(this);
      }
    }
    return new Builder();
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

    let minorVertex = Coordinates.Builder
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
    let path = PathPrimitive.Builder
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
    let prefix = 'STAR_SHAPE_ERROR';

    // Check required args

    let verticesErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Vertices')
      .condition(
        new Err.NumberCondition.Builder(this.argsw.vertices)
          .isInteger(true)
          .min(params.vertices.min)
          .build()
      )
      .build()
      .String();

    if (verticesErr)
      errors.push(verticesErr);

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
      erorrs.push(centerErr);

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
      erorrs.push(vertexErr);

    // Check optional args

    if (!Validate.IsInteger(this.args.bloat)) {
      let bloatErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Bloat')
        .condition(
          new Err.NumberCondition.Builder(this.args.bloat)
            .isInteger(true)
            .min(params.bloat.min)
            .build()
        )
        .build()
        .String();

      if (bloatErr)
        errors.push(bloatErr);
    }

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
        erorrs.push(strokeColorErr);
    }

    if (!Validate.IsInteger(this.args.strokeWidth)) {
      let strokeWidthErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke width')
        .condition(
          new Err.NumberCondition.Builder(this.args.strokeWidth)
            .isInteger(true)
            .min(params.strokeWidth.min)
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
        erorrs.push(fillColorErr);
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