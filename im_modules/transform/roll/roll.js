let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class Roll extends TRANSFORM_BASECLASS {
  constructor(src, horizontal, vertical) {
    super();
    this.src_ = src;
    this.horizontal_ = horizontal;
    this.vertical_ = vertical;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-roll'];

    let rollStr = '';

    if (this.horizontal_ >= 0)
      rollStr += `+${this.horizontal_}`;
    else
      rollStr += this.horizontal_;

    if (this.vertical_ > 0)
      rollStr += `-${this.vertical_}`;
    else
      rollStr += `+${Math.abs(this.vertical_)}`;

    args.push(rollStr);

    return args;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return [this.src_].concat(this.Args());
  }

  /**
   * @override
   */
  Name() {
    return 'Roll';
  }

  /**
   * Create a Roll object. Rolls the image according to the given horizontal and vertical pixel values.
   * @param {string} src
   * @param {number} horizontal Number of pixels to roll in this direction.
   * @param {number} vertical Number of pixels to roll in this direction.
   * @returns {Roll} Returns a Roll object. If inputs are invalid, it returns null.
   */
  static Create(src, horizontal, vertical) {
    if (!src || isNaN(horizontal) || isNaN(vertical))
      return null;

    return new Roll(src, horizontal, vertical);
  }
}

//------------------------------
// EXPORTs

exports.Create = Roll.Create;