let MaskBaseClass = require('./maskbaseclass.js').MaskBaseClass;

//---------------------------------
// MASK

class Mask extends MaskBaseClass {
  constructor(src) {
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract'];
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
    return 'Mask';
  }

  /**
   * Create a Mask object. Transparent color is turned black and everything else is turned white. The final image is a black and white image.
   * @param {string} src
   * @returns {Mask} Returns a Mask object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new Mask(src);
  }
}

//----------------------------------
// WHITE MASK

class WhiteMask extends MaskBaseClass {
  constructor(src) {
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract', '-alpha', 'on'];
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
    return 'WhiteMask';
  }

  /**
   * Create a WhiteMask object. Transparent color is unaffected, but everything else is turned white. The final image is a white silhouette with transparent background.
   * @param {string} src
   * @returns {Mask} Returns a WhiteMask object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new WhiteMask(src);
  }
}

//---------------------------------
// BLACK MASK

class BlackMask extends MaskBaseClass {
  constructor(src) {
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract', '-alpha', 'on', '-negate'];
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
    return 'BlackMask';
  }

  /**
   * Create a BlackMask object. Transparent color is unaffected, but everything else is turned black. The final image is a black silhouette with transparent background.
   * @param {string} src
   * @returns {Mask} Returns a BlackMask object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new BlackMask(src);
  }
}

//---------------------------------
// COLOR MASK

class ColorMask extends MaskBaseClass {
  constructor(src, color) {
    this.src_ = src;
    this.color_ = color;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract', '-background', this.color_, '-alpha', 'shape'];
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
    return 'ColorMask';
  }

  /**
   * Create a ColorMask object. Creates a mask and fills it the specified color.
   * @param {string} src
   * @param {string} color
   * @returns {Mask} Returns a ColorMask object. If inputs are invalid, it returns null.
   */
  static Create(src, color) {
    if (!src || !color)
      return null;

    return new ColorMask(src, color);
  }
}

//---------------------------------
// FILL MASK

class FillMask extends MaskBaseClass {
  constructor(src, whiteReplacement, blackReplacement) {
    this.src_ = src;
    this.whiteReplacement_ = whiteReplacement;
    this.blackReplacement_ = blackReplacement;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract', '-background', this.whiteReplacement_, '-alpha', 'shape', '-background', this.blackReplacement_, '-alpha', 'remove'];
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
    return 'FillMask';
  }

  /**
   * Create a FillMask object. Takes an image, creates a mask, and replaces the white and black colors with others.
   * @param {string} src
   * @param {string} whiteReplacement Color that will replace white part of mask.
   * @param {string} blackReplacement Color that will replace black part of mask.
   * @returns {Mask} Returns a FillMask object. If inputs are invalid, it returns null.
   */
  static Create(src, whiteReplacement, blackReplacement) {
    if (!src || !whiteReplacement || !blackReplacement)
      return null;

    return new FillMask(src, whiteReplacement, blackReplacement);
  }
}

//-------------------------------
// EXPORTS

exports.CreateMaskMod = Mask.Create;
exports.CreateWhiteMaskMod = WhiteMask.Create;
exports.CreateBlackMaskMod = BlackMask.Create;
exports.CreateColorMaskMod = ColorMask.Create;
exports.CreateFillMaskMod = FillMask.Create;