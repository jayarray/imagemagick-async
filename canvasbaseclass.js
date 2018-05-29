let LayerBaseClass = require('./layerbaseclass.js').LayerBaseClass;

//---------------------------------

class CanvasBaseClass extends LayerBaseClass {
  constructor() {
    super();
    this.primitives_ = [];
  }

  /**
   * Add a Primitive object to this canvas.
   * @param {Primitive} p 
   * @param {number} xOffset 
   * @param {number} yOffset 
   */
  AddPrimitive(p, xOffset, yOffset) {
    this.primitives_.push({ primitive: p, xOffset: xOffset, yOffset: yOffset });
  }

  /**
   * @returns {Array<Primitive>} Returns an array of Primitive objects.
   */
  Primitives() {
    return this.primitives_;
  }

  /**
   * Get list of arguments required to draw the canvas.
   * @param {Array<Primitive>} primitives
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  GetArgs_() {
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
   * @returns {Array<string>} Returns an array of fx and mod names that can be included in a canvas' args.
   */
  static InlineEffects() {
    return [
      'Negate',
      'Colorize',
      'GrayscaleFormat',
      'RgbFormat',
      'Replace',
      'AutoLevel',
      'Swirl',
      'Implode',
      'Wave',
      'Blur',
      'OilPainting',
      'CharcoalSketch',
      'Roll',
      'MirrorHorizontal',
      'MirrorVertical',
      'Transpose',
      'Transverse',
      'Offset',
      'RotateAroundCenter',
      'RotateAroundPoint',
      'ResizeIgnoreAspectRatio',
      'ResizeOnlyShrinkLarger',
      'ResizeOnlyEnlargeSmaller',
      'ResizeFillGivenArea',
      'ResizePercentage',
      'ResizePixelCountLimit'
    ];
  }
}

//------------------------------
// EXPORTS

exports.CanvasBaseClass = CanvasBaseClass;