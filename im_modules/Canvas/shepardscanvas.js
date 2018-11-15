let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

let MIN_WIDTH = 1;
let MIN_HEIGHT = 1;

//----------------------------------------
// COLOR CANVAS

class ShepardsCanvas extends CANVAS_BASECLASS {
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

    let args = ['-size', `${this.width_}x${this.height_}`, 'canvas:', '-colorspace', 'RGB', '-sparse-color', 'Shepards', stringArr.join(' ')];

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
    return 'ShepardsCanvas';
  }

  /**
   * Create a ShepardsCanvas object with the specified properties. Can have any number of points and colors. Produces an image that looks like spotlights of color that interact with each other as the light spreads out to a uniform average of all the given colors.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {Array<PointAndColor>} pointAndColorArray Array of PointAndColor objects.
   * @param {boolean} softBlend Set to true if softer blend between colors is desired. Otherwise, blend will be harsher and colors slightly deeper.
   * @returns {ShepardsCanvas} Returns a ShepardsCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, pointAndColorArray, softBlend) {
    if (width < MIN_WIDTH || height < MIN_HEIGHT || !pointAndColorArray)
      return null;

    return new ShepardsCanvas(width, height, pointAndColorArray, softBlend);
  }
}

//-----------------------------
// EXPORTS

exports.Create = ShepardsCanvas.Create;
exports.Name = 'ShepardsCanvas';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';