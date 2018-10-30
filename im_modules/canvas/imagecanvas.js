let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let VALIDATE = require(PATH.join(rootDir, 'im_modules', 'validation', 'validate.js'));
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

//-----------------------------------

class ImageCanvas extends CANVAS_BASECLASS {
  /**
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} src Source
   */
  constructor(width, height, src) {
    super(width, height);
    this.src_ = src;
  }

  /** 
   * @override 
   * @returns {Array<string|number>} Returns an array of arguments.
   * */
  Args() {
    let args = [this.src_];

    if (this.Primitives().length > 0)
      this.Primitives().forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'ImageCanvas';
  }

  /**
   * Create an ImageCanvas object. If inputs are invalid it returns null.
   * @param {string} src Source
   */
  static Create(width, height, src) {
    if (VALIDATE.IsStringInput(src))
      return null;

    return new ImageCanvas(width, height, src);
  }
}

//-----------------------------
// EXPORTS

exports.Create = ImageCanvas.Create;
exports.Name = 'ImageCanvas';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';