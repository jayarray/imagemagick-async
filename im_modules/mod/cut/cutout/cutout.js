let PATH = require('path');
let CUT_BASECLASS = require(PATH.join(__dirname, 'cutbaseclass.js')).CutBaseClass;

//------------------------------------

class CutOut extends CUT_BASECLASS {
  constructor(baseImagePath, cutoutImagePath) {
    super();
    this.src1_ = baseImagePath;
    this.src2_ = cutoutImagePath;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Dst_Out', '-composite'];
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return this.Args();
  }

  /**
   * @override
   */
  Name() {
    return 'CutOut';
  }

  /**
   * Create a CutOut object. Cut an image out from the other. (It's like removing dough with a cookie cutter.)
   * @param {string} baseImagePath The path for the image you want to cut out of.
   * @param {string} cutoutImagePath The path for the image you want to use as a mask.
   * @returns {CutOut} Returns a CutOut object. If inputs are invalid, it returns null.
   */
  static Create(baseImagePath, cutoutImagePath) {
    if (!baseImagePath || !cutoutImagePath)
      return null;

    return new CutOut(baseImagePath, cutoutImagePath);
  }
}

//-------------------------
// EXPORTS

exports.Create = CutOut.Create;