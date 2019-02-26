let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------

class PointAndColor extends InputsBaseClass {
  constructor(properties) {
    super(properties);
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
    return Builder;
  }

  /** 
   * @returns {string} Returns a string representation of the point and color as 'x,y #rrggbb'. 
   */
  String() {
    let hexStr = this.args.color.Info().hex.string;
    return `${this.args.point.args.x},${this.point.args.y} ${hexStr}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'POINT_AND_COLOR';

    let pointErr = new Err.ErrorMessage.Builder() 
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

    let colorErr = new Err.ErrorMessage.Builder()
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
        type: 'Coordinates'
      },
      color: {
        type: 'Color'
      }
    };
  }
}

//--------------------------------
// EXPORTS

exports.PointAndColor = PointAndColor;