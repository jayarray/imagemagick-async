let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

let MIN_WIDTH = 1;
let MIN_HEIGHT = 1;

//----------------------------------------
// COLOR CANVAS

class VoronoiCanvas extends CANVAS_BASECLASS {
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

    let args = ['-size', `${this.width_}x${this.height_}`, 'canvas:', '-colorspace', 'RGB', '-sparse-color', 'Voronoi', stringArr.join(' ')];

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
    return 'VoronoiCanvas';
  }

  /**
   * Create a VoronoiCanvas object with the specified properties. Can have any number of points and colors. Maps each pixel to the closest color point you have provided. Divides the image into a set of polygonal cells around each point.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {Array<PointAndColor>} pointAndColorArray Array of PointAndColor objects.
   * @param {boolean} softBlend Set to true if softer blend between colors is desired. Otherwise, blend will be harsher and colors slightly deeper.
   * @returns {VoronoiCanvas} Returns a VoronoiCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, pointAndColorArray, softBlend) {
    if (width < MIN_WIDTH || height < MIN_HEIGHT || !pointAndColorArray)
      return null;

    return new VoronoiCanvas(width, height, pointAndColorArray, softBlend);
  }
}

//-----------------------------
// EXPORTS

exports.Create = VoronoiCanvas.Create;
exports.Name = 'VoronoiCanvas';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';