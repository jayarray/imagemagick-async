let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class AutoLevel extends COLOR_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-auto-level'];
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
    return 'AutoLevel';
  }

  /**
   * Create a AutoLevel object. Renders an image whose colors are normalized (brightened). Makes really dark compare/difference images easier to analyze.
   * @param {string} src
   * @returns {AutoLevel} Returns a AutoLevel object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new ChannelAdjust(src);
  }
}

//----------------------------
// EXPORTS

exports.Create = AutoLevel.Create;