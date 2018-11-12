let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

let MIN_WIDTH = 1;
let MIN_HEIGHT = 1;

//----------------------------------------
// COLOR CANVAS

class BarycentricCanvas extends CANVAS_BASECLASS {
  constructor(width, height, pointAndColorArray, softBlend) {
    super(width, height);
    this.startColor_ = startColor;
    this.endColor_ = endColor;
    this.pointAndColorArray_ = pointAndColorArray;
    this.softBlend_ = softBlend;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let stringArr = this.pointAndColorArray_.map(x => x.String());

    let args = ['-size', `${this.width_}x${this.height_}`, 'canvas:', '-colorspace', 'RGB', '-sparse-color', 'Barycentric', stringArr.join(' ')];

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
    return 'BarycentricCanvas';
  }

  /**
   * Create a BarycentricCanvas object with the specified properties. Requires exactly 3 points and colors. Results in a triangular gradient.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {PointAndColor} pointAndColorArray Array of PointAndColor objects.
   * @param {boolean} softBlend Set to true if softer blend between colors is desired. Otherwise, blend will be harsher and colors slightly deeper.
   * @returns {BarycentricCanvas} Returns a BarycentricCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, pointAndColorArray, softBlend) {
    if (width < MIN_WIDTH || height < MIN_HEIGHT || !pointAndColorArray || pointAndColorArray.length != 3)
      return null;

    return new BarycentricCanvas(width, height, pointAndColorArray, softBlend);
  }
}

//-----------------------------
// EXPORTS

exports.Create = BarycentricCanvas.Create;
exports.Name = 'BarycentricCanvas';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';