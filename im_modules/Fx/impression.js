let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Impression extends FX_BASECLASS {
  constructor(src, direction, elevation) {
    super();
    this.src_ = src;
    this.direction_ = direction;
    this.elevation_ = elevation;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-shade', `${this.direction_}x${this.elevation_}`];
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
    return 'Impression';
  }

  /**
   * Create an Impression object. Depending on the input image, the resulting image may appear as if it was carved or engraved in a clay or stone like surface.
   * @param {string} src 
   * @param {number} direction Value determines the direction of the light source. A value of zero degrees starts east of the screen. A positive value indicates clockwise direction and a negative value indicates counter clockwisem direction.
   * @param {number} elevation Value determines the elevation of the light source. A Value of zero degrees indicates the light source is parallel to the image, and a value of 90 degrees indicates the light source is right above the image.
   * @returns {Impression} Returns an Impression object. If inputs are invalid, it returns null.
   */
  static Create(src, direction, elevation) {
    if (!src || isNaN(direction) || isNaN(elevation))
      return null;

    return new Impression(src, direction, elevation);
  }
}

//----------------------------
// EXPORTS

exports.Create = Impression.Create;
exports.Name = 'Impression';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';