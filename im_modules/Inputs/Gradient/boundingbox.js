let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//------------------------------

class BoundingBox extends InputsBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'BoundingBox';
        this.name = 'BoundingBox'
        this.args = {};
      }

      /**
       * @param {Coordinates} coordinates Coordinates for the center of the bounding box.
       */
      center(coordinates) {
        this.args.center = coordinates;
        return this;
      }

      /**
       * @param {number} n Width (in pixels)
       */
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n Height (in pixels)
       */
      height(n) {
        this.args.height = n;
        return this;
      }

      build() {
        return new BoundingBox(this);
      }
    }
    return new Builder();
  }

  /** 
   * @returns {string} Returns a string representation of the bounding box args.
   */
  String() {
    return `${this.args.width}x${this.args.height}+${this.args.center.args.x}+${this.args.center.args.y}`;
  }

  /**
   * @override
   */
  Errors() {
    let params = BoundingBox.Parameters();
    let errors = [];
    let prefix = 'BOUNDING_BOX_ERROR';

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

    return errors;
  }

	/**
	 * @override
	 */
  static Parameters() {
    return {
      center: {
        type: 'Coordinates'
      },
      width: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      height: {
        type: 'number',
        subtype: 'integer',
        min: 1
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.BoundingBox = BoundingBox;
