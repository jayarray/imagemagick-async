let PATH = require('path');
let COMPOSE_BASECLASS = require(PATH.join(__dirname, 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Intersection extends COMPOSE_BASECLASS {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Darken', '-composite'];
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
    return 'Intersection';
  }

  /**
   * Create an Intersection object. Get the intersection of pixels. If images are colored, the intersecting pixels are blacked out. (Best used with black and white images/masks)
   * @param {string} src1
   * @param {string} src2
   * @returns {Intersectionion} Returns an Intersection object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src1 || !src2)
      return null;

    return new Intersection(src1, src2);
  }
}

//-----------------------------
// EXPORTS

exports.Create = Intersection.Create;