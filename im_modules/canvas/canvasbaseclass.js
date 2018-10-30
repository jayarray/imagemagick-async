let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let LAYER_BASECLASS = require(PATH.join(rootDir, 'im_modules', 'layer', 'layerbaseclass.js')).LayerBaseClass;

//---------------------------------

class CanvasBaseClass extends LAYER_BASECLASS {
  constructor(width, height) {
    super();
    this.width_ = width;
    this.height_ = height;
    this.primitives_ = [];
  }

  /**
   * Add a Primitive object to this canvas.
   * @param {Primitive} p 
   * @param {number} xOffset 
   * @param {number} yOffset 
   */
  AddPrimitive(p, xOffset, yOffset) {
    p.xOffset_ = xOffset;
    p.yOffset_ = yOffset;
    this.primitives_.push(p);
  }

  /**
   * @returns {Array<Primitive>} Returns an array of Primitive objects.
   */
  Primitives() {
    return this.primitives_;
  }

  /**
   * Get list of arguments required to draw the canvas.
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return []; // Override
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'canvas';
  }

  /**
   * @override
   * @returns {string} Returns a string of the command used to render the canvas.
   */
  Command() {
    return 'convert';
  }

  /**
   * @returns {number} Returns the width of the canvas.
   */
  Width() {
    return this.width_;
  }

  /**
   * @returns {number} Returns the height of the canvas.
   */
  Height() {
    return this.height_;
  }
}

//------------------------------
// EXPORTS

exports.CanvasBaseClass = CanvasBaseClass;