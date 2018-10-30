let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let COORDINATES = require(PATH.join(rootDir, 'im_modules', 'inputs', 'coordinates.js')).Create;
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//-----------------------------------

class Line extends PRIMITIVE_BASECLASS {
  /**
   * @param {Coordinates} start Start coordinates (Required)
   * @param {Coordinates} end End coordinates (Required)
   * @param {string} color Valid color format string used in Image Magick. (Optional)
   * @param {number} width Width of line. Larger values produce thicker lines. (Optional)
   */
  constructor(start, end, color, width) {
    super();
    this.start_ = start;
    this.end_ = end;
    this.color_ = color;
    this.width_ = width;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the line.
   */
  Args() {
    let args = [];

    if (this.color_)
      args.push('-stroke', this.color_);

    if (this.width_)
      args.push('-strokewidth', this.width_);

    let start = COORDINATES(this.start_.x_ + this.xOffset_, this.start_.y_ + this.yOffset_);
    let end = COORDINATES(this.end_.x_ + this.xOffset_, this.end_.y_ + this.yOffset_);
    args.push('-draw', `line ${start.String()} ${end.String()}`);

    return args;
  }

  /**
   * Creates a Line object given the specified x and y coordinates.
   * @param {Coordinates} start Start coordinates (Required)
   * @param {Coordinates} end End coordinates (Required)
   * @param {string} color Valid color format string used in Image Magick. (Optional)
   * @param {number} width Width of line. Larger values produce thicker lines. (Optional)
   * @returns {Line} Returns an Line object. If inputs are invalid, it returns null.
   */
  static Create(start, end, color, width) {
    if (!start || !end)
      return null;

    return new Line(start, end, color, width);
  }
}

//--------------------------
// EXPORTS

exports.Create = Line.Create;