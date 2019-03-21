let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------

class PointAndColor extends InputsBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'PointAndColor';
        this.name = 'PointAndColor';
        this.args = {};
      }

      /**
       * @param {Coordinates} coordinates 
       */
      point(coordinates) {
        this.args.point = coordinates;
        return this;
      }

      /**
       * @param {Color} color 
       */
      color(color) {
        this.args.color = color;
        return this;
      }

      build() {
        return new PointAndColor(this);
      }
    }
    return new Builder();
  }

  /** 
   * @returns {string} Returns a string representation of the point and color as 'x,y #rrggbb'. 
   */
  String() {
    let colorStr = this.args.color.String();
    return `${this.args.point.args.x},${this.args.point.args.y} ${colorStr}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'POINT_AND_COLOR_ERROR';

    let pointErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Point')
      .condition(
        new Err.ObjectCondition.Builder(this.args.point)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (pointErr)
      errors.push(pointErr);

    let colorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.color)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (colorErr)
      errors.push(colorErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      point: {
        type: 'Inputs.Coordinates',
        required: true
      },
      color: {
        type: 'Inputs.Color',
        required: true
      }
    };
  }
}

//--------------------------------
// EXPORTS

exports.PointAndColor = PointAndColor;