let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

let MIN_WIDTH = 1;
let MIN_HEIGHT = 1;

//----------------------------------------
// COLOR CANVAS

class BilinearCanvas extends CANVAS_BASECLASS {
  constructor(width, height, pointAndColorArray, softBlend) {
    super(width, height);
    this.pointAndColorArray_ = pointAndColorArray;
    this.softBlend_ = softBlend;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let stringArr = this.pointAndColorArray_.map(x => x.String());

    let args = ['-size', `${this.width_}x${this.height_}`, 'canvas:', '-colorspace', 'RGB', '-sparse-color', 'Bilinear', stringArr.join(' ')];

    if (this.softBlend_)
      args.push('-colorspace', 'sRGB');

    if (this.Primitives().length > 0)
      this.Primitives().forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'BilinearCanvas';
  }

  /**
   * Create a BilinearCanvas object with the specified properties. Requires exactly 4 points and colors. Results in a 4-point gradient.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {Array<PointAndColor>} pointAndColorArray Array of PointAndColor objects.
   * @param {boolean} softBlend Set to true if softer blend between colors is desired. Otherwise, blend will be harsher and colors slightly deeper.
   * @returns {BilinearCanvas} Returns a BilinearCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, pointAndColorArray, softBlend) {
    if (width < MIN_WIDTH || height < MIN_HEIGHT || !pointAndColorArray || pointAndColorArray.length != 4)
      return null;

    return new BilinearCanvas(width, height, pointAndColorArray, softBlend);
  }
}

//-----------------------------
// EXPORTS

exports.Create = BilinearCanvas.Create;
exports.Name = 'BilinearCanvas';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';