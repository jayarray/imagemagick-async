let PATH = require('path');
let COMPOSE_BASECLASS = require(PATH.join(__dirname, 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Union extends COMPOSE_BASECLASS {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Lighten', '-composite'];
  }

  /**
   * @override
   */
  NumberOfSources() {
    return 2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return this.Args();
  }

  /**
   * Replace current source with new source.
   */
  UpdateSources(newSources) {
    for (let i = 0; i < this.NumberOfSources(); ++i) {
      let currNewSrc = newSources[i];
      if (currNewSrc) {
        let variableName = `src${i + 1}_`;
        this[variableName] = currNewSrc;
      }
    }
  }

  /**
   * @override
   */
  Name() {
    return 'Union';
  }

  /**
   * Create a Union object. Get the union of pixels. If images are colored, intersecting pixel colors are added. (Best used with black and white images/masks)
   * @param {string} src1
   * @param {string} src2
   * @returns {Union} Returns a Union object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src1 || !src2)
      return null;

    return new Union(src1, src2);
  }
}

//-----------------------
// EXPORTS

exports.Create = Union.Create;