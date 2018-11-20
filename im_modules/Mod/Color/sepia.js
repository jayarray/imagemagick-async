let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Sepia extends COLOR_BASECLASS {
  constructor(src, percent) {
    super();
    this.src_ = src;
    this.percent_ = percent;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-sepia-tone', `${this.percent_}%`];
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
    return 'Sepia';
  }

  /**
   * Create a Sepia object. Recolors an image in sepia tone and gives the image an 'old looking' feel.
   * @param {string} src
   * @param {number} percent The closer the value is to zero, the higher the contrast will be and the sepia color will become more golden. The higher the value, the lower the contrast will be and the sepia tone will be depper become more brown.
   * @returns {Sepia} Returns a Sepia object. If inputs are invalid, it returns null.
   */
  static Create(src, percent) {
    if (!src || isNaN(percent))
      return null;

    return new Sepia(src, percent);
  }
}

//-----------------------------
// EXPORTS

exports.Create = Sepia.Create;
exports.Name = 'Sepia';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';