let PATH = require('path');
let CUT_BASECLASS = require(PATH.join(__dirname, 'cutbaseclass.js')).CutBaseClass;

//------------------------------------

class CutIn extends CUT_BASECLASS {
  constructor(baseImagePath, cutoutImagePath) {
    super();
    this.src1_ = baseImagePath;
    this.src2_ = cutoutImagePath;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Dst_In', '-composite'];
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
    return 'CutIn';
  }

  /**
   * Create a CutIn object. Cut into an image. (It's like removing all the dough around the cookie cutter.)
   * @param {string} baseImagePath The path for the image you want to cut out of.
   * @param {string} cutoutImagePath The path for the image you want to use as a mask.
   * @returns {CutIn} Returns a CutIn object. If inputs are invalid, it returns null.
   */
  static Create(baseImagePath, cutoutImagePath) {
    if (!baseImagePath || !cutoutImagePath)
      return null;

    return new CutIn(baseImagePath, cutoutImagePath);
  }
}

//-----------------------------
// EXPORTS

exports.Create = CutIn.Create;
exports.Name = 'CutIn';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';