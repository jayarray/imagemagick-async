let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Edge extends FX_BASECLASS {
  constructor(src, edgeValue) {
    super();
    this.src_ = src;
    this.edgeValue_ = edgeValue;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-edge', this.edgeValue_];
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
    return 'Edge';
  }

  /**
   * Create an Edge object. Applies an edge filter to an image.
   * @param {string} src Source
   * @param {number} edgeValue Value used to determine how thick to draw edges around an image. The higher the value, the thicker the lines.
   * @returns {Edge} Returns an Edge object. If inputs are invalid, it returns null.
   */
  static Create(src, edgeValue) {
    if (!src || isNaN(edgeValue))
      return null;

    return new Edge(src, edgeValue);
  }
}

//----------------------------
// EXPORTS

exports.Create = Edge.Create;
exports.Name = 'Edge';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';