let FxBaseClass = require('./fxbaseclass.js').FxBaseClass;

//---------------------------------
// SWIRL

class Swirl extends FxBaseClass {
  constructor(src, degrees) {
    super();
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-swirl', this.degrees_];
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
    return 'Swirl';
  }

  /**
   * Create a Swirl object. Applies a swirl effect to an image.
   * @param {string} src
   * @param {number} degrees Number of degrees to swirl. Positive values mean clockwise swirl. Negative values mean counter-clockwise swirl.
   * @returns {Swirl} Returns a Swirl object. If inputs are invalid, it returns null.
   */
  static Create(src, degrees) {
    if (!src || !degrees)
      return null;

    return new Swirl(src, degrees);
  }
}

//---------------------------------
// IMPLODE

class Implode extends FxBaseClass {
  constructor(src, factor) {
    super();
    this.src_ = src;
    this.factor_ = factor;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-implode', this.factor_];
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
    return 'Implode';
  }

  /**
   * Create an Implode object. Applies an implode effect to an image.
   * @param {string} src
   * @param {number} factor Implosions have values between 0 and 1 (and anything greater than 1 sucks pixels into oblivion). Explosions have values between 0 and -1 (and anything less than -1 distorts pixels outward). 
   * @returns {Implode} Returns an Implode object. If inputs are invalid, it returns null.
   */
  static Create(src, factor) {
    if (!src || !factor)
      return null;

    return new Implode(src, factor);
  }
}

//---------------------------------
// WAVE

class Wave extends FxBaseClass {
  constructor(src, amplitude, frequency) {
    super();
    this.src_ = src;
    this.amplitude_ = amplitude;
    this.frequency_ = frequency;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-background', 'transparent', '-wave', `${this.amplitude_}x${this.frequency_}`];
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
    return 'Wave';
  }

  /**
   * Create a Wave object. Applies a wave effect to an image. Uses formula F(x) = A * sin(Bx), where A is the amplitude and B is the frequency.
   * @param {string} src
   * @param {number} amplitude Total height of the wave in pixels.
   * @param {number} frequency The number of pixels in one cycle. Values greater than 1 result in tighter waves. Values less than 1 result in wider waves. 
   * @returns {Wave} Returns a Wave object. If inputs are invalid, it returns null.
   */
  static Create(src, amplitude, frequency) {
    if (!src || !amplitude || !frequency)
      return null;

    return new Wave(src, amplitude, frequency);
  }
}

//----------------------------------
// BLUR

/**
 * Apply blur filter to an image.
 * @param {string} src Source
 * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
 * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
 * @param {boolean} hasTransparency Assign as true if the image contains transparent pixels. False otherwise.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
class Blur extends FxBaseClass {
  constructor(src, radius, sigma, hasTransparency) {
    super();
    this.src_ = src;
    this.radius_ = radius;
    this.sigma_ = sigma;
    this.hasTransparency_ = hasTransparency;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [];

    if (this.hasTransparency_)
      args.push('-channel', 'RGBA');
    args.push('-blur', `${this.radius_}x${this.sigma_}`);

    return args;
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
    return 'Blur';
  }

  /**
   * Create a Blur object. Applies a blur filter to an image.
   * @param {string} src 
   * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
   * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
   * @param {boolean} hasTransparency Assign as true if the image contains transparent pixels. False otherwise.
   * @returns {Blur} Returns a Blur object. If inputs are invalid, it returns null.
   */
  static Create(src, radius, sigma, hasTransparency) {
    if (!src || !radius || !sigma || !hasTransparency)
      return null;

    return new Blur(src, radius, sigma, hasTransparency);
  }
}

//----------------------------------------------
// PAINT

class OilPainting extends FxBaseClass {
  constructor(src, paintValue) {
    super();
    this.src_ = src;
    this.paintValue_ = paintValue;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-paint', this.paintValue_];
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
    return 'OilPainting';
  }

  /**
   * Create a OilPainting object. Applies an oil painting filter to an image.
   * @param {string} src 
   * @param {number} paintValue An integer value greater than 0 that determines the intensity of the filter. Higher values will make it look more abstract and more like a painting.
   * @returns {OilPainting} Returns an OilPainting object. If inputs are invalid, it returns null.
   */
  static Create(src, paintValue) {
    if (!src || !paintValue)
      return null;

    return new OilPainting(src, paintValue);
  }
}

//-------------------------------------
// CHARCOAL SKETCH

class CharcoalSketch extends FxBaseClass {
  constructor(src, charcoalValue) {
    super();
    this.src_ = src;
    this.charcoalValue_ = charcoalValue;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-charcoal', this.charcoalValue_];
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
    return 'CharcoalSketch';
  }

  /**
   * Create a CharcoalSketch object. Applies a charcoal sketch filter to an image.
   * @param {string} src 
   * @param {number} charcoalValue An integer value greater than 0 that determines the intensity of the filter. Higher values will make it look more smudged and more like a charcoal sketch.
   * @returns {CharcoalSketch} Returns a CharcoalSketch object. If inputs are invalid, it returns null.
   */
  static Create(src, charcoalValue) {
    if (!src || !charcoalValue)
      return null;

    return new CharcoalSketch(src, charcoalValue);
  }
}

//-------------------------------------
// COLORING BOOK SKETCH

class ColoringBookSketch extends FxBaseClass {
  constructor(src, isHeavilyShaded) {
    super();
    this.src_ = src;
    this.isHeavilyShaded_ = isHeavilyShaded;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [];

    if (this.isHeavilyShaded_)
      args.push('-segment', '1x1', '+dither', '-colors', 2);
    args.push('-edge', 1, '-negate', '-normalize', '-colorspace', 'Gray', '-blur', '0x.5', '-contrast-stretch', '0x50%');

    return args;
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
    return 'ColoringBookSketch';
  }

  /**
   * Create a ColoringBookSketch object. Applies a coloring book sketch filter to an image.
   * @param {string} src 
   * @param {boolean} isHeavilyShaded Assign as true if the image has a lot of shading. False otherwise.
   * @returns {ColoringBookSketch} Returns a ColoringBookSketch object. If inputs are invalid, it returns null.
   */
  static Create(src, isHeavilyShaded) {
    if (!src || !isHeavilyShaded)
      return null;

    return new ColoringBookSketch(src, isHeavilyShaded);
  }
}

//-----------------------------------------
// PENCIL SKETCH

class PencilSketch extends FxBaseClass {
  constructor(src, radius, sigma, angle) {
    super();
    this.src_ = src;
    this.radius_ = radius;
    this.sigma_ = sigma;
    this.angle_ = angle;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-colorspace', 'Gray', '-sketch', `${this.radius_}x${this.sigma_}+${this.angle_}`];
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
    return 'PencilSketch';
  }

  /**
   * Create a PencilSketch object. Applies a pencil sketch filter to an image.
   * @param {string} src 
   * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
   * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
   * @param {number} angle Integer value that dteermines the angle of the pencil strokes.
   * @returns {PencilSketch} Returns a PencilSketch object. If inputs are invalid, it returns null.
   */
  static Create(src, radius, sigma, angle) {
    if (!src || !radius || !sigma || !angle)
      return null;

    return new PencilSketch(src, radius, sigma, angle);
  }
}

//---------------------------------
// EXPORTS
exports.CreateSwirlFx = Swirl.Create;
exports.CreateImplodeFx = Implode.Create;
exports.CreateWaveFx = Wave.Create;

exports.CreateBlurFx = Blur.Create;
exports.CreateCharcoalSketchFx = CharcoalSketch.Create;
exports.CreateColoringBookSketchFx = ColoringBookSketch.Create;
exports.CreateOilPaintingFx = OilPainting.Create;
exports.CreatePencilSketchFx = PencilSketch.Create;