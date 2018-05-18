

let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

let Layer = require('./layerbase.js').Layer;

//------------------------------------
// CUT (base class)

class Cut extends Layer {
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

//--------------------------------------
// OUT

class CutOut extends Cut {
  constructor(baseImagePath, cutoutImagePath) {
    super();
    this.baseImagePath_ = baseImagePath;
    this.cutoutImagePath_ = cutoutImagePath;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [baseImagePath, cutoutImagePath, '-compose', 'Dst_Out', '-composite'];
  }

  /**
   * Create a CutOut object. Cut an image out from the other. (It's like removing dough with a cookie cutter.)
   * @param {string} baseImagePath The path for the image you want to cut out of.
   * @param {string} cutoutImagePath The path for the image you want to use as a mask.
   * @returns {CutOut} Returns a CutOut object. If inputs are invalid, it returns null.
   */
  static Create(filepaths, gravity) {
    if (!filepaths)
      return null;

    return new CutOut(baseImagePath, cutoutImagePath);
  }
}

//--------------------------------------
// IN

class CutIn extends Cut {
  constructor(baseImagePath, cutoutImagePath) {
    super();
    this.baseImagePath_ = baseImagePath;
    this.cutoutImagePath_ = cutoutImagePath;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [baseImagePath, cutoutImagePath, '-compose', 'Dst_In', '-composite'];
  }

  /**
   * Create a CutIn object. Cut into an image. (It's like removing all the dough around the cookie cutter.)
   * @param {string} baseImagePath The path for the image you want to cut out of.
   * @param {string} cutoutImagePath The path for the image you want to use as a mask.
   * @returns {CutIn} Returns a CutIn object. If inputs are invalid, it returns null.
   */
  static Create(filepaths, gravity) {
    if (!filepaths)
      return null;

    return new CutOut(baseImagePath, cutoutImagePath);
  }
}

//------------------------------------
// EXPORTS

exports.CreateCutOutMod = CutOut.Create;
exports.CreateCutInMod = CutIn.Create;
