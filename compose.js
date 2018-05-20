let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;
let Layer = require('./layerbase.js').Layer;

//------------------------------------------
// CONSTANTS

const MIN_FILEPATHS = 2;

//-------------------------------------------
// COMPOSE (base class)

class Compose extends Layer {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    // Override
  }

  /**
   * @override
   * @returns {string} Returns a string of the command used to render the mod.
   */
  Command() {
    return 'convert';
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'mod';
  }
}

//-------------------------------------------
// COMPOSITE

class Composite extends Compose {
  constructor(filepaths, gravity) {
    super();
    this.filepaths_ = filepaths;
    this.gravity_ = gravity;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = [];

    if (this.gravity_)
      args.push('-gravity', this.gravity_);

    // Add first 2 paths
    args.push(this.filepaths_[0], this.filepaths_[1]);

    // Add other parts accordingly
    for (let i = 2; i < this.filepaths_.length; ++i) {
      args.push('-composite', this.filepaths_[i]);
    }

    args.push('-composite');

    return args;
  }

  /**
   * Create a Composite object. Creates a single image from a list of provided images. The first image is the bottom-most layer and the last image is the top-most layer.
   * @param {Array<string>} filepaths
   * @returns {Composite} Returns a Composite object. If inputs are invalid, it returns null.
   */
  static Create(filepaths, gravity) {
    if (!filepaths || filepaths.length < 2)
      return null;

    return new Composite(filepaths, gravity);
  }
}

//--------------------------------------
// MULTIPLY (white transparency)

class MultiplyWhiteTransparency extends Compose {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return ['-compose', 'Multiply', this.src1_, this.src2_, '-composite'];
  }

  /**
   * Create a MultiplyWhiteTransparency object.  Overlay colors of image with white background onto the other. Overlaying colors attenuate to black. That is, this operation only darkens colors (never lightens them). NOTE: Black will result in black.
   * @param {string} src1
   * @param {string} src2
   * @returns {MultiplyWhiteTransparency} Returns a MultiplyWhiteTransparency object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src || !src2)
      return null;

    return new MultiplyWhiteTransparency(src1, src2);
  }
}

//--------------------------------------
// MULTIPLY (black transparency)

class MultiplyBlackTransparency extends Compose {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return ['-compose', 'Screen', this.src1_, this.src2_, '-composite'];
  }

  /**
   * Create a MultiplyBlackTransparency object. Overlay colors of image with black background onto the other. Overlaying colors attenuate to white. That is, this operation only lightens colors (never darkens them). NOTE: White will result in white.
   * @param {string} src1
   * @param {string} src2
   * @returns {MultiplyBlackTransparency} Returns a MultiplyBlackTransparency object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src || !src2)
      return null;

    return new MultiplyBlackTransparency(src1, src2);
  }
}

//--------------------------------------
// ADD

class Add extends Compose {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return ['-compose', 'plus', this.src1_, this.src2_, '-composite'];
  }

  /**
   * Create an Add object. Blend the images equally. All overlapping pixel colors are added together. 
   * @param {string} src1
   * @param {string} src2
   * @returns {Add} Returns an Add object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src || !src2)
      return null;

    return new Add(src1, src2);
  }
}

//--------------------------------------
// SUBTRACT

class Subtract extends Compose {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return ['-compose', 'minus', this.src1_, this.src2_, '-composite'];
  }

  /**
   * Create a Subtract object. Subtract one image from the other: src1 - src2. Overlapping pixel colors are subtracted. 
   * @param {string} src1
   * @param {string} src2
   * @returns {Subtract} Returns a Subtract object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src || !src2)
      return null;

    return new Subtract(src1, src2);
  }
}

//--------------------------------------
// SET THEORY

class Union extends Compose {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Lighten', '-composite'];
  }

  /**
   * Create a Union object. Get the union of pixels. If images are colored, intersecting pixel colors are added. (Best used with black and white images/masks)
   * @param {string} src1
   * @param {string} src2
   * @returns {Union} Returns a Union object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src || !src2)
      return null;

    return new Union(src1, src2);
  }
}

class Intersection extends Compose {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Darken', '-composite'];
  }

  /**
   * Create an Intersection object. Get the intersection of pixels. If images are colored, the intersecting pixels are blacked out. (Best used with black and white images/masks)
   * @param {string} src1
   * @param {string} src2
   * @returns {Intersectionion} Returns an Intersection object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src || !src2)
      return null;

    return new Intersection(src1, src2);
  }
}

class Difference extends Compose {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Difference', '-composite'];
  }

  /**
   * Create a Difference object. Get the difference (XOR) of pixels. If images are colored, it produces same result as the Union operator. (Best used with black and white images/masks)
   * @param {string} src1
   * @param {string} src2
   * @returns {Difference} Returns a Difference object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src || !src2)
      return null;

    return new Difference(src1, src2);
  }
}

class Exclusion extends Compose {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Minus_Src', '-composite'];
  }

  /**
   * Create an Exclusion object. Get the exclusion (relative complement) of pixels. Results in A-B => Everything in A that is NOT in B. If the images are colored, the result is src2 overlapping src1. (Best used with black and white images/masks)
   * @param {string} src1
   * @param {string} src2
   * @returns {Exclusion} Returns a Exclusion object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src || !src2)
      return null;

    return new Exclusion(src1, src2);
  }
}

//--------------------------------------
// MASKS

class ChangedPixels extends Compose {
  constructor(src1, src2, fuzz) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
    this.fuzz_ = fuzz;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = [this.src1_, this.src2_];

    if (this.fuzz_)
      args.push('-fuzz', `${this.fuzz_}%`);
    args.push('-compose', 'ChangeMask', '-composite');

    return args;
  }

  /**
   * Create an ChangedPixels object. Make specific pixels fully transparent. That is, the pixels in src2 that match those in src1 will become transparent.
   * @param {string} src1
   * @param {string} src2
   * @param {number} fuzz (Optional) Value between 1 and 100 that helps group similar colors together. (Small values help with slight color variations)
   * @returns {ChangedPixels} Returns a ChangedPixels object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2, fuzz) {
    if (!src || !src2)
      return null;

    return new ChangedPixels(src1, src2, fuzz);
  }
}

class UnchangedPixels extends Compose {
  constructor(src1, src2, fuzz) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
    this.fuzz_ = fuzz;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = [this.src1_, this.src2_];

    if (this.fuzz_)
      args.push('-fuzz', `${this.fuzz_}%`);
    args.push('-compose', 'ChangeMask', '-composite', '-channel', 'A', '-negate');

    return args;
  }

  /**
   * Create an UnchangedPixels object. Get an image showing the similarities between two images.
   * @param {string} src1
   * @param {string} src2
   * @param {number} fuzz (Optional) Value between 1 and 100 that helps group similar colors together. (Small values help with slight color variations)
   * @returns {UnchangedPixels} Returns a UnchangedPixels object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2, fuzz) {
    if (!src || !src2)
      return null;

    return new UnchangedPixels(src1, src2, fuzz);
  }
}

//---------------------------------------
// EXPORTS

exports.CreateCompositeMod = Composite.Create;
exports.CreateMultiplyWhiteTransparencyMod = MultiplyWhiteTransparency.Create;
exports.CreateMultiplyBlackTransparencyMod = MultiplyBlackTransparency.Create;
exports.CreateAddMod = Add.Create;
exports.CreateSubtractMod = Subtract.Create;
exports.CreateUnionMod = Union.Create;
exports.CreateIntersectionMod = Intersection.Create;
exports.CreateDifferenceMod = Difference.Create;
exports.CreateExclusionMod = Exclusion.Create;
exports.CreateChangedPixelsMod = ChangedPixels.Create;
exports.CreateUnchangedPixelsMod = UnchangedPixels.Create;